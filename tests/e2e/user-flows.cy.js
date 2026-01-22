describe('User Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should register new user', () => {
    cy.visit('/register');
    
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="username"]').type('newuser');
    cy.get('input[name="password"]').type('SecurePass123');
    cy.get('input[name="firstName"]').type('New');
    cy.get('input[name="lastName"]').type('User');
    
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });

  it('should login existing user', () => {
    cy.visit('/login');
    
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('SecurePass123');
    
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('exist');
  });

  it('should show error for invalid credentials', () => {
    cy.visit('/login');
    
    cy.get('input[name="username"]').type('wronguser');
    cy.get('input[name="password"]').type('wrongpass');
    
    cy.get('button[type="submit"]').click();
    
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('should logout user', () => {
    cy.login('testuser', 'SecurePass123');
    
    cy.get('[data-testid="user-menu"]').click();
    cy.contains('Logout').click();
    
    cy.url().should('include', '/login');
  });
});

describe('Betting Workflow', () => {
  beforeEach(() => {
    cy.login('testuser', 'SecurePass123');
  });

  it('should view predictions', () => {
    cy.visit('/predictions');
    
    cy.get('[data-testid="prediction-card"]').should('have.length.greaterThan', 0);
    cy.contains('Win Probability').should('be.visible');
  });

  it('should add bet to slip', () => {
    cy.visit('/line-shop');
    
    cy.get('[data-testid="odds-row"]').first().within(() => {
      cy.get('[data-testid="add-to-betslip"]').click();
    });
    
    cy.get('[data-testid="betslip"]').should('be.visible');
    cy.get('[data-testid="betslip-item"]').should('have.length', 1);
  });

  it('should create parlay bet', () => {
    cy.visit('/line-shop');
    
    // Add multiple bets
    cy.get('[data-testid="add-to-betslip"]').eq(0).click();
    cy.get('[data-testid="add-to-betslip"]').eq(1).click();
    
    cy.get('[data-testid="betslip"]').within(() => {
      cy.get('[data-testid="bet-type"]').select('parlay');
      cy.get('input[name="stake"]').type('100');
      cy.get('button[type="submit"]').click();
    });
    
    cy.contains('Bet placed successfully').should('be.visible');
  });

  it('should use Kelly Calculator', () => {
    cy.visit('/bankroll');
    
    cy.get('[data-testid="kelly-calculator"]').within(() => {
      cy.get('input[name="odds"]').type('-110');
      cy.get('input[name="probability"]').type('55');
      cy.get('button[type="button"]').contains('Calculate').click();
    });
    
    cy.get('[data-testid="kelly-result"]').should('be.visible');
    cy.contains('Recommended Stake').should('be.visible');
  });

  it('should track bet history', () => {
    cy.visit('/bets');
    
    cy.get('[data-testid="bet-filters"]').within(() => {
      cy.get('select[name="status"]').select('won');
    });
    
    cy.get('[data-testid="bet-row"]').each($el => {
      cy.wrap($el).should('contain', 'Won');
    });
  });
});

describe('Line Shopping and Arbitrage', () => {
  beforeEach(() => {
    cy.login('testuser', 'SecurePass123');
  });

  it('should compare odds across sportsbooks', () => {
    cy.visit('/line-shop');
    
    cy.get('[data-testid="game-row"]').first().click();
    
    cy.get('[data-testid="odds-comparison"]').should('be.visible');
    cy.get('[data-testid="bookmaker-odds"]').should('have.length.greaterThan', 1);
  });

  it('should detect arbitrage opportunities', () => {
    cy.visit('/arbitrage');
    
    cy.get('[data-testid="arbitrage-opportunity"]').first().within(() => {
      cy.contains('Profit').should('be.visible');
      cy.contains('%').should('be.visible');
    });
  });

  it('should track line movements', () => {
    cy.visit('/line-tracker');
    
    cy.get('[data-testid="game-selector"]').select(0);
    
    cy.get('[data-testid="line-chart"]').should('be.visible');
    cy.get('[data-testid="steam-move-alert"]').should('exist');
  });
});

