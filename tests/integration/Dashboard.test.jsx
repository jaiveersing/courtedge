import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../Pages/Dashboard';

// Mock API responses
const mockPredictions = [
  {
    id: '1',
    gameId: 'nba_001',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    predictedWinner: 'Lakers',
    winProbability: 65.5,
    gameDate: '2024-01-15T19:00:00Z'
  }
];

const mockBets = [
  {
    id: 'bet_1',
    sport: 'basketball',
    gameId: 'nba_001',
    selection: 'Lakers -3.5',
    odds: -110,
    stakeAmount: 100,
    status: 'pending'
  }
];

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    // Reset fetch mock
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('loads and displays dashboard data', async () => {
    // Mock API calls
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ predictions: mockPredictions })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ bets: mockBets })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          totalBets: 50,
          winRate: 55.5,
          profitLoss: 450.00,
          roi: 12.5
        })
      });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Lakers')).toBeInTheDocument();
    });

    // Check predictions are displayed
    expect(screen.getByText('Warriors')).toBeInTheDocument();
    expect(screen.getByText(/65.5%/)).toBeInTheDocument();

    // Check stats are displayed
    await waitFor(() => {
      expect(screen.getByText(/55.5%/)).toBeInTheDocument();
      expect(screen.getByText(/\$450/)).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    global.fetch.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('filters predictions by sport', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ predictions: mockPredictions })
    });

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Find and click sport filter
    const nbaButton = await screen.findByRole('button', { name: /nba/i });
    await user.click(nbaButton);

    // Verify fetch was called with correct params
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('sport=basketball_nba'),
        expect.any(Object)
      );
    });
  });

  test('refreshes data when refresh button clicked', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ predictions: mockPredictions })
    });

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const refreshButton = await screen.findByRole('button', { name: /refresh/i });
    
    // Clear previous calls
    jest.clearAllMocks();
    
    await user.click(refreshButton);

    // Verify data refetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
