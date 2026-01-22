import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../Layout.jsx';
import DataInitializer from '../Components/ui/DataInitializer';
import { ThemeProvider } from './contexts/ThemeContext';

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

export default function App(){
  console.log('App component rendering...');
  try {
    return (
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark">
          <DataInitializer>
            <Routes>
              {/* All routes now public - no authentication required */}
              <Route path="/" element={
                <Layout>
                  <Dashboard />
                </Layout>
              } />
              <Route path="/dashboard" element={
                <Layout>
                  <Dashboard />
                </Layout>
              } />
              <Route path="/bets" element={
                <Layout>
                  <Bets />
                </Layout>
              } />
              <Route path="/analytics" element={
                <Layout>
                  <Analytics />
                </Layout>
              } />
              <Route path="/player/:id" element={
                <Layout>
                  <PlayerProfile />
                </Layout>
              } />
              <Route path="/settings" element={
                <Layout>
                  <Settings />
                </Layout>
              } />
              <Route path="/players" element={
                <Layout>
                  <PlayerDatabase />
                </Layout>
              } />
              <Route path="/portfolio" element={
                <Layout>
                  <Portfolio />
                </Layout>
              } />
              <Route path="/bankroll" element={
                <Layout>
                  <BankrollManagement />
                </Layout>
              } />
              <Route path="/game/:id/props" element={
                <Layout>
                  <GameProps />
                </Layout>
              } />
              <Route path="/prop/:id" element={
                <Layout>
                  <PlayerPropDetail />
                </Layout>
              } />
              <Route path="/dev" element={
                <Layout>
                  <DevDemo />
                </Layout>
              } />
              <Route path="/player-prop/:playerId" element={
                <Layout>
                  <PlayerPropBetting />
                </Layout>
              } />
              <Route path="/player-trends" element={
                <Layout>
                  <PlayerTrends />
                </Layout>
              } />
              <Route path="/workstation" element={
                <Layout>
                  <Workstation />
                </Layout>
              } />
              <Route path="/ml-workstation" element={
                <Layout>
                  <MLWorkstation />
                </Layout>
              } />
            </Routes>
          </DataInitializer>
        </ThemeProvider>
    </BrowserRouter>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return <div style={{color: 'red', padding: '20px'}}>Error: {error.message}</div>;
  }
}