describe('Social Features', () => {
  beforeEach(() => {
    cy.login('testuser', 'SecurePass123');
  });

  it('should view leaderboard', () => {
    cy.visit('/community');
    
    cy.contains('Leaderboard').click();
    
    cy.get('[data-testid="leaderboard-row"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="rank-1"]').should('exist');
  });

  it('should follow another user', () => {
    cy.visit('/community');
    
    cy.get('[data-testid="user-card"]').first().within(() => {
      cy.get('[data-testid="follow-button"]').click();
    });
    
    cy.contains('Following').should('be.visible');
  });

  it('should share and comment on bets', () => {
    cy.visit('/bets');
    
    cy.get('[data-testid="bet-row"]').first().within(() => {
      cy.get('[data-testid="share-button"]').click();
    });
    
    cy.visit('/community');
    cy.contains('Shared Bets').click();
    
    cy.get('[data-testid="shared-bet"]').first().within(() => {
      cy.get('[data-testid="comment-input"]').type('Great pick!');
      cy.get('[data-testid="comment-submit"]').click();
    });
    
    cy.contains('Great pick!').should('be.visible');
  });
});

describe('Mobile Responsiveness', () => {
  beforeEach(() => {
    cy.login('testuser', 'SecurePass123');
  });

  it('should display mobile navigation', () => {
    cy.viewport('iphone-x');
    cy.visit('/dashboard');
    
    cy.get('[data-testid="mobile-nav"]').should('be.visible');
    cy.get('[data-testid="bottom-nav"]').should('be.visible');
  });

  it('should support swipe gestures on cards', () => {
    cy.viewport('iphone-x');
    cy.visit('/predictions');
    
    cy.get('[data-testid="swipeable-card"]').first()
      .trigger('touchstart', { touches: [{ clientX: 100, clientY: 0 }] })
      .trigger('touchmove', { touches: [{ clientX: 20, clientY: 0 }] })
      .trigger('touchend');
    
    cy.get('[data-testid="card-actions"]').should('be.visible');
  });

  it('should pull to refresh', () => {
    cy.viewport('iphone-x');
    cy.visit('/dashboard');
    
    cy.get('[data-testid="pull-to-refresh"]')
      .trigger('touchstart', { touches: [{ clientX: 0, clientY: 0 }] })
      .trigger('touchmove', { touches: [{ clientX: 0, clientY: 100 }] })
      .trigger('touchend');
    
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
  });
});

describe('Real-time Updates', () => {
  beforeEach(() => {
    cy.login('testuser', 'SecurePass123');
  });

  it('should receive live odds updates', () => {
    cy.visit('/line-shop');
    
    cy.intercept('ws://localhost:3000/ws*').as('websocket');
    
    cy.wait('@websocket');
    
    // Simulate odds update
    cy.window().then(win => {
      win.postMessage({
        type: 'odds_update',
        data: { gameId: 'nba_001', odds: -115 }
      }, '*');
    });
    
    cy.get('[data-testid="odds-value"]').should('contain', '-115');
  });

  it('should show injury alerts', () => {
    cy.visit('/dashboard');
    
    cy.window().then(win => {
      win.postMessage({
        type: 'injury_update',
        data: {
          playerName: 'LeBron James',
          status: 'Questionable'
        }
      }, '*');
    });
    
    cy.get('[data-testid="notification-toast"]').should('be.visible');
    cy.contains('LeBron James').should('be.visible');
  });
});

describe('Performance', () => {
  it('should load dashboard quickly', () => {
    cy.login('testuser', 'SecurePass123');
    
    const start = Date.now();
    cy.visit('/dashboard');
    
    cy.get('[data-testid="dashboard-content"]').should('be.visible').then(() => {
      const loadTime = Date.now() - start;
      expect(loadTime).to.be.lessThan(3000);
    });
  });

  it('should handle large bet lists', () => {
    cy.login('testuser', 'SecurePass123');
    cy.visit('/bets');
    
    cy.get('[data-testid="bet-row"]').should('have.length.lessThan', 100);
    
    cy.scrollTo('bottom');
    cy.wait(500);
    
    cy.get('[data-testid="bet-row"]').should('have.length.greaterThan', 50);
  });
});

// Custom commands
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});
