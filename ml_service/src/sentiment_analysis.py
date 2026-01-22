"""
Social Media Sentiment Analysis for Betting
Analyzes Twitter, Reddit, and news sentiment to gauge public opinion
and identify contrarian betting opportunities
"""

import os
import tweepy
import praw
import requests
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import re
from datetime import datetime, timedelta
from collections import defaultdict
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    def __init__(self):
        # Twitter API
        self.twitter_client = tweepy.Client(
            bearer_token=os.getenv('TWITTER_BEARER_TOKEN'),
            wait_on_rate_limit=True
        )
        
        # Reddit API
        self.reddit = praw.Reddit(
            client_id=os.getenv('REDDIT_CLIENT_ID'),
            client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
            user_agent='CourtEdge Sentiment Analyzer 1.0'
        )
        
        # VADER sentiment analyzer (better for social media)
        self.vader = SentimentIntensityAnalyzer()
        
        # News API
        self.news_api_key = os.getenv('NEWS_API_KEY')
        
        # Betting keywords
        self.bet_keywords = ['bet', 'wager', 'lock', 'pick', 'play', 'parlay', 
                            'spread', 'moneyline', 'over', 'under', 'hammer']
        
        self.sentiment_cache = {}
        self.cache_expiry = 3600  # 1 hour
    
    def analyze_twitter_sentiment(self, team_name, player_name=None, hours_back=24):
        """
        Analyze Twitter sentiment for team/player
        """
        logger.info(f"Analyzing Twitter sentiment for {team_name}")
        
        try:
            # Build search query
            query_parts = [team_name]
            if player_name:
                query_parts.append(player_name)
            
            # Add betting keywords
            query = ' OR '.join(query_parts) + ' (' + ' OR '.join(self.bet_keywords) + ')'
            query += ' -is:retweet lang:en'
            
            # Search tweets
            end_time = datetime.utcnow()
            start_time = end_time - timedelta(hours=hours_back)
            
            tweets = self.twitter_client.search_recent_tweets(
                query=query,
                max_results=100,
                start_time=start_time,
                tweet_fields=['created_at', 'public_metrics', 'author_id']
            )
            
            if not tweets.data:
                return self._empty_sentiment_result()
            
            sentiments = []
            engagement_weights = []
            
            for tweet in tweets.data:
                # Calculate engagement score
                metrics = tweet.public_metrics
                engagement = (
                    metrics['like_count'] * 1 +
                    metrics['retweet_count'] * 2 +
                    metrics['reply_count'] * 1.5 +
                    metrics['quote_count'] * 2
                )
                
                # Analyze sentiment
                text = self._clean_text(tweet.text)
                sentiment = self.vader.polarity_scores(text)
                
                sentiments.append(sentiment)
                engagement_weights.append(np.log1p(engagement))
            
            # Calculate weighted average sentiment
            weighted_sentiment = self._calculate_weighted_sentiment(
                sentiments, engagement_weights
            )
            
            return {
                'platform': 'twitter',
                'entity': team_name,
                'player': player_name,
                'tweet_count': len(tweets.data),
                'sentiment_score': weighted_sentiment['compound'],
                'positive_pct': weighted_sentiment['pos_pct'],
                'negative_pct': weighted_sentiment['neg_pct'],
                'neutral_pct': weighted_sentiment['neu_pct'],
                'sentiment_category': self._categorize_sentiment(weighted_sentiment['compound']),
                'analyzed_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Twitter sentiment analysis error: {e}")
            return self._empty_sentiment_result()
    
    def analyze_reddit_sentiment(self, team_name, player_name=None, limit=100):
        """
        Analyze Reddit sentiment from sports betting subreddits
        """
        logger.info(f"Analyzing Reddit sentiment for {team_name}")
        
        try:
            subreddits = ['sportsbook', 'nba', 'fantasybball', 'NBAbetting']
            
            all_sentiments = []
            all_scores = []
            
            for subreddit_name in subreddits:
                subreddit = self.reddit.subreddit(subreddit_name)
                
                # Search query
                search_query = team_name
                if player_name:
                    search_query += f' {player_name}'
                
                # Get recent posts and comments
                for submission in subreddit.search(search_query, time_filter='day', limit=limit//len(subreddits)):
                    # Analyze post title and body
                    text = submission.title + ' ' + submission.selftext
                    text = self._clean_text(text)
                    
                    sentiment = self.vader.polarity_scores(text)
                    score_weight = np.log1p(submission.score)
                    
                    all_sentiments.append(sentiment)
                    all_scores.append(score_weight)
                    
                    # Analyze top comments
                    submission.comments.replace_more(limit=0)
                    for comment in submission.comments.list()[:5]:
                        if hasattr(comment, 'body'):
                            comment_text = self._clean_text(comment.body)
                            comment_sentiment = self.vader.polarity_scores(comment_text)
                            comment_score = np.log1p(comment.score if comment.score > 0 else 1)
                            
                            all_sentiments.append(comment_sentiment)
                            all_scores.append(comment_score)
            
            if not all_sentiments:
                return self._empty_sentiment_result()
            
            weighted_sentiment = self._calculate_weighted_sentiment(
                all_sentiments, all_scores
            )
            
            return {
                'platform': 'reddit',
                'entity': team_name,
                'player': player_name,
                'post_count': len(all_sentiments),
                'sentiment_score': weighted_sentiment['compound'],
                'positive_pct': weighted_sentiment['pos_pct'],
                'negative_pct': weighted_sentiment['neg_pct'],
                'neutral_pct': weighted_sentiment['neu_pct'],
                'sentiment_category': self._categorize_sentiment(weighted_sentiment['compound']),
                'analyzed_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Reddit sentiment analysis error: {e}")
            return self._empty_sentiment_result()
    
    def analyze_news_sentiment(self, team_name, player_name=None):
        """
        Analyze news article sentiment
        """
        logger.info(f"Analyzing news sentiment for {team_name}")
        
        try:
            # Build search query
            query = f'{team_name} NBA'
            if player_name:
                query = f'{player_name} {team_name}'
            
            # Fetch news articles
            url = 'https://newsapi.org/v2/everything'
            params = {
                'q': query,
                'apiKey': self.news_api_key,
                'language': 'en',
                'sortBy': 'publishedAt',
                'pageSize': 50
            }
            
            response = requests.get(url, params=params, timeout=10)
            articles = response.json().get('articles', [])
            
            if not articles:
                return self._empty_sentiment_result()
            
            sentiments = []
            
            for article in articles:
                # Combine title and description
                text = f"{article.get('title', '')} {article.get('description', '')}"
                text = self._clean_text(text)
                
                if len(text) < 10:
                    continue
                
                sentiment = self.vader.polarity_scores(text)
                sentiments.append(sentiment)
            
            # Calculate average sentiment
            avg_sentiment = self._calculate_average_sentiment(sentiments)
            
            return {
                'platform': 'news',
                'entity': team_name,
                'player': player_name,
                'article_count': len(articles),
                'sentiment_score': avg_sentiment['compound'],
                'positive_pct': avg_sentiment['pos_pct'],
                'negative_pct': avg_sentiment['neg_pct'],
                'neutral_pct': avg_sentiment['neu_pct'],
                'sentiment_category': self._categorize_sentiment(avg_sentiment['compound']),
                'analyzed_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"News sentiment analysis error: {e}")
            return self._empty_sentiment_result()
    
    def get_aggregate_sentiment(self, team_name, player_name=None):
        """
        Get aggregated sentiment from all sources
        """
        cache_key = f"{team_name}_{player_name}_{datetime.now().hour}"
        
        # Check cache
        if cache_key in self.sentiment_cache:
            cached = self.sentiment_cache[cache_key]
            if datetime.now().timestamp() - cached['timestamp'] < self.cache_expiry:
                return cached['data']
        
        # Analyze all platforms
        twitter_sentiment = self.analyze_twitter_sentiment(team_name, player_name)
        reddit_sentiment = self.analyze_reddit_sentiment(team_name, player_name)
        news_sentiment = self.analyze_news_sentiment(team_name, player_name)
        
        # Aggregate results
        all_scores = []
        all_weights = []
        
        # Weight by platform reliability and volume
        platforms = [
            (twitter_sentiment, 0.35),  # Twitter gets 35% weight
            (reddit_sentiment, 0.40),    # Reddit gets 40% (most betting-focused)
            (news_sentiment, 0.25)       # News gets 25%
        ]
        
        for sentiment, weight in platforms:
            if sentiment['sentiment_score'] is not None:
                all_scores.append(sentiment['sentiment_score'])
                all_weights.append(weight)
        
        if not all_scores:
            return self._empty_sentiment_result()
        
        # Calculate weighted average
        aggregate_score = np.average(all_scores, weights=all_weights)
        
        result = {
            'entity': team_name,
            'player': player_name,
            'aggregate_sentiment_score': float(aggregate_score),
            'sentiment_category': self._categorize_sentiment(aggregate_score),
            'twitter': twitter_sentiment,
            'reddit': reddit_sentiment,
            'news': news_sentiment,
            'betting_implications': self._generate_betting_implications(aggregate_score, twitter_sentiment, reddit_sentiment),
            'analyzed_at': datetime.now().isoformat()
        }
        
        # Cache result
        self.sentiment_cache[cache_key] = {
            'data': result,
            'timestamp': datetime.now().timestamp()
        }
        
        return result
    
    def _generate_betting_implications(self, aggregate_score, twitter_data, reddit_data):
        """
        Generate betting recommendations based on sentiment
        """
        implications = {
            'public_side': None,
            'contrarian_opportunity': False,
            'confidence': 'low',
            'recommendation': None
        }
        
        # Determine public side
        if aggregate_score > 0.2:
            implications['public_side'] = 'positive'
            implications['recommendation'] = 'Consider fading if line movement suggests sharp action opposite'
        elif aggregate_score < -0.2:
            implications['public_side'] = 'negative'
            implications['recommendation'] = 'Consider contrarian play if fundamentals are sound'
        else:
            implications['public_side'] = 'neutral'
            implications['recommendation'] = 'Sentiment not a significant factor'
        
        # Detect contrarian opportunities
        # Strong sentiment (>70% on one side) often presents fade opportunities
        if reddit_data.get('positive_pct', 0) > 70 or reddit_data.get('negative_pct', 0) > 70:
            implications['contrarian_opportunity'] = True
            implications['confidence'] = 'medium'
        
        # Extreme Twitter buzz can signal public overreaction
        if twitter_data.get('tweet_count', 0) > 500:
            implications['contrarian_opportunity'] = True
            implications['confidence'] = 'high'
        
        return implications
    
    def _clean_text(self, text):
        """
        Clean and preprocess text
        """
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove mentions and hashtags
        text = re.sub(r'@\w+|#\w+', '', text)
        
        # Remove special characters
        text = re.sub(r'[^\w\s]', ' ', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text.lower()
    
    def _calculate_weighted_sentiment(self, sentiments, weights):
        """
        Calculate weighted average sentiment
        """
        if not sentiments:
            return {'compound': 0, 'pos_pct': 0, 'neg_pct': 0, 'neu_pct': 0}
        
        weights = np.array(weights)
        weights = weights / weights.sum()  # Normalize
        
        compounds = [s['compound'] for s in sentiments]
        positives = [s['pos'] for s in sentiments]
        negatives = [s['neg'] for s in sentiments]
        neutrals = [s['neu'] for s in sentiments]
        
        return {
            'compound': float(np.average(compounds, weights=weights)),
            'pos_pct': float(np.average(positives, weights=weights) * 100),
            'neg_pct': float(np.average(negatives, weights=weights) * 100),
            'neu_pct': float(np.average(neutrals, weights=weights) * 100)
        }
    
    def _calculate_average_sentiment(self, sentiments):
        """
        Calculate simple average sentiment
        """
        if not sentiments:
            return {'compound': 0, 'pos_pct': 0, 'neg_pct': 0, 'neu_pct': 0}
        
        compounds = [s['compound'] for s in sentiments]
        positives = [s['pos'] for s in sentiments]
        negatives = [s['neg'] for s in sentiments]
        neutrals = [s['neu'] for s in sentiments]
        
        return {
            'compound': float(np.mean(compounds)),
            'pos_pct': float(np.mean(positives) * 100),
            'neg_pct': float(np.mean(negatives) * 100),
            'neu_pct': float(np.mean(neutrals) * 100)
        }
    
    def _categorize_sentiment(self, compound_score):
        """
        Categorize sentiment score
        """
        if compound_score >= 0.5:
            return 'very_positive'
        elif compound_score >= 0.2:
            return 'positive'
        elif compound_score > -0.2:
            return 'neutral'
        elif compound_score > -0.5:
            return 'negative'
        else:
            return 'very_negative'
    
    def _empty_sentiment_result(self):
        """
        Return empty sentiment result
        """
        return {
            'platform': 'unknown',
            'entity': None,
            'player': None,
            'sentiment_score': None,
            'positive_pct': 0,
            'negative_pct': 0,
            'neutral_pct': 0,
            'sentiment_category': 'neutral',
            'analyzed_at': datetime.now().isoformat()
        }

# Export singleton
sentiment_analyzer = SentimentAnalyzer()
