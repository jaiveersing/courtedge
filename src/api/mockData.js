// Mock data generator for development/demo without Base44 API
// Generates realistic betting, prediction, player, and game data
import nbaLiveService from './nbaLiveService';

const NBA_TEAMS = [
  'LAL', 'BOS', 'GSW', 'MIA', 'DEN', 'PHX', 'DAL', 'BKN', 'MEM', 'SAC',
  'PHI', 'MIL', 'LAC', 'NYK', 'CHI', 'ATL', 'CLE', 'TOR', 'MIN', 'NOP',
  'POR', 'OKC', 'IND', 'UTA', 'WAS', 'CHA', 'SAS', 'DET', 'HOU', 'ORL'
];

// 100 Real NBA Players with full data
const NBA_PLAYERS_DATABASE = [
  { id: 1, name: 'LeBron James', team: 'LAL', position: 'SF', number: 23, ppg: 25.7, rpg: 7.3, apg: 8.3, spg: 1.3, bpg: 0.5, fgPct: 0.540, threePct: 0.410, ftPct: 0.750, mpg: 35.5 },
  { id: 2, name: 'Stephen Curry', team: 'GSW', position: 'PG', number: 30, ppg: 29.4, rpg: 6.1, apg: 6.3, spg: 0.9, bpg: 0.4, fgPct: 0.490, threePct: 0.428, ftPct: 0.915, mpg: 34.7 },
  { id: 3, name: 'Kevin Durant', team: 'PHX', position: 'SF', number: 35, ppg: 29.1, rpg: 6.7, apg: 5.0, spg: 0.9, bpg: 1.4, fgPct: 0.560, threePct: 0.420, ftPct: 0.890, mpg: 37.2 },
  { id: 4, name: 'Giannis Antetokounmpo', team: 'MIL', position: 'PF', number: 34, ppg: 31.1, rpg: 11.8, apg: 5.7, spg: 0.8, bpg: 0.8, fgPct: 0.611, threePct: 0.274, ftPct: 0.657, mpg: 35.2 },
  { id: 5, name: 'Nikola Jokic', team: 'DEN', position: 'C', number: 15, ppg: 26.4, rpg: 12.4, apg: 9.0, spg: 1.4, bpg: 0.7, fgPct: 0.632, threePct: 0.359, ftPct: 0.822, mpg: 34.6 },
  { id: 6, name: 'Luka Doncic', team: 'DAL', position: 'PG', number: 77, ppg: 32.4, rpg: 8.6, apg: 8.0, spg: 1.4, bpg: 0.5, fgPct: 0.496, threePct: 0.382, ftPct: 0.786, mpg: 36.2 },
  { id: 7, name: 'Joel Embiid', team: 'PHI', position: 'C', number: 21, ppg: 33.1, rpg: 10.2, apg: 4.2, spg: 1.0, bpg: 1.7, fgPct: 0.548, threePct: 0.330, ftPct: 0.857, mpg: 34.6 },
  { id: 8, name: 'Jayson Tatum', team: 'BOS', position: 'SF', number: 0, ppg: 26.9, rpg: 8.1, apg: 4.6, spg: 1.1, bpg: 0.7, fgPct: 0.466, threePct: 0.351, ftPct: 0.853, mpg: 36.9 },
  { id: 9, name: 'Damian Lillard', team: 'MIL', position: 'PG', number: 0, ppg: 24.3, rpg: 4.4, apg: 7.0, spg: 0.9, bpg: 0.3, fgPct: 0.424, threePct: 0.354, ftPct: 0.920, mpg: 35.4 },
  { id: 10, name: 'Anthony Davis', team: 'LAL', position: 'PF', number: 3, ppg: 24.7, rpg: 12.6, apg: 3.5, spg: 1.2, bpg: 2.3, fgPct: 0.559, threePct: 0.274, ftPct: 0.786, mpg: 35.5 },
  { id: 11, name: 'Kawhi Leonard', team: 'LAC', position: 'SF', number: 2, ppg: 23.8, rpg: 6.5, apg: 3.9, spg: 1.6, bpg: 0.9, fgPct: 0.525, threePct: 0.418, ftPct: 0.885, mpg: 34.3 },
  { id: 12, name: 'Jimmy Butler', team: 'MIA', position: 'SF', number: 22, ppg: 20.8, rpg: 5.3, apg: 5.0, spg: 1.8, bpg: 0.3, fgPct: 0.539, threePct: 0.356, ftPct: 0.857, mpg: 33.4 },
  { id: 13, name: 'Paul George', team: 'PHI', position: 'SF', number: 8, ppg: 22.6, rpg: 5.2, apg: 3.5, spg: 1.5, bpg: 0.4, fgPct: 0.457, threePct: 0.387, ftPct: 0.912, mpg: 34.2 },
  { id: 14, name: 'Devin Booker', team: 'PHX', position: 'SG', number: 1, ppg: 27.1, rpg: 4.5, apg: 6.9, spg: 1.0, bpg: 0.4, fgPct: 0.493, threePct: 0.366, ftPct: 0.877, mpg: 36.4 },
  { id: 15, name: 'Donovan Mitchell', team: 'CLE', position: 'SG', number: 45, ppg: 28.3, rpg: 4.1, apg: 5.1, spg: 1.5, bpg: 0.4, fgPct: 0.471, threePct: 0.385, ftPct: 0.864, mpg: 35.8 },
  { id: 16, name: 'Trae Young', team: 'ATL', position: 'PG', number: 11, ppg: 26.2, rpg: 3.0, apg: 10.8, spg: 1.1, bpg: 0.1, fgPct: 0.431, threePct: 0.333, ftPct: 0.886, mpg: 35.3 },
  { id: 17, name: 'Ja Morant', team: 'MEM', position: 'PG', number: 12, ppg: 26.2, rpg: 5.9, apg: 8.1, spg: 1.1, bpg: 0.3, fgPct: 0.466, threePct: 0.341, ftPct: 0.747, mpg: 32.0 },
  { id: 18, name: 'Zion Williamson', team: 'NOP', position: 'PF', number: 1, ppg: 22.9, rpg: 5.8, apg: 4.6, spg: 1.1, bpg: 0.6, fgPct: 0.597, threePct: 0.333, ftPct: 0.715, mpg: 29.7 },
  { id: 19, name: 'Karl-Anthony Towns', team: 'NYK', position: 'C', number: 32, ppg: 21.8, rpg: 8.3, apg: 3.0, spg: 0.7, bpg: 0.7, fgPct: 0.505, threePct: 0.412, ftPct: 0.874, mpg: 32.6 },
  { id: 20, name: 'Bam Adebayo', team: 'MIA', position: 'C', number: 13, ppg: 19.3, rpg: 10.4, apg: 3.2, spg: 1.2, bpg: 0.8, fgPct: 0.521, threePct: 0.143, ftPct: 0.807, mpg: 34.6 },
  { id: 21, name: 'Jaylen Brown', team: 'BOS', position: 'SG', number: 7, ppg: 23.0, rpg: 5.5, apg: 3.6, spg: 1.2, bpg: 0.4, fgPct: 0.497, threePct: 0.358, ftPct: 0.706, mpg: 33.9 },
  { id: 22, name: 'Tyrese Haliburton', team: 'IND', position: 'PG', number: 0, ppg: 20.1, rpg: 3.7, apg: 10.9, spg: 1.2, bpg: 0.3, fgPct: 0.477, threePct: 0.400, ftPct: 0.854, mpg: 33.5 },
  { id: 23, name: 'De\'Aaron Fox', team: 'SAC', position: 'PG', number: 5, ppg: 25.0, rpg: 4.2, apg: 6.1, spg: 2.0, bpg: 0.4, fgPct: 0.518, threePct: 0.371, ftPct: 0.738, mpg: 35.8 },
  { id: 24, name: 'Domantas Sabonis', team: 'SAC', position: 'C', number: 10, ppg: 19.4, rpg: 13.7, apg: 8.2, spg: 1.0, bpg: 0.5, fgPct: 0.617, threePct: 0.375, ftPct: 0.732, mpg: 35.0 },
  { id: 25, name: 'Pascal Siakam', team: 'IND', position: 'PF', number: 43, ppg: 21.3, rpg: 6.5, apg: 4.1, spg: 0.8, bpg: 0.5, fgPct: 0.502, threePct: 0.338, ftPct: 0.769, mpg: 35.6 },
  { id: 26, name: 'Jalen Brunson', team: 'NYK', position: 'PG', number: 11, ppg: 28.7, rpg: 3.6, apg: 6.7, spg: 0.9, bpg: 0.2, fgPct: 0.479, threePct: 0.401, ftPct: 0.847, mpg: 35.4 },
  { id: 27, name: 'Shai Gilgeous-Alexander', team: 'OKC', position: 'SG', number: 2, ppg: 31.4, rpg: 5.5, apg: 6.2, spg: 2.0, bpg: 1.0, fgPct: 0.535, threePct: 0.353, ftPct: 0.874, mpg: 34.0 },
  { id: 28, name: 'Chet Holmgren', team: 'OKC', position: 'C', number: 7, ppg: 16.5, rpg: 7.9, apg: 2.4, spg: 0.8, bpg: 2.3, fgPct: 0.530, threePct: 0.371, ftPct: 0.797, mpg: 29.4 },
  { id: 29, name: 'LaMelo Ball', team: 'CHA', position: 'PG', number: 1, ppg: 23.9, rpg: 5.1, apg: 8.0, spg: 1.8, bpg: 0.3, fgPct: 0.436, threePct: 0.378, ftPct: 0.868, mpg: 32.6 },
  { id: 30, name: 'Brandon Ingram', team: 'NOP', position: 'SF', number: 14, ppg: 24.7, rpg: 5.1, apg: 5.7, spg: 0.7, bpg: 0.5, fgPct: 0.493, threePct: 0.392, ftPct: 0.820, mpg: 35.4 },
  { id: 31, name: 'Darius Garland', team: 'CLE', position: 'PG', number: 10, ppg: 18.0, rpg: 2.6, apg: 6.5, spg: 1.3, bpg: 0.1, fgPct: 0.447, threePct: 0.374, ftPct: 0.860, mpg: 31.4 },
  { id: 32, name: 'Evan Mobley', team: 'CLE', position: 'PF', number: 4, ppg: 15.7, rpg: 9.4, apg: 3.2, spg: 0.6, bpg: 1.4, fgPct: 0.578, threePct: 0.376, ftPct: 0.696, mpg: 32.4 },
  { id: 33, name: 'Jarrett Allen', team: 'CLE', position: 'C', number: 31, ppg: 16.5, rpg: 10.5, apg: 1.7, spg: 0.7, bpg: 1.1, fgPct: 0.648, threePct: 0.250, ftPct: 0.730, mpg: 32.3 },
  { id: 34, name: 'Lauri Markkanen', team: 'UTA', position: 'PF', number: 23, ppg: 25.6, rpg: 8.6, apg: 2.0, spg: 0.7, bpg: 0.6, fgPct: 0.491, threePct: 0.391, ftPct: 0.908, mpg: 34.8 },
  { id: 35, name: 'Jalen Williams', team: 'OKC', position: 'SF', number: 8, ppg: 19.1, rpg: 4.0, apg: 4.5, spg: 1.4, bpg: 0.7, fgPct: 0.544, threePct: 0.423, ftPct: 0.789, mpg: 31.4 },
  { id: 36, name: 'Franz Wagner', team: 'ORL', position: 'SF', number: 22, ppg: 19.7, rpg: 5.3, apg: 3.7, spg: 1.1, bpg: 0.4, fgPct: 0.484, threePct: 0.359, ftPct: 0.839, mpg: 33.8 },
  { id: 37, name: 'Paolo Banchero', team: 'ORL', position: 'PF', number: 5, ppg: 22.6, rpg: 6.9, apg: 5.4, spg: 0.9, bpg: 0.5, fgPct: 0.458, threePct: 0.336, ftPct: 0.724, mpg: 34.4 },
  { id: 38, name: 'Victor Wembanyama', team: 'SAS', position: 'C', number: 1, ppg: 21.4, rpg: 10.6, apg: 3.9, spg: 1.2, bpg: 3.6, fgPct: 0.465, threePct: 0.326, ftPct: 0.797, mpg: 29.7 },
  { id: 39, name: 'Scottie Barnes', team: 'TOR', position: 'SF', number: 4, ppg: 19.9, rpg: 8.2, apg: 6.1, spg: 1.3, bpg: 0.9, fgPct: 0.478, threePct: 0.309, ftPct: 0.769, mpg: 35.8 },
  { id: 40, name: 'Mikal Bridges', team: 'NYK', position: 'SF', number: 25, ppg: 19.6, rpg: 4.5, apg: 3.3, spg: 1.0, bpg: 0.5, fgPct: 0.460, threePct: 0.374, ftPct: 0.817, mpg: 35.5 },
  { id: 41, name: 'Kyrie Irving', team: 'DAL', position: 'PG', number: 11, ppg: 25.6, rpg: 5.0, apg: 5.2, spg: 1.3, bpg: 0.5, fgPct: 0.497, threePct: 0.414, ftPct: 0.905, mpg: 35.2 },
  { id: 42, name: 'Bradley Beal', team: 'PHX', position: 'SG', number: 3, ppg: 18.2, rpg: 4.4, apg: 5.0, spg: 1.0, bpg: 0.4, fgPct: 0.512, threePct: 0.430, ftPct: 0.814, mpg: 33.7 },
  { id: 43, name: 'Derrick White', team: 'BOS', position: 'SG', number: 9, ppg: 15.2, rpg: 4.2, apg: 5.2, spg: 1.0, bpg: 1.0, fgPct: 0.460, threePct: 0.399, ftPct: 0.859, mpg: 32.4 },
  { id: 44, name: 'Kristaps Porzingis', team: 'BOS', position: 'C', number: 8, ppg: 20.1, rpg: 7.2, apg: 2.0, spg: 0.7, bpg: 1.9, fgPct: 0.519, threePct: 0.371, ftPct: 0.858, mpg: 29.6 },
  { id: 45, name: 'Tyler Herro', team: 'MIA', position: 'SG', number: 14, ppg: 20.8, rpg: 5.3, apg: 4.5, spg: 0.6, bpg: 0.2, fgPct: 0.440, threePct: 0.391, ftPct: 0.869, mpg: 33.5 },
  { id: 46, name: 'Anfernee Simons', team: 'POR', position: 'SG', number: 1, ppg: 22.6, rpg: 2.6, apg: 5.5, spg: 0.6, bpg: 0.3, fgPct: 0.450, threePct: 0.386, ftPct: 0.882, mpg: 33.8 },
  { id: 47, name: 'Deandre Ayton', team: 'POR', position: 'C', number: 2, ppg: 16.7, rpg: 11.1, apg: 1.7, spg: 0.6, bpg: 0.9, fgPct: 0.616, threePct: 0.357, ftPct: 0.750, mpg: 30.1 },
  { id: 48, name: 'Anthony Edwards', team: 'MIN', position: 'SG', number: 5, ppg: 25.9, rpg: 5.4, apg: 5.1, spg: 1.3, bpg: 0.5, fgPct: 0.461, threePct: 0.358, ftPct: 0.831, mpg: 35.1 },
  { id: 49, name: 'Rudy Gobert', team: 'MIN', position: 'C', number: 27, ppg: 14.0, rpg: 12.9, apg: 1.3, spg: 0.6, bpg: 2.1, fgPct: 0.664, threePct: 0.000, ftPct: 0.698, mpg: 32.7 },
  { id: 50, name: 'Julius Randle', team: 'MIN', position: 'PF', number: 30, ppg: 24.0, rpg: 9.2, apg: 5.0, spg: 0.8, bpg: 0.3, fgPct: 0.478, threePct: 0.343, ftPct: 0.789, mpg: 35.8 },
  // Players 51-100
  { id: 51, name: 'Desmond Bane', team: 'MEM', position: 'SG', number: 22, ppg: 23.7, rpg: 5.0, apg: 4.4, spg: 1.0, bpg: 0.3, fgPct: 0.472, threePct: 0.401, ftPct: 0.858, mpg: 35.1 },
  { id: 52, name: 'Alperen Sengun', team: 'HOU', position: 'C', number: 28, ppg: 21.1, rpg: 9.3, apg: 5.0, spg: 1.0, bpg: 0.8, fgPct: 0.538, threePct: 0.329, ftPct: 0.712, mpg: 32.5 },
  { id: 53, name: 'Jalen Green', team: 'HOU', position: 'SG', number: 4, ppg: 19.6, rpg: 3.8, apg: 3.5, spg: 0.6, bpg: 0.3, fgPct: 0.423, threePct: 0.331, ftPct: 0.825, mpg: 32.1 },
  { id: 54, name: 'Fred VanVleet', team: 'HOU', position: 'PG', number: 5, ppg: 17.1, rpg: 3.8, apg: 6.3, spg: 1.2, bpg: 0.2, fgPct: 0.403, threePct: 0.369, ftPct: 0.857, mpg: 34.5 },
  { id: 55, name: 'Jabari Smith Jr.', team: 'HOU', position: 'PF', number: 10, ppg: 12.4, rpg: 6.5, apg: 1.5, spg: 0.8, bpg: 1.0, fgPct: 0.447, threePct: 0.357, ftPct: 0.774, mpg: 28.2 },
  { id: 56, name: 'Jrue Holiday', team: 'BOS', position: 'PG', number: 4, ppg: 12.5, rpg: 5.4, apg: 4.8, spg: 0.9, bpg: 0.4, fgPct: 0.475, threePct: 0.421, ftPct: 0.837, mpg: 32.8 },
  { id: 57, name: 'Al Horford', team: 'BOS', position: 'C', number: 42, ppg: 8.6, rpg: 6.2, apg: 2.6, spg: 0.6, bpg: 1.0, fgPct: 0.498, threePct: 0.401, ftPct: 0.796, mpg: 26.4 },
  { id: 58, name: 'OG Anunoby', team: 'NYK', position: 'SF', number: 8, ppg: 14.1, rpg: 4.4, apg: 1.7, spg: 1.4, bpg: 0.5, fgPct: 0.487, threePct: 0.384, ftPct: 0.774, mpg: 31.2 },
  { id: 59, name: 'Josh Hart', team: 'NYK', position: 'SG', number: 3, ppg: 9.4, rpg: 8.3, apg: 4.1, spg: 0.9, bpg: 0.2, fgPct: 0.440, threePct: 0.319, ftPct: 0.847, mpg: 33.2 },
  { id: 60, name: 'Donte DiVincenzo', team: 'MIN', position: 'SG', number: 0, ppg: 15.5, rpg: 3.7, apg: 2.7, spg: 1.2, bpg: 0.2, fgPct: 0.445, threePct: 0.401, ftPct: 0.866, mpg: 29.8 },
  { id: 61, name: 'Austin Reaves', team: 'LAL', position: 'SG', number: 15, ppg: 15.9, rpg: 4.3, apg: 5.5, spg: 0.9, bpg: 0.2, fgPct: 0.488, threePct: 0.395, ftPct: 0.847, mpg: 33.1 },
  { id: 62, name: 'Rui Hachimura', team: 'LAL', position: 'PF', number: 28, ppg: 13.6, rpg: 4.3, apg: 1.2, spg: 0.4, bpg: 0.3, fgPct: 0.538, threePct: 0.420, ftPct: 0.815, mpg: 26.4 },
  { id: 63, name: 'D\'Angelo Russell', team: 'LAL', position: 'PG', number: 1, ppg: 18.0, rpg: 3.1, apg: 6.3, spg: 0.9, bpg: 0.2, fgPct: 0.453, threePct: 0.412, ftPct: 0.813, mpg: 33.0 },
  { id: 64, name: 'Klay Thompson', team: 'DAL', position: 'SG', number: 31, ppg: 17.9, rpg: 3.3, apg: 2.3, spg: 0.7, bpg: 0.4, fgPct: 0.433, threePct: 0.385, ftPct: 0.921, mpg: 29.7 },
  { id: 65, name: 'PJ Washington', team: 'DAL', position: 'PF', number: 25, ppg: 13.6, rpg: 5.9, apg: 2.1, spg: 0.9, bpg: 0.8, fgPct: 0.476, threePct: 0.359, ftPct: 0.767, mpg: 30.4 },
  { id: 66, name: 'Daniel Gafford', team: 'DAL', position: 'C', number: 21, ppg: 11.0, rpg: 5.6, apg: 0.9, spg: 0.5, bpg: 2.0, fgPct: 0.706, threePct: 0.000, ftPct: 0.628, mpg: 23.8 },
  { id: 67, name: 'Dereck Lively II', team: 'DAL', position: 'C', number: 2, ppg: 8.8, rpg: 6.9, apg: 1.6, spg: 0.5, bpg: 1.4, fgPct: 0.648, threePct: 0.333, ftPct: 0.588, mpg: 24.2 },
  { id: 68, name: 'Brook Lopez', team: 'MIL', position: 'C', number: 11, ppg: 12.5, rpg: 5.2, apg: 1.6, spg: 0.4, bpg: 2.4, fgPct: 0.480, threePct: 0.361, ftPct: 0.781, mpg: 30.1 },
  { id: 69, name: 'Khris Middleton', team: 'MIL', position: 'SF', number: 22, ppg: 15.1, rpg: 4.7, apg: 5.3, spg: 0.8, bpg: 0.2, fgPct: 0.465, threePct: 0.383, ftPct: 0.881, mpg: 28.7 },
  { id: 70, name: 'Bobby Portis', team: 'MIL', position: 'PF', number: 9, ppg: 13.8, rpg: 7.4, apg: 1.5, spg: 0.6, bpg: 0.3, fgPct: 0.472, threePct: 0.387, ftPct: 0.787, mpg: 24.3 },
  { id: 71, name: 'Jamal Murray', team: 'DEN', position: 'PG', number: 27, ppg: 21.2, rpg: 4.1, apg: 6.5, spg: 1.0, bpg: 0.3, fgPct: 0.485, threePct: 0.418, ftPct: 0.856, mpg: 33.5 },
  { id: 72, name: 'Michael Porter Jr.', team: 'DEN', position: 'SF', number: 1, ppg: 16.7, rpg: 7.0, apg: 1.5, spg: 0.6, bpg: 0.4, fgPct: 0.486, threePct: 0.400, ftPct: 0.854, mpg: 29.8 },
  { id: 73, name: 'Aaron Gordon', team: 'DEN', position: 'PF', number: 50, ppg: 13.9, rpg: 6.5, apg: 3.0, spg: 0.7, bpg: 0.8, fgPct: 0.551, threePct: 0.368, ftPct: 0.782, mpg: 31.4 },
  { id: 74, name: 'Kyle Kuzma', team: 'WAS', position: 'PF', number: 33, ppg: 22.2, rpg: 6.6, apg: 4.2, spg: 0.7, bpg: 0.5, fgPct: 0.447, threePct: 0.328, ftPct: 0.741, mpg: 34.6 },
  { id: 75, name: 'Jordan Poole', team: 'WAS', position: 'SG', number: 13, ppg: 17.4, rpg: 2.7, apg: 4.4, spg: 0.7, bpg: 0.1, fgPct: 0.413, threePct: 0.329, ftPct: 0.877, mpg: 30.5 },
  { id: 76, name: 'Coby White', team: 'CHI', position: 'SG', number: 0, ppg: 19.1, rpg: 4.5, apg: 5.1, spg: 0.7, bpg: 0.2, fgPct: 0.453, threePct: 0.391, ftPct: 0.851, mpg: 36.4 },
  { id: 77, name: 'Zach LaVine', team: 'CHI', position: 'SG', number: 8, ppg: 19.5, rpg: 5.2, apg: 3.9, spg: 0.9, bpg: 0.4, fgPct: 0.455, threePct: 0.345, ftPct: 0.848, mpg: 33.6 },
  { id: 78, name: 'DeMar DeRozan', team: 'SAC', position: 'SF', number: 10, ppg: 24.0, rpg: 4.3, apg: 5.3, spg: 1.1, bpg: 0.4, fgPct: 0.480, threePct: 0.330, ftPct: 0.853, mpg: 35.2 },
  { id: 79, name: 'Malik Monk', team: 'SAC', position: 'SG', number: 0, ppg: 15.4, rpg: 2.9, apg: 5.1, spg: 0.7, bpg: 0.2, fgPct: 0.452, threePct: 0.389, ftPct: 0.878, mpg: 28.7 },
  { id: 80, name: 'Immanuel Quickley', team: 'TOR', position: 'PG', number: 5, ppg: 18.6, rpg: 4.8, apg: 6.8, spg: 0.9, bpg: 0.2, fgPct: 0.425, threePct: 0.361, ftPct: 0.857, mpg: 33.4 },
  { id: 81, name: 'RJ Barrett', team: 'TOR', position: 'SF', number: 9, ppg: 21.8, rpg: 6.4, apg: 4.1, spg: 0.8, bpg: 0.4, fgPct: 0.498, threePct: 0.392, ftPct: 0.736, mpg: 36.1 },
  { id: 82, name: 'Jakob Poeltl', team: 'TOR', position: 'C', number: 19, ppg: 11.1, rpg: 8.6, apg: 2.8, spg: 0.5, bpg: 1.1, fgPct: 0.594, threePct: 0.000, ftPct: 0.691, mpg: 28.5 },
  { id: 83, name: 'Jalen Suggs', team: 'ORL', position: 'PG', number: 4, ppg: 12.6, rpg: 3.1, apg: 2.7, spg: 1.4, bpg: 0.4, fgPct: 0.457, threePct: 0.399, ftPct: 0.789, mpg: 27.8 },
  { id: 84, name: 'Wendell Carter Jr.', team: 'ORL', position: 'C', number: 34, ppg: 11.0, rpg: 6.9, apg: 2.3, spg: 0.5, bpg: 0.6, fgPct: 0.539, threePct: 0.315, ftPct: 0.778, mpg: 25.4 },
  { id: 85, name: 'Dejounte Murray', team: 'NOP', position: 'PG', number: 5, ppg: 22.5, rpg: 5.3, apg: 6.1, spg: 1.5, bpg: 0.4, fgPct: 0.457, threePct: 0.361, ftPct: 0.815, mpg: 34.8 },
  { id: 86, name: 'CJ McCollum', team: 'NOP', position: 'SG', number: 3, ppg: 18.2, rpg: 3.9, apg: 4.0, spg: 0.8, bpg: 0.2, fgPct: 0.443, threePct: 0.391, ftPct: 0.840, mpg: 32.1 },
  { id: 87, name: 'Herbert Jones', team: 'NOP', position: 'SF', number: 5, ppg: 11.3, rpg: 3.8, apg: 2.3, spg: 1.4, bpg: 0.7, fgPct: 0.472, threePct: 0.341, ftPct: 0.753, mpg: 31.2 },
  { id: 88, name: 'Isaiah Hartenstein', team: 'OKC', position: 'C', number: 55, ppg: 7.8, rpg: 8.3, apg: 2.5, spg: 1.2, bpg: 1.1, fgPct: 0.641, threePct: 0.317, ftPct: 0.711, mpg: 25.3 },
  { id: 89, name: 'Lu Dort', team: 'OKC', position: 'SG', number: 5, ppg: 10.5, rpg: 4.0, apg: 1.6, spg: 1.0, bpg: 0.4, fgPct: 0.406, threePct: 0.352, ftPct: 0.815, mpg: 28.7 },
  { id: 90, name: 'Alex Caruso', team: 'OKC', position: 'SG', number: 6, ppg: 10.1, rpg: 3.8, apg: 3.5, spg: 1.7, bpg: 0.5, fgPct: 0.461, threePct: 0.398, ftPct: 0.778, mpg: 28.4 },
  { id: 91, name: 'Mark Williams', team: 'CHA', position: 'C', number: 5, ppg: 9.7, rpg: 7.2, apg: 1.0, spg: 0.4, bpg: 1.4, fgPct: 0.619, threePct: 0.000, ftPct: 0.604, mpg: 21.8 },
  { id: 92, name: 'Miles Bridges', team: 'CHA', position: 'PF', number: 0, ppg: 21.0, rpg: 7.3, apg: 3.5, spg: 0.9, bpg: 0.7, fgPct: 0.463, threePct: 0.333, ftPct: 0.794, mpg: 34.7 },
  { id: 93, name: 'Tre Jones', team: 'SAS', position: 'PG', number: 33, ppg: 10.4, rpg: 2.7, apg: 5.6, spg: 0.8, bpg: 0.1, fgPct: 0.476, threePct: 0.345, ftPct: 0.792, mpg: 25.8 },
  { id: 94, name: 'Devin Vassell', team: 'SAS', position: 'SG', number: 24, ppg: 19.5, rpg: 3.8, apg: 4.1, spg: 1.0, bpg: 0.4, fgPct: 0.447, threePct: 0.361, ftPct: 0.858, mpg: 31.6 },
  { id: 95, name: 'Jeremy Sochan', team: 'SAS', position: 'PF', number: 10, ppg: 13.1, rpg: 7.0, apg: 3.2, spg: 0.8, bpg: 0.6, fgPct: 0.485, threePct: 0.306, ftPct: 0.724, mpg: 28.9 },
  { id: 96, name: 'Cade Cunningham', team: 'DET', position: 'PG', number: 2, ppg: 22.7, rpg: 4.3, apg: 7.5, spg: 0.9, bpg: 0.4, fgPct: 0.445, threePct: 0.358, ftPct: 0.869, mpg: 35.2 },
  { id: 97, name: 'Jaden Ivey', team: 'DET', position: 'SG', number: 23, ppg: 16.2, rpg: 3.9, apg: 5.2, spg: 0.9, bpg: 0.2, fgPct: 0.417, threePct: 0.358, ftPct: 0.781, mpg: 31.4 },
  { id: 98, name: 'Ausar Thompson', team: 'DET', position: 'SF', number: 5, ppg: 8.8, rpg: 5.4, apg: 2.2, spg: 1.3, bpg: 0.6, fgPct: 0.498, threePct: 0.227, ftPct: 0.714, mpg: 26.3 },
  { id: 99, name: 'Jalen Duren', team: 'DET', position: 'C', number: 0, ppg: 13.8, rpg: 11.6, apg: 2.4, spg: 0.6, bpg: 0.9, fgPct: 0.612, threePct: 0.000, ftPct: 0.585, mpg: 30.1 },
  { id: 100, name: 'Scoot Henderson', team: 'POR', position: 'PG', number: 0, ppg: 14.0, rpg: 2.9, apg: 5.4, spg: 1.0, bpg: 0.3, fgPct: 0.388, threePct: 0.288, ftPct: 0.788, mpg: 29.8 }
];

