import React from 'react';

export default function DevDemo(){
  return (
    <div style={{padding: '40px', textAlign: 'center'}}>
      <h1 style={{fontSize: '32px', marginBottom: '20px'}}>🏀 CourtEdge</h1>
      <h2 style={{fontSize: '24px', color: '#9aa4b2', marginBottom: '30px'}}>Betting Analytics Dashboard</h2>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '40px'}}>
        <div style={{padding: '20px', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.3)'}}>
          <div style={{fontSize: '12px', color: '#9aa4b2'}}>Win Rate</div>
          <div style={{fontSize: '28px', fontWeight: 'bold', marginTop: '10px'}}>67.3%</div>
        </div>
        <div style={{padding: '20px', background: 'rgba(34,197,94,0.1)', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.3)'}}>
          <div style={{fontSize: '12px', color: '#9aa4b2'}}>Total ROI</div>
          <div style={{fontSize: '28px', fontWeight: 'bold', marginTop: '10px', color: '#22c55e'}}>+24.5%</div>
        </div>
        <div style={{padding: '20px', background: 'rgba(168,85,247,0.1)', borderRadius: '8px', border: '1px solid rgba(168,85,247,0.3)'}}>
          <div style={{fontSize: '12px', color: '#9aa4b2'}}>Active Bets</div>
          <div style={{fontSize: '28px', fontWeight: 'bold', marginTop: '10px'}}>12</div>
        </div>
      </div>

      <div style={{marginTop: '40px', padding: '20px', background: 'rgba(100,116,139,0.1)', borderRadius: '8px'}}>
        <p style={{color: '#cbd5e1', marginBottom: '15px'}}>✅ App is running with mock data</p>
        <p style={{color: '#9aa4b2', fontSize: '14px'}}>Navigate using the sidebar to explore the dashboard</p>
      </div>
    </div>
  );
}
