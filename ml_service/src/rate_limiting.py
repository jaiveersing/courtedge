"""
API rate limiting and authentication
"""
from fastapi import HTTPException, Security, status, Request
from fastapi.security import APIKeyHeader
from datetime import datetime, timedelta
from typing import Dict, Optional
import hashlib
import secrets
import logging
from collections import defaultdict
import time

logger = logging.getLogger(__name__)

# API Key authentication
API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)

# In-memory storage (use Redis in production)
api_keys: Dict[str, Dict] = {}
rate_limit_store: Dict[str, Dict] = defaultdict(dict)


class RateLimiter:
    """Rate limiting for API endpoints"""
    
    def __init__(self):
        self.requests = defaultdict(list)
        self.limits = {
            'default': {'requests': 100, 'window': 3600},  # 100 requests per hour
            'premium': {'requests': 1000, 'window': 3600},  # 1000 requests per hour
            'prediction': {'requests': 50, 'window': 60},    # 50 predictions per minute
        }
    
    def check_rate_limit(
        self,
        key: str,
        tier: str = 'default',
        endpoint_type: str = 'default'
    ) -> tuple[bool, Dict]:
        """
        Check if request is within rate limit
        
        Returns:
            (allowed, info_dict)
        """
        now = time.time()
        
        # Determine which limit to apply
        limit_key = endpoint_type if endpoint_type in self.limits else tier
        limit_config = self.limits.get(limit_key, self.limits['default'])
        
        window = limit_config['window']
        max_requests = limit_config['requests']
        
        # Clean old requests
        cutoff_time = now - window
        self.requests[key] = [ts for ts in self.requests[key] if ts > cutoff_time]
        
        # Check limit
        current_requests = len(self.requests[key])
        allowed = current_requests < max_requests
        
        if allowed:
            self.requests[key].append(now)
        
        # Calculate reset time
        if self.requests[key]:
            oldest_request = min(self.requests[key])
            reset_time = oldest_request + window
            remaining = max_requests - current_requests - (1 if allowed else 0)
        else:
            reset_time = now + window
            remaining = max_requests - 1
        
        info = {
            'allowed': allowed,
            'limit': max_requests,
            'remaining': remaining,
            'reset': reset_time,
            'reset_in': int(reset_time - now)
        }
        
        return allowed, info
    
    def get_client_key(self, request: Request) -> str:
        """Get unique client identifier"""
        # Try API key first
        api_key = request.headers.get('X-API-Key')
        if api_key:
            return f"api_key:{api_key}"
        
        # Fall back to IP address
        forwarded_for = request.headers.get('X-Forwarded-For')
        if forwarded_for:
            ip = forwarded_for.split(',')[0].strip()
        else:
            ip = request.client.host if request.client else 'unknown'
        
        return f"ip:{ip}"


class APIKeyManager:
    """Manage API keys and authentication"""
    
    def __init__(self):
        self.keys = api_keys
    
    def create_key(
        self,
        name: str,
        tier: str = 'default',
        expires_in_days: Optional[int] = None
    ) -> Dict:
        """Create new API key"""
        api_key = self._generate_key()
        
        key_data = {
            'name': name,
            'key': api_key,
            'tier': tier,
            'created_at': datetime.now().isoformat(),
            'expires_at': None,
            'active': True,
            'request_count': 0,
            'last_used': None
        }
        
        if expires_in_days:
            expires_at = datetime.now() + timedelta(days=expires_in_days)
            key_data['expires_at'] = expires_at.isoformat()
        
        self.keys[api_key] = key_data
        logger.info(f"Created API key for {name} (tier: {tier})")
        
        return key_data
    
    def validate_key(self, api_key: str) -> tuple[bool, Optional[Dict]]:
        """Validate API key"""
        if not api_key or api_key not in self.keys:
            return False, None
        
        key_data = self.keys[api_key]
        
        # Check if active
        if not key_data.get('active', True):
            logger.warning(f"Inactive API key used: {api_key[:8]}...")
            return False, None
        
        # Check expiration
        if key_data.get('expires_at'):
            expires_at = datetime.fromisoformat(key_data['expires_at'])
            if datetime.now() > expires_at:
                logger.warning(f"Expired API key used: {api_key[:8]}...")
                return False, None
        
        # Update usage
        key_data['request_count'] += 1
        key_data['last_used'] = datetime.now().isoformat()
        
        return True, key_data
    
    def deactivate_key(self, api_key: str) -> bool:
        """Deactivate API key"""
        if api_key in self.keys:
            self.keys[api_key]['active'] = False
            logger.info(f"Deactivated API key: {api_key[:8]}...")
            return True
        return False
    
    def get_key_info(self, api_key: str) -> Optional[Dict]:
        """Get API key information"""
        return self.keys.get(api_key)
    
    def list_keys(self) -> list[Dict]:
        """List all API keys"""
        return [
            {
                'name': data['name'],
                'tier': data['tier'],
                'active': data['active'],
                'created_at': data['created_at'],
                'expires_at': data['expires_at'],
                'request_count': data['request_count'],
                'last_used': data['last_used']
            }
            for data in self.keys.values()
        ]
    
    def _generate_key(self) -> str:
        """Generate secure API key"""
        random_bytes = secrets.token_bytes(32)
        return hashlib.sha256(random_bytes).hexdigest()


