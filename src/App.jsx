import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../Layout.jsx';
import DataInitializer from '../Components/ui/DataInitializer';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from '../Components/auth/ProtectedRoute';

import Dashboard from '../Pages/DashboardNew';
import DevDemo from './DevDemo';
import Bets from '../Pages/Bets';
import Analytics from '../Pages/Analytics';
import PlayerProfile from '../Pages/PlayerProfile';
import Settings from '../Pages/Settings';
import Portfolio from '../Pages/Portfolio';
import BankrollManagement from '../Pages/BankrollManagement';
import GameProps from '../Pages/GameProps';
import PlayerPropDetail from '../Pages/PlayerPropDetail';
import PlayerPropBetting from '../Pages/PlayerPropBetting';
import PlayerTrends from '../Pages/PlayerTrends';
import Workstation from '../Pages/Workstation';
import MLWorkstation from '../Pages/MLWorkstation';
import PlayerDatabase from '../Components/player/PlayerDatabase';
import LoginForm from '../Components/auth/LoginForm';
import SignupForm from '../Components/auth/SignupForm';

export default function App(){
  console.log('App component rendering...');
  try {
    return (
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark">
          <AuthProvider>
          <DataInitializer>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={
                <ProtectedRoute requireAuth={false}>
                  <LoginForm />
                </ProtectedRoute>
              } />
              <Route path="/signup" element={
                <ProtectedRoute requireAuth={false}>
                  <SignupForm />
                </ProtectedRoute>
              } />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/bets" element={
                <ProtectedRoute>
                  <Layout>
                    <Bets />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Layout>
                    <Analytics />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/player/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <PlayerProfile />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/players" element={
                <ProtectedRoute>
                  <Layout>
                    <PlayerDatabase />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/portfolio" element={
                <ProtectedRoute>
                  <Layout>
                    <Portfolio />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/bankroll" element={
                <ProtectedRoute>
                  <Layout>
                    <BankrollManagement />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/game/:id/props" element={
                <ProtectedRoute>
                  <Layout>
                    <GameProps />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/prop/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <PlayerPropDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/dev" element={
                <ProtectedRoute>
                  <Layout>
                    <DevDemo />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/player-prop/:playerId" element={
                <ProtectedRoute>
                  <Layout>
                    <PlayerPropBetting />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/player-trends" element={
                <ProtectedRoute>
                  <Layout>
                    <PlayerTrends />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/workstation" element={
                <ProtectedRoute>
                  <Layout>
                    <Workstation />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/ml-workstation" element={
                <ProtectedRoute>
                  <Layout>
                    <MLWorkstation />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </DataInitializer>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return <div style={{color: 'red', padding: '20px'}}>Error: {error.message}</div>;
  }
}
