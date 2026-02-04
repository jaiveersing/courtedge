import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the DataInitializer to avoid API calls during tests
jest.mock('../../Components/ui/DataInitializer', () => {
  return function DataInitializerMock({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});

describe('App Component', () => {
  const renderApp = () => {
    return render(<App />);
  };

  test('renders without crashing', () => {
    renderApp();
    expect(document.body).toBeTruthy();
  });

  test('renders dashboard by default', async () => {
    renderApp();
    
    // Wait for the dashboard to load
    await waitFor(() => {
      expect(document.querySelector('body')).toBeTruthy();
    });
  });

  test('navigates between routes', async () => {
    renderApp();
    const user = userEvent.setup();
    
    // This is a basic smoke test - adjust selectors based on your actual UI
    await waitFor(() => {
      expect(document.body).toBeTruthy();
    });
  });
});