# Global instances
rate_limiter = RateLimiter()
api_key_manager = APIKeyManager()


# Dependency for API key authentication
async def verify_api_key(
    api_key: Optional[str] = Security(API_KEY_HEADER),
    request: Request = None
) -> Dict:
    """Verify API key from request header"""
    
    # Allow requests without API key (will use IP-based rate limiting)
    if not api_key:
        return {
            'authenticated': False,
            'tier': 'default',
            'client_key': rate_limiter.get_client_key(request) if request else 'unknown'
        }
    
    # Validate API key
    valid, key_data = api_key_manager.validate_key(api_key)
    
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired API key"
        )
    
    return {
        'authenticated': True,
        'tier': key_data['tier'],
        'name': key_data['name'],
        'client_key': f"api_key:{api_key}"
    }


# Dependency for rate limiting
async def check_rate_limit(
    request: Request,
    auth: Dict = Security(verify_api_key),
    endpoint_type: str = 'default'
) -> Dict:
    """Check rate limit for request"""
    
    client_key = auth['client_key']
    tier = auth['tier']
    
    allowed, info = rate_limiter.check_rate_limit(
        key=client_key,
        tier=tier,
        endpoint_type=endpoint_type
    )
    
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Reset in {info['reset_in']} seconds",
            headers={
                'X-RateLimit-Limit': str(info['limit']),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': str(int(info['reset']))
            }
        )
    
    # Add rate limit headers to response (done in middleware)
    request.state.rate_limit_info = info
    
    return info


# Middleware to add rate limit headers
async def add_rate_limit_headers(request: Request, call_next):
    """Add rate limit headers to response"""
    response = await call_next(request)
    
    if hasattr(request.state, 'rate_limit_info'):
        info = request.state.rate_limit_info
        response.headers['X-RateLimit-Limit'] = str(info['limit'])
        response.headers['X-RateLimit-Remaining'] = str(info['remaining'])
        response.headers['X-RateLimit-Reset'] = str(int(info['reset']))
    
    return response


# CLI for managing API keys
def cli_main():
    """Command-line interface for API key management"""
    import argparse
    import sys
    
    parser = argparse.ArgumentParser(description="API Key Management")
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Create key
    create_parser = subparsers.add_parser('create', help='Create new API key')
    create_parser.add_argument('name', help='Key name')
    create_parser.add_argument('--tier', default='default', choices=['default', 'premium'], help='API tier')
    create_parser.add_argument('--expires', type=int, help='Expiration in days')
    
    # List keys
    subparsers.add_parser('list', help='List all API keys')
    
    # Deactivate key
    deactivate_parser = subparsers.add_parser('deactivate', help='Deactivate API key')
    deactivate_parser.add_argument('key', help='API key to deactivate')
    
    args = parser.parse_args()
    
    if args.command == 'create':
        key_data = api_key_manager.create_key(
            name=args.name,
            tier=args.tier,
            expires_in_days=args.expires
        )
        print(f"\nAPI Key created successfully!")
        print(f"Name: {key_data['name']}")
        print(f"Key: {key_data['key']}")
        print(f"Tier: {key_data['tier']}")
        print(f"\n⚠️  Save this key securely - it won't be shown again!\n")
    
    elif args.command == 'list':
        keys = api_key_manager.list_keys()
        if not keys:
            print("No API keys found")
        else:
            print(f"\nFound {len(keys)} API keys:\n")
            for key in keys:
                print(f"Name: {key['name']}")
                print(f"Tier: {key['tier']}")
                print(f"Active: {key['active']}")
                print(f"Requests: {key['request_count']}")
                print(f"Last used: {key['last_used'] or 'Never'}")
                print("-" * 40)
    
    elif args.command == 'deactivate':
        if api_key_manager.deactivate_key(args.key):
            print(f"API key deactivated successfully")
        else:
            print(f"API key not found")
            sys.exit(1)
    
    else:
        parser.print_help()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    cli_main()