// Export the database for use in other files
export { NBA_PLAYERS_DATABASE };

const REAL_PLAYERS = NBA_PLAYERS_DATABASE.map(p => p.name);

const sports = ['NBA', 'NFL', 'MLB', 'NHL'];
const statTypes = ['Points', 'Rebounds', 'Assists', 'Blocks', 'Steals', 'Touchdowns', 'Passing Yards', 'Home Runs'];

function randomDate(daysBack = 60) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Real NBA player data cache
let realPlayersCache = null;
let realGamesCache = null;

export async function loadRealNBAData() {
  if (!realPlayersCache) {
    try {
      console.log('🏀 Loading real NBA player data...');
      realPlayersCache = await nbaLiveService.getAllPlayers();
      console.log(`✅ Loaded ${realPlayersCache.length} real NBA players`);
    } catch (error) {
      console.error('Error loading NBA players:', error);
      realPlayersCache = [];
    }
  }
  
  if (!realGamesCache) {
    try {
      console.log('🏀 Loading live NBA games...');
      realGamesCache = await nbaLiveService.getLiveScoreboard();
      console.log(`✅ Loaded ${realGamesCache?.length || 0} games`);
    } catch (error) {
      console.error('Error loading NBA games:', error);
      realGamesCache = [];
    }
  }
  
  return { players: realPlayersCache, games: realGamesCache };
}

