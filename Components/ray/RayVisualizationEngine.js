// ╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║  📊 RAY ADVANCED VISUALIZATION DATA - CHART & GRAPH DATA GENERATORS                                                 ║
// ║  D3.js Ready • Chart.js Compatible • Plotly Support • Heat Maps • Network Graphs • Sankey Diagrams                 ║
// ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📈 PERFORMANCE CHART DATA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class PerformanceChartGenerator {
  
  static generateTimeSeriesData(playerStats, dateRange) {
    // Generate time series data for line charts
    const data = {
      labels: [],
      datasets: [
        {
          label: 'Points',
          data: [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          yAxisID: 'y'
        },
        {
          label: 'Assists',
          data: [],
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          yAxisID: 'y'
        },
        {
          label: 'Rebounds',
          data: [],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          yAxisID: 'y'
        }
      ]
    };
    
    playerStats.forEach(game => {
      data.labels.push(game.date);
      data.datasets[0].data.push(game.points);
      data.datasets[1].data.push(game.assists);
      data.datasets[2].data.push(game.rebounds);
    });
    
    return {
      chartData: data,
      options: this.getTimeSeriesOptions(),
      insights: this.generateTimeSeriesInsights(data)
    };
  }

  static getTimeSeriesOptions() {
    return {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: 'Player Performance Over Time'
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Statistics'
          }
        }
      }
    };
  }

  static generateTimeSeriesInsights(data) {
    const insights = [];
    
    data.datasets.forEach(dataset => {
      const values = dataset.data;
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      const trend = this.calculateTrend(values);
      
      insights.push({
        stat: dataset.label,
        average: avg.toFixed(1),
        trend: trend > 0 ? '📈 Improving' : trend < 0 ? '📉 Declining' : '➡️ Stable',
        trendValue: (trend * 100).toFixed(1) + '% per game'
      });
    });
    
    return insights;
  }

  static calculateTrend(values) {
    const n = values.length;
    const indices = Array.from({length: n}, (_, i) => i);
    
    const sumX = indices.reduce((sum, i) => sum + i, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = indices.reduce((sum, i) => sum + (i * values[i]), 0);
    const sumX2 = indices.reduce((sum, i) => sum + (i * i), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope / (sumY / n);
  }

  static generateRadarChartData(playerStats) {
    // Generate radar chart for player skills
    return {
      labels: ['Scoring', 'Playmaking', 'Rebounding', 'Defense', 'Efficiency', 'Clutch'],
      datasets: [{
        label: playerStats.name,
        data: [
          this.normalizeScore(playerStats.ppg, 35),
          this.normalizeScore(playerStats.apg, 12),
          this.normalizeScore(playerStats.rpg, 15),
          this.normalizeScore(playerStats.defensive_rating, 100, true),
          this.normalizeScore(playerStats.ts_pct, 0.65),
          this.normalizeScore(playerStats.clutch_rating, 100)
        ],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }]
    };
  }

  static normalizeScore(value, maxValue, inverse = false) {
    let normalized = (value / maxValue) * 100;
    if (inverse) normalized = 100 - normalized;
    return Math.min(100, Math.max(0, normalized));
  }

  static generateBarChartData(comparisonData) {
    return {
      labels: comparisonData.map(d => d.label),
      datasets: [{
        label: 'Player Stats',
        data: comparisonData.map(d => d.value),
        backgroundColor: comparisonData.map((d, i) => {
          const hue = (i / comparisonData.length) * 360;
          return `hsla(${hue}, 70%, 60%, 0.8)`;
        }),
        borderColor: comparisonData.map((d, i) => {
          const hue = (i / comparisonData.length) * 360;
          return `hsla(${hue}, 70%, 50%, 1)`;
        }),
        borderWidth: 2
      }]
    };
  }

  static generateBubbleChartData(players) {
    return {
      datasets: [{
        label: 'Player Efficiency',
        data: players.map(p => ({
          x: p.usage_rate,
          y: p.ts_pct,
          r: p.ppg * 2,
          player: p.name
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }]
    };
  }

  static generateScatterPlotData(data) {
    return {
      datasets: [{
        label: 'Shot Distribution',
        data: data.shots.map(shot => ({
          x: shot.x,
          y: shot.y,
          made: shot.made
        })),
        backgroundColor: data.shots.map(shot => 
          shot.made ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
        ),
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🗺️ HEAT MAP GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class HeatMapGenerator {
  
  static generateShotHeatMap(shotData) {
    const courtGrid = this.createCourtGrid(50, 50);
    
    shotData.forEach(shot => {
      const gridX = this.mapToGrid(shot.x, -25, 25, 50);
      const gridY = this.mapToGrid(shot.y, 0, 47, 50);
      
      if (gridX >= 0 && gridX < 50 && gridY >= 0 && gridY < 50) {
        courtGrid[gridY][gridX].attempts++;
        if (shot.made) courtGrid[gridY][gridX].makes++;
      }
    });
    
    return {
      grid: courtGrid,
      visualization: this.createHeatMapVisualization(courtGrid),
      hotspots: this.identifyHotspots(courtGrid),
      coldspots: this.identifyColdspots(courtGrid)
    };
  }

  static createCourtGrid(width, height) {
    return Array.from({length: height}, () => 
      Array.from({length: width}, () => ({
        attempts: 0,
        makes: 0,
        fg_pct: 0,
        heat: 0
      }))
    );
  }

  static mapToGrid(value, minValue, maxValue, gridSize) {
    return Math.floor(((value - minValue) / (maxValue - minValue)) * gridSize);
  }

  static createHeatMapVisualization(grid) {
    return grid.map(row => 
      row.map(cell => {
        if (cell.attempts === 0) return { color: '#e0e0e0', intensity: 0 };
        
        cell.fg_pct = cell.makes / cell.attempts;
        cell.heat = cell.fg_pct * Math.min(1, cell.attempts / 10);
        
        return {
          color: this.getHeatColor(cell.heat),
          intensity: cell.heat,
          tooltip: `${(cell.fg_pct * 100).toFixed(1)}% on ${cell.attempts} attempts`
        };
      })
    );
  }

  static getHeatColor(heat) {
    if (heat >= 0.6) return '#00ff00';
    if (heat >= 0.5) return '#90ee90';
    if (heat >= 0.4) return '#ffff00';
    if (heat >= 0.3) return '#ffa500';
    if (heat >= 0.2) return '#ff6347';
    return '#ff0000';
  }

  static identifyHotspots(grid) {
    const hotspots = [];
    
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.attempts >= 5 && cell.fg_pct >= 0.55) {
          hotspots.push({
            position: { x, y },
            fg_pct: (cell.fg_pct * 100).toFixed(1) + '%',
            attempts: cell.attempts,
            makes: cell.makes
          });
        }
      });
    });
    
    return hotspots.sort((a, b) => parseFloat(b.fg_pct) - parseFloat(a.fg_pct));
  }

  static identifyColdspots(grid) {
    const coldspots = [];
    
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.attempts >= 5 && cell.fg_pct <= 0.35) {
          coldspots.push({
            position: { x, y },
            fg_pct: (cell.fg_pct * 100).toFixed(1) + '%',
            attempts: cell.attempts,
            makes: cell.makes
          });
        }
      });
    });
    
    return coldspots.sort((a, b) => parseFloat(a.fg_pct) - parseFloat(b.fg_pct));
  }

  static generateDefensiveHeatMap(defensiveData) {
    return {
      contestedShots: this.generateShotHeatMap(defensiveData.contested),
      allowedShots: this.generateShotHeatMap(defensiveData.allowed),
      protectionZones: this.identifyProtectionZones(defensiveData)
    };
  }

  static identifyProtectionZones(data) {
    return {
      rim: this.calculateZoneProtection(data.rim),
      midRange: this.calculateZoneProtection(data.midRange),
      threePoint: this.calculateZoneProtection(data.threePoint),
      overall: this.calculateOverallProtection(data)
    };
  }

  static calculateZoneProtection(zoneData) {
    const oppFG = zoneData.makes / zoneData.attempts;
    const leagueAvg = zoneData.leagueAverage || 0.45;
    const difference = (leagueAvg - oppFG) * 100;
    
    return {
      oppFG: (oppFG * 100).toFixed(1) + '%',
      vs_league: (difference > 0 ? '+' : '') + difference.toFixed(1) + '%',
      rating: difference > 5 ? 'Elite' : difference > 2 ? 'Good' : difference > -2 ? 'Average' : 'Poor'
    };
  }

  static calculateOverallProtection(data) {
    const totalAttempts = data.rim.attempts + data.midRange.attempts + data.threePoint.attempts;
    const totalMakes = data.rim.makes + data.midRange.makes + data.threePoint.makes;
    
    return {
      oppFG: ((totalMakes / totalAttempts) * 100).toFixed(1) + '%',
      contests: data.contests || 'N/A',
      rating: 'Calculated'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🌊 FLOW DIAGRAM GENERATOR (SANKEY)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class FlowDiagramGenerator {
  
  static generateBankrollFlowDiagram(transactions) {
    const nodes = [
      { id: 'initial', name: 'Initial Bankroll' },
      { id: 'wins', name: 'Winning Bets' },
      { id: 'losses', name: 'Losing Bets' },
      { id: 'withdrawals', name: 'Withdrawals' },
      { id: 'deposits', name: 'Deposits' },
      { id: 'current', name: 'Current Bankroll' }
    ];
    
    const links = this.calculateFlows(transactions);
    
    return {
      nodes,
      links,
      plotlyData: this.convertToPlotlyFormat(nodes, links),
      summary: this.generateFlowSummary(links)
    };
  }

  static calculateFlows(transactions) {
    const flows = {
      initialToWins: 0,
      initialToLosses: 0,
      winsToWithdrawals: 0,
      depositsToWins: 0,
      depositsToLosses: 0,
      totalToCurrent: 0
    };
    
    transactions.forEach(tx => {
      if (tx.type === 'bet') {
        if (tx.result === 'win') {
          flows.initialToWins += tx.amount;
        } else {
          flows.initialToLosses += tx.amount;
        }
      } else if (tx.type === 'withdrawal') {
        flows.winsToWithdrawals += tx.amount;
      } else if (tx.type === 'deposit') {
        flows.depositsToWins += tx.amount;
      }
    });
    
    return [
      { source: 'initial', target: 'wins', value: flows.initialToWins },
      { source: 'initial', target: 'losses', value: flows.initialToLosses },
      { source: 'wins', target: 'withdrawals', value: flows.winsToWithdrawals },
      { source: 'deposits', target: 'wins', value: flows.depositsToWins },
      { source: 'wins', target: 'current', value: flows.initialToWins - flows.winsToWithdrawals },
      { source: 'deposits', target: 'current', value: flows.depositsToWins }
    ];
  }

  static convertToPlotlyFormat(nodes, links) {
    return {
      type: 'sankey',
      orientation: 'h',
      node: {
        pad: 15,
        thickness: 30,
        line: {
          color: 'black',
          width: 0.5
        },
        label: nodes.map(n => n.name),
        color: nodes.map((_, i) => `hsl(${i * 60}, 70%, 60%)`)
      },
      link: {
        source: links.map(l => nodes.findIndex(n => n.id === l.source)),
        target: links.map(l => nodes.findIndex(n => n.id === l.target)),
        value: links.map(l => l.value),
        color: 'rgba(0,0,0,0.2)'
      }
    };
  }

  static generateFlowSummary(links) {
    const totalFlow = links.reduce((sum, link) => sum + link.value, 0);
    
    return {
      totalFlow: totalFlow.toFixed(2),
      largestFlow: links.reduce((max, link) => Math.max(max, link.value), 0).toFixed(2),
      flowBreakdown: links.map(link => ({
        from: link.source,
        to: link.target,
        amount: link.value.toFixed(2),
        percentage: ((link.value / totalFlow) * 100).toFixed(1) + '%'
      }))
    };
  }

  static generatePropFlowDiagram(propData) {
    // Show flow from prop opportunities → selected bets → outcomes
    const nodes = [
      { id: 'opportunities', name: 'All Props' },
      { id: 'positive_ev', name: 'Positive EV' },
      { id: 'selected', name: 'Bets Placed' },
      { id: 'wins', name: 'Wins' },
      { id: 'losses', name: 'Losses' }
    ];
    
    const links = [
      { source: 'opportunities', target: 'positive_ev', value: propData.positiveEVCount },
      { source: 'positive_ev', target: 'selected', value: propData.selectedCount },
      { source: 'selected', target: 'wins', value: propData.wins },
      { source: 'selected', target: 'losses', value: propData.losses }
    ];
    
    return {
      nodes,
      links,
      plotlyData: this.convertToPlotlyFormat(nodes, links),
      conversionRates: {
        evToSelected: ((propData.selectedCount / propData.positiveEVCount) * 100).toFixed(1) + '%',
        selectedToWins: ((propData.wins / propData.selectedCount) * 100).toFixed(1) + '%'
      }
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 🕸️ NETWORK GRAPH GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class NetworkGraphGenerator {
  
  static generatePlayerConnectionGraph(players, correlations) {
    const nodes = players.map(player => ({
      id: player.id,
      label: player.name,
      size: player.ppg * 2,
      color: this.getTeamColor(player.team),
      title: `${player.name} - ${player.ppg} PPG`
    }));
    
    const edges = [];
    
    correlations.forEach(corr => {
      if (corr.value > 0.3) {
        edges.push({
          from: corr.player1,
          to: corr.player2,
          value: corr.value,
          width: corr.value * 5,
          color: this.getCorrelationColor(corr.value),
          title: `Correlation: ${(corr.value * 100).toFixed(1)}%`
        });
      }
    });
    
    return {
      nodes,
      edges,
      options: this.getNetworkOptions(),
      clusters: this.identifyClusters(nodes, edges),
      centralNodes: this.findCentralNodes(nodes, edges)
    };
  }

  static getTeamColor(team) {
    const teamColors = {
      LAL: '#552583',
      BOS: '#007A33',
      GSW: '#1D428A',
      MIL: '#00471B',
      PHI: '#006BB6'
    };
    return teamColors[team] || '#808080';
  }

  static getCorrelationColor(value) {
    if (value > 0.7) return 'rgba(255, 0, 0, 0.8)';
    if (value > 0.5) return 'rgba(255, 165, 0, 0.8)';
    return 'rgba(100, 100, 100, 0.5)';
  }

  static getNetworkOptions() {
    return {
      nodes: {
        shape: 'dot',
        scaling: {
          min: 10,
          max: 30
        },
        font: {
          size: 12,
          face: 'Arial'
        }
      },
      edges: {
        smooth: {
          type: 'continuous'
        }
      },
      physics: {
        stabilization: true,
        barnesHut: {
          gravitationalConstant: -30000,
          springConstant: 0.001,
          springLength: 200
        }
      }
    };
  }

  static identifyClusters(nodes, edges) {
    const clusters = {};
    
    nodes.forEach(node => {
      if (!clusters[node.color]) {
        clusters[node.color] = [];
      }
      clusters[node.color].push(node.id);
    });
    
    return Object.entries(clusters).map(([color, members]) => ({
      color,
      size: members.length,
      members
    }));
  }

  static findCentralNodes(nodes, edges) {
    const connectivity = {};
    
    nodes.forEach(node => {
      connectivity[node.id] = 0;
    });
    
    edges.forEach(edge => {
      connectivity[edge.from]++;
      connectivity[edge.to]++;
    });
    
    return Object.entries(connectivity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, connections]) => ({
        playerId: id,
        playerName: nodes.find(n => n.id === id)?.label,
        connections
      }));
  }

  static generateBettingNetworkGraph(bets) {
    // Show relationships between bets (same game parlays, correlated bets)
    const nodes = bets.map(bet => ({
      id: bet.id,
      label: bet.description,
      size: bet.stake / 10,
      color: bet.result === 'win' ? '#00ff00' : bet.result === 'loss' ? '#ff0000' : '#808080'
    }));
    
    const edges = this.findBetCorrelations(bets);
    
    return {
      nodes,
      edges,
      analysis: {
        totalBets: nodes.length,
        correlatedBets: edges.length,
        correlationRisk: edges.length > bets.length * 0.3 ? 'High' : 'Moderate'
      }
    };
  }

  static findBetCorrelations(bets) {
    const edges = [];
    
    for (let i = 0; i < bets.length; i++) {
      for (let j = i + 1; j < bets.length; j++) {
        const correlation = this.calculateBetCorrelation(bets[i], bets[j]);
        
        if (correlation > 0.3) {
          edges.push({
            from: bets[i].id,
            to: bets[j].id,
            value: correlation,
            width: correlation * 5
          });
        }
      }
    }
    
    return edges;
  }

  static calculateBetCorrelation(bet1, bet2) {
    // Simple correlation: same game = 1.0, same team = 0.5, same day = 0.3
    if (bet1.gameId === bet2.gameId) return 1.0;
    if (bet1.team === bet2.team) return 0.5;
    if (bet1.date === bet2.date) return 0.3;
    return 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 📊 ADVANCED STATISTICAL CHARTS
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

export class StatisticalChartGenerator {
  
  static generateBoxPlot(data, categories) {
    return categories.map(category => {
      const values = data.filter(d => d.category === category).map(d => d.value).sort((a, b) => a - b);
      
      const q1 = this.percentile(values, 25);
      const median = this.percentile(values, 50);
      const q3 = this.percentile(values, 75);
      const iqr = q3 - q1;
      const min = Math.max(values[0], q1 - 1.5 * iqr);
      const max = Math.min(values[values.length - 1], q3 + 1.5 * iqr);
      const outliers = values.filter(v => v < min || v > max);
      
      return {
        category,
        min,
        q1,
        median,
        q3,
        max,
        outliers,
        mean: values.reduce((sum, v) => sum + v, 0) / values.length
      };
    });
  }

  static percentile(sortedArray, percentile) {
    const index = (percentile / 100) * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (lower === upper) return sortedArray[lower];
    return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
  }

  static generateViolinPlot(data) {
    // Violin plot combines box plot with kernel density estimation
    const boxPlot = this.generateBoxPlot(data, [...new Set(data.map(d => d.category))]);
    const densities = boxPlot.map(box => {
      const categoryData = data.filter(d => d.category === box.category).map(d => d.value);
      return {
        category: box.category,
        density: this.kernelDensityEstimation(categoryData),
        boxPlot: box
      };
    });
    
    return {
      violinData: densities,
      chartType: 'violin',
      interpretation: 'Shows distribution shape and statistics combined'
    };
  }

  static kernelDensityEstimation(data, points = 50) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const bandwidth = this.silvermanBandwidth(data);
    
    const densityPoints = [];
    
    for (let i = 0; i < points; i++) {
      const x = min + (i / points) * (max - min);
      let density = 0;
      
      data.forEach(value => {
        density += this.gaussianKernel((x - value) / bandwidth);
      });
      
      density = density / (data.length * bandwidth);
      densityPoints.push({ x, y: density });
    }
    
    return densityPoints;
  }

  static gaussianKernel(u) {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);
  }

  static silvermanBandwidth(data) {
    const n = data.length;
    const stdDev = this.standardDeviation(data);
    return 1.06 * stdDev * Math.pow(n, -0.2);
  }

  static standardDeviation(data) {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  static generateCandlestickChart(priceData) {
    // For odds movement over time
    return priceData.map(candle => ({
      time: candle.timestamp,
      open: candle.openOdds,
      high: candle.highOdds,
      low: candle.lowOdds,
      close: candle.closeOdds,
      volume: candle.volume,
      color: candle.closeOdds > candle.openOdds ? '#00ff00' : '#ff0000'
    }));
  }

  static generateWaterfallChart(data) {
    // Shows cumulative effect of sequential values
    let runningTotal = 0;
    
    return data.map((item, i) => {
      const start = runningTotal;
      runningTotal += item.value;
      
      return {
        label: item.label,
        start,
        end: runningTotal,
        value: item.value,
        isPositive: item.value >= 0,
        color: item.value >= 0 ? '#00ff00' : '#ff0000'
      };
    });
  }
}

export default {
  PerformanceChartGenerator,
  HeatMapGenerator,
  FlowDiagramGenerator,
  NetworkGraphGenerator,
  StatisticalChartGenerator
};