function generatePredictions(count = 15) {
  const predictions = [];
  for (let i = 0; i < count; i++) {
    const confidence = Math.round(Math.random() * 40 + 50); // 50-90%
    const isWin = Math.random() > 0.3; // 70% win rate for demo
    const player = randomElement(REAL_PLAYERS);
    const team = randomElement(NBA_TEAMS);
    const awayTeam = randomElement(NBA_TEAMS.filter(t => t !== team));
    
    predictions.push({
      id: `pred_${i + 1}`,
      playerName: player,
      team: team,
      stat: randomElement(['Points', 'Rebounds', 'Assists', 'Blocks', 'Steals']),
      line: Math.round(Math.random() * 30 + 10),
      overUnder: Math.random() > 0.5 ? 'OVER' : 'UNDER',
      odds: parseFloat((Math.random() * 0.5 - 1.15).toFixed(2)),
      confidence: confidence,
      result: isWin ? 'WIN' : 'LOSS',
      roi: isWin ? Math.round(Math.random() * 25 + 5) : Math.round(Math.random() * -20 - 5),
      createdAt: randomDate(),
      game: `${awayTeam} @ ${team}`,
      away_team: awayTeam,
      home_team: team,
      sport: 'NBA',
      game_date: randomDate(7),
      confidence_score: confidence,
      confidence_interval_low: parseFloat((Math.random() * 30 + 10).toFixed(1)),
      confidence_interval_high: parseFloat((Math.random() * 30 + 40).toFixed(1)),
      prediction_uncertainty: parseFloat((Math.random() * 5 + 2).toFixed(2)),
      spread_prediction: (Math.random() * 10 - 5).toFixed(1),
      total_prediction: Math.round(Math.random() * 20 + 210),
      value_bets: [{
        description: `${player} ${randomElement(['Points', 'Rebounds', 'Assists'])} O/U`,
        edge_percentage: (Math.random() * 15 + 5).toFixed(1),
        best_available_odds: -110,
        sportsbook: randomElement(['DraftKings', 'FanDuel', 'BetMGM', 'Caesars'])
      }],
      analysis: 'Strong matchup data suggests high probability of cover based on historical performance and recent form.'
    });
  }
  return predictions;
}

function generateBets(count = 20) {
  const bets = [];
  for (let i = 0; i < count; i++) {
    const stake = Math.round(Math.random() * 200 + 25);
    const odds = parseFloat((Math.random() * 2 + 1).toFixed(2));
    const isWin = Math.random() > 0.45; // ~55% win rate
    const payout = isWin ? Math.round(stake * odds) : 0;
    const profit = payout - stake;

    bets.push({
      id: `bet_${i + 1}`,
      date: randomDate(),
      type: randomElement(['Moneyline', 'Spread', 'Over/Under', 'Parlay', 'Props']),
      teams: `${randomElement(teams)} vs ${randomElement(teams)}`,
      description: `${randomElement(teams)} ${randomElement(['to win', 'spread -7.5', 'over 210.5'])}`,
      odds: odds,
      stake: stake,
      potential: Math.round(stake * odds),
      result: isWin ? 'WIN' : 'LOSS',
      payout: payout,
      profit: profit,
      roi: parseFloat(((profit / stake) * 100).toFixed(1)),
      sport: randomElement(sports),
      sportsbook: randomElement(['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'PointsBet']),
      status: Math.random() > 0.1 ? 'Settled' : 'Pending'
    });
  }
  return bets;
}

function generateBankroll() {
  return {
    id: 'bankroll_1',
    totalBalance: 5250,
    initialBankroll: 5000,
    profit: 250,
    roi: 5.0,
    dailyLimit: 500,
    weeklyLimit: 2000,
    monthlyLimit: 5000,
    daysActive: 180,
    totalBets: 342,
    winRate: 0.56,
    averageOdds: 1.85,
    largestWin: 850,
    largestLoss: -320,
    currency: 'USD',
    riskManagement: {
      kellyFraction: 0.25,
      maxWagerPercent: 5,
      minOdds: 1.5
    }
  };
}

function generatePlayers(count = 100) {
  // Return real NBA player data
  const playersToReturn = NBA_PLAYERS_DATABASE.slice(0, count);
  return playersToReturn.map(p => ({
    id: p.id,
    name: p.name,
    team: p.team,
    position: p.position,
    number: p.number,
    height: getPlayerHeight(p.position),
    weight: getPlayerWeight(p.position),
    stats: {
      pointsPerGame: p.ppg,
      reboundsPerGame: p.rpg,
      assistsPerGame: p.apg,
      stealsPerGame: p.spg,
      blocksPerGame: p.bpg,
      fieldGoalPercent: p.fgPct,
      threePointPercent: p.threePct,
      freeThrowPercent: p.ftPct,
      minutesPerGame: p.mpg
    },
    ppg: p.ppg,
    rpg: p.rpg,
    apg: p.apg,
    spg: p.spg,
    bpg: p.bpg,
    fgPct: p.fgPct,
    threePct: p.threePct,
    ftPct: p.ftPct,
    mpg: p.mpg,
    injuryStatus: Math.random() > 0.9 ? 'Questionable' : 'Healthy',
    lastGame: randomDate(7)
  }));
}

// Helper functions for player physical attributes
function getPlayerHeight(position) {
  const heights = {
    'PG': ["6'1\"", "6'2\"", "6'3\""],
    'SG': ["6'3\"", "6'4\"", "6'5\""],
    'SF': ["6'6\"", "6'7\"", "6'8\""],
    'PF': ["6'8\"", "6'9\"", "6'10\""],
    'C': ["6'10\"", "6'11\"", "7'0\"", "7'1\"", "7'4\""]
  };
  const options = heights[position] || heights['SF'];
  return options[Math.floor(Math.random() * options.length)];
}

function getPlayerWeight(position) {
  const weights = {
    'PG': [175, 185, 190],
    'SG': [195, 205, 210],
    'SF': [215, 225, 235],
    'PF': [235, 245, 255],
    'C': [250, 265, 280]
  };
  const options = weights[position] || weights['SF'];
  return options[Math.floor(Math.random() * options.length)];
}

function generateGames(count = 12) {
  const games = [];
  for (let i = 0; i < count; i++) {
    const homeTeam = randomElement(teams);
    const awayTeam = randomElement(teams.filter(t => t !== homeTeam));
    const homeScore = Math.floor(Math.random() * 50 + 90);
    const awayScore = Math.floor(Math.random() * 50 + 90);

    games.push({
      id: `game_${i + 1}`,
      date: randomDate(30),
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      sport: randomElement(sports),
      homeScore: homeScore,
      awayScore: awayScore,
      status: Math.random() > 0.3 ? 'Final' : 'Scheduled',
      homeSpread: parseFloat((Math.random() * 7 - 3.5).toFixed(1)),
      overUnder: Math.floor(Math.random() * 30 + 200),
      homeMoneyline: Math.floor(Math.random() * 200 - 110),
      awayMoneyline: Math.floor(Math.random() * 200 + 110),
      quarter: Math.floor(Math.random() * 4) + 1,
      timeRemaining: `${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60)}`
    });
  }
  return games;
}

function generateStats() {
  return {
    totalBets: 342,
    winRate: 0.56,
    roiPercent: 12.5,
    profitLoss: 3420,
    averageOdds: 1.85,
    winStreak: 4,
    lossStreak: 2,
    longestWinStreak: 8,
    longestLossStreak: 3,
    standardDeviation: 145.32,
    sharpeRatio: 1.42,
    sortino: 1.89
  };
}

export const mockData = {
  generatePredictions,
  generateBets,
  generateBankroll,
  generatePlayers,
  generateGames,
  generateStats,
  NBA_PLAYERS_DATABASE
};

// Helper to simulate API response structure
export async function generateMockEntities(entityName, count = 10) {
  // For PlayerSeasonStats, use real NBA data
  if (entityName === 'PlayerSeasonStats') {
    if (!realPlayersCache) {
      await loadRealNBAData();
    }
    return { 
      rows: realPlayersCache || [], 
      total: realPlayersCache?.length || 0 
    };
  }

  const generators = {
    Prediction: () => ({ rows: generatePredictions(count), total: count }),
    Bet: () => ({ rows: generateBets(count), total: count }),
    Bankroll: () => ({ rows: [generateBankroll()], total: 1 }),
    Player: () => ({ rows: generatePlayers(100), total: 100 }),
    PlayerGameLog: () => ({ rows: [], total: 0 }),
    Game: () => ({ rows: generateGames(count), total: count }),
    Stats: () => ({ rows: [generateStats()], total: 1 })
  };

  if (generators[entityName]) {
    return generators[entityName]();
  }
  return { rows: [], total: 0 };
}

// Generate workstation-compatible players with props, game logs, predictions
const TEAM_FULL_NAMES = {
  'LAL': 'Los Angeles Lakers', 'BOS': 'Boston Celtics', 'GSW': 'Golden State Warriors',
  'MIA': 'Miami Heat', 'DEN': 'Denver Nuggets', 'PHX': 'Phoenix Suns',
  'DAL': 'Dallas Mavericks', 'BKN': 'Brooklyn Nets', 'MEM': 'Memphis Grizzlies',
  'SAC': 'Sacramento Kings', 'PHI': 'Philadelphia 76ers', 'MIL': 'Milwaukee Bucks',
  'LAC': 'LA Clippers', 'NYK': 'New York Knicks', 'CHI': 'Chicago Bulls',
  'ATL': 'Atlanta Hawks', 'CLE': 'Cleveland Cavaliers', 'TOR': 'Toronto Raptors',
  'MIN': 'Minnesota Timberwolves', 'NOP': 'New Orleans Pelicans', 'POR': 'Portland Trail Blazers',
  'OKC': 'Oklahoma City Thunder', 'IND': 'Indiana Pacers', 'UTA': 'Utah Jazz',
  'WAS': 'Washington Wizards', 'CHA': 'Charlotte Hornets', 'SAS': 'San Antonio Spurs',
  'DET': 'Detroit Pistons', 'HOU': 'Houston Rockets', 'ORL': 'Orlando Magic'
};

function generatePlayerProps(player) {
  const hitRateBase = Math.round(50 + Math.random() * 40);
  return [
    { type: 'Points', line: Math.round(player.ppg - 0.5 + Math.random()), hitRate: hitRateBase, avg: player.ppg, overOdds: -115 + Math.round(Math.random() * 20), underOdds: -105 - Math.round(Math.random() * 10), trend: Math.random() > 0.6 ? 'hot' : Math.random() > 0.3 ? 'neutral' : 'cold' },
    { type: 'Rebounds', line: Math.round(player.rpg - 0.5 + Math.random()), hitRate: hitRateBase - 10, avg: player.rpg, overOdds: -110, underOdds: -110, trend: Math.random() > 0.5 ? 'neutral' : 'cold' },
    { type: 'Assists', line: Math.round(player.apg - 0.5 + Math.random()), hitRate: hitRateBase - 5, avg: player.apg, overOdds: -120, underOdds: +100, trend: Math.random() > 0.5 ? 'hot' : 'neutral' },
    { type: 'PRA', line: Math.round(player.ppg + player.rpg + player.apg - 1), hitRate: hitRateBase + 5, avg: player.ppg + player.rpg + player.apg, overOdds: -125, underOdds: +105, trend: 'hot' },
    { type: '3PT Made', line: Math.round(player.ppg * player.threePct / 3), hitRate: hitRateBase - 15, avg: (player.ppg * player.threePct / 3).toFixed(1), overOdds: +115, underOdds: -135, trend: 'neutral' }
  ];
}

function generateLast10Games(player) {
  const opponents = ['GSW', 'LAL', 'BOS', 'PHX', 'DAL', 'DEN', 'MIA', 'MIL', 'PHI', 'CLE'];
  return Array.from({ length: 10 }, (_, i) => {
    const pts = Math.round(player.ppg + (Math.random() - 0.5) * 12);
    const reb = Math.round(player.rpg + (Math.random() - 0.5) * 6);
    const ast = Math.round(player.apg + (Math.random() - 0.5) * 4);
    return {
      date: `Jan ${20 - i * 2}`,
      opp: opponents[i],
      pts, reb, ast,
      pra: pts + reb + ast,
      result: Math.random() > 0.4 ? 'W' : 'L',
      mins: Math.round(player.mpg + (Math.random() - 0.5) * 6)
    };
  });
}

export function generateWorkstationPlayers(count = 100) {
  return NBA_PLAYERS_DATABASE.slice(0, count).map(p => {
    const confidence = Math.round(60 + Math.random() * 35);
    const edge = parseFloat((Math.random() * 5 - 1).toFixed(1));
    return {
      id: p.id,
      name: p.name,
      team: p.team,
      teamFull: TEAM_FULL_NAMES[p.team] || p.team,
      position: p.position,
      number: p.number,
      opponent: `${Math.random() > 0.5 ? 'vs' : '@'} ${NBA_TEAMS[Math.floor(Math.random() * NBA_TEAMS.length)]}`,
      gameTime: `${7 + Math.floor(Math.random() * 3)}:${Math.random() > 0.5 ? '00' : '30'} PM`,
      isHome: Math.random() > 0.5,
      status: Math.random() > 0.9 ? 'Questionable' : 'Active',
      image: p.name.split(' ').map(n => n[0]).join(''),
      seasonStats: {
        ppg: p.ppg, rpg: p.rpg, apg: p.apg, spg: p.spg, bpg: p.bpg,
        fgPct: (p.fgPct * 100).toFixed(1), threePct: (p.threePct * 100).toFixed(1),
        ftPct: (p.ftPct * 100).toFixed(1), mpg: p.mpg, gamesPlayed: Math.round(35 + Math.random() * 15)
      },
      props: generatePlayerProps(p),
      last10Games: generateLast10Games(p),
      vsOpponent: {
        games: Math.round(10 + Math.random() * 10),
        avgPts: parseFloat((p.ppg + (Math.random() - 0.5) * 5).toFixed(1)),
        overRate: Math.round(50 + Math.random() * 40),
        record: `${Math.round(5 + Math.random() * 8)}-${Math.round(3 + Math.random() * 5)}`
      },
      mlPrediction: {
        value: parseFloat((p.ppg + (Math.random() - 0.5) * 4).toFixed(1)),
        confidence,
        edge,
        recommendation: edge > 2 ? 'OVER' : edge > 0.5 ? 'LEAN OVER' : edge < -2 ? 'UNDER' : edge < -0.5 ? 'LEAN UNDER' : 'PASS'
      },
      market: {
        publicOver: Math.round(40 + Math.random() * 40),
        sharpOver: Math.round(40 + Math.random() * 40),
        lineMovement: parseFloat((Math.random() * 2 - 1).toFixed(1))
      }
    };
  });
}

// Export the workstation players for direct import
export const WORKSTATION_PLAYERS = generateWorkstationPlayers(100);

export default mockData;
