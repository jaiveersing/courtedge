# CourtEdge Integration Checklist

## 🎯 Step-by-Step Integration Guide

Use this checklist to integrate all the production-ready improvements into your existing CourtEdge codebase.

---

## Phase 1: Setup & Dependencies (30 minutes)

### ☐ 1.1 Install New Dependencies
```powershell
npm install
```

**Verify installation:**
- Check for any peer dependency warnings
- Ensure all TypeScript types are installed
- Confirm husky hooks are set up

### ☐ 1.2 Set Up Git Hooks
```powershell
npm run prepare
```

### ☐ 1.3 Verify TypeScript Configuration
```powershell
npm run type-check
```

**Expected:** Should complete without errors (may have warnings about .jsx files)

---

## Phase 2: Testing Infrastructure (1 hour)

### ☐ 2.1 Run Initial Tests
```powershell
npm test
```

**Expected:** All tests should pass

### ☐ 2.2 Check Test Coverage
```powershell
npm test -- --coverage
```

**Target:** Aim for 70%+ coverage over time

### ☐ 2.3 Test Python ML Service
```powershell
cd ml_service
pytest tests/ -v
cd ..
```

---

## Phase 3: Code Quality (30 minutes)

### ☐ 3.1 Run Linting
```powershell
npm run lint
```

**Action:** Review warnings and fix critical issues

### ☐ 3.2 Auto-Fix Linting Issues
```powershell
npm run lint:fix
```

### ☐ 3.3 Format Code
```powershell
npm run format
```

### ☐ 3.4 Verify Formatting
```powershell
npm run format:check
```

---

## Phase 4: Security Integration (2 hours)

### ☐ 4.1 Update server/index.js

Add at the top:
```javascript
import { log } from './logger.js';
import {
  securityHeaders,
  apiRateLimiter,
  mlRateLimiter,
  corsOptions,
  requestLogger,
  errorHandler,
  sanitizeInput
} from './middleware/security.js';
```

Add middleware (before routes):
```javascript
// Security
app.use(securityHeaders);
app.use(requestLogger);
app.use(sanitizeInput);

// Rate limiting
app.use('/api', apiRateLimiter);
app.use('/api/ml', mlRateLimiter);

// CORS
app.use(cors(corsOptions));

// ... your routes here ...

// Error handling (last middleware)
app.use(errorHandler);
```

### ☐ 4.2 Replace console.log with Structured Logging

**Find & Replace:**
- `console.log` → `log.info`
- `console.error` → `log.error`
- `console.warn` → `log.warn`

**Example transformation:**
```javascript
// Before
console.log('User logged in:', userId);

// After
log.info('User logged in', { userId });
```

### ☐ 4.3 Add Request Validation

For each endpoint that accepts input:
```javascript
import { validate, validationRules } from './middleware/security.js';

app.post('/api/bets',
  validate([
    body('betType').isIn(['player_prop', 'game', 'parlay']),
    body('stake').isFloat({ min: 0 }),
    // ... more validation
  ]),
  createBet
);
```

---

## Phase 5: Database Setup (1 hour)

### ☐ 5.1 Start PostgreSQL & Redis
```powershell
docker-compose up -d postgres redis
```

### ☐ 5.2 Verify Database Connection
```powershell
docker exec -it courtedge-db psql -U postgres -d courtedge -c "SELECT version();"
```

### ☐ 5.3 Run Schema Migration
```powershell
docker exec -it courtedge-db psql -U postgres -d courtedge -f /docker-entrypoint-initdb.d/init.sql
```

### ☐ 5.4 Verify Tables Created
```powershell
docker exec -it courtedge-db psql -U postgres -d courtedge -c "\dt"
```

**Expected:** Should list all tables (users, bets, predictions, etc.)

---

## Phase 6: Docker Environment (30 minutes)

### ☐ 6.1 Build All Images
```powershell
docker-compose build
```

### ☐ 6.2 Start All Services
```powershell
docker-compose up
```

### ☐ 6.3 Verify All Services Healthy

**Check each service:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000/health
- ML API: http://localhost:8000/health
- ML Docs: http://localhost:8000/docs

### ☐ 6.4 Check Service Logs
```powershell
docker-compose logs -f
```

**Look for:** No error messages, all services started successfully

---

## Phase 7: TypeScript Migration (Ongoing)

### ☐ 7.1 Start with Utility Files

**Convert in this order:**
1. `src/types/index.ts` ✅ (already created)
2. `utils/` files
3. `src/api/` files
4. `src/hooks/` files
5. Simple components
6. Complex components

### ☐ 7.2 Conversion Steps Per File

1. Rename `.jsx` → `.tsx` or `.js` → `.ts`
2. Add type imports: `import type { Player, Bet } from '@/types'`
3. Add prop types: `interface MyComponentProps { ... }`
4. Add return types to functions
5. Fix any TypeScript errors
6. Run `npm run type-check`

**Example:**
```typescript
// Before: MyComponent.jsx
export default function MyComponent({ player, onSelect }) {
  return <div>{player.name}</div>;
}

// After: MyComponent.tsx
import type { Player } from '@/types';

interface MyComponentProps {
  player: Player;
  onSelect: (player: Player) => void;
}

export default function MyComponent({ player, onSelect }: MyComponentProps) {
  return <div>{player.name}</div>;
}
```

### ☐ 7.3 Track Migration Progress

Keep a list of converted files:
- [ ] utils/index.js
- [ ] src/api/mlService.js
- [ ] src/hooks/useMLWebSocket.js
- [ ] Components/ui/Button.jsx
- ... etc

---

## Phase 8: CI/CD Setup (1 hour)

### ☐ 8.1 Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

**Add these secrets:**
- `SNYK_TOKEN` - Snyk API token
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `RENDER_API_KEY` - Render API key
- `RENDER_ML_SERVICE_ID` - Render ML service ID
- `RAILWAY_TOKEN` - Railway deployment token
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password
- `KUBE_CONFIG` - Kubernetes config (if using)
- `SLACK_WEBHOOK` - Slack webhook URL (optional)

### ☐ 8.2 Test CI Pipeline

1. Create a new branch
2. Make a small change
3. Push and create a PR
4. Watch GitHub Actions run
5. Verify all checks pass

### ☐ 8.3 Configure Branch Protection

GitHub repo → Settings → Branches → Add rule for `main`:
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- Select: lint, test-frontend, test-backend, test-ml-service

---

## Phase 9: Environment Configuration (30 minutes)

### ☐ 9.1 Update .env File

Copy new variables from `.env.example` and add:
```env
# Logging
LOG_LEVEL=info

# Security
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
API_KEYS=your_api_key_here

# Rate Limiting
RATE_LIMIT_ENABLED=true
```

### ☐ 9.2 Generate JWT Secret
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add to `.env`:
```env
JWT_SECRET=<generated_secret>
```

### ☐ 9.3 Configure Production Environment

For production deployment, set:
```env
NODE_ENV=production
ENVIRONMENT=production
VITE_API_URL=https://api.yoursite.com
VITE_ML_API_URL=https://ml.yoursite.com
```

---

## Phase 10: Performance Optimization (Next Phase)

### ☐ 10.1 Measure Current Performance
```powershell
npm run build
```

**Check bundle size in `dist/`**

### ☐ 10.2 Implement Code Splitting

**Add to components:**
```typescript
import { lazy, Suspense } from 'react';

const PlayerProfile = lazy(() => import('../Pages/PlayerProfile'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PlayerProfile />
    </Suspense>
  );
}
```

### ☐ 10.3 Add React.memo

For expensive components:
```typescript
const ExpensiveComponent = React.memo(({ data }) => {
  // ... component code
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.data.id === nextProps.data.id;
});
```

### ☐ 10.4 Implement Redis Caching

**In backend:**
```javascript
import { cache } from './cache.js';

app.get('/api/players/:id', async (req, res) => {
  const cached = await cache.get(`player:${req.params.id}`);
  if (cached) {
    return res.json(cached);
  }
  
  const data = await fetchPlayerData(req.params.id);
  await cache.set(`player:${req.params.id}`, data, 300); // 5 min TTL
  res.json(data);
});
```

---

## Phase 11: Testing & Validation (1 hour)

### ☐ 11.1 Full System Test

1. Start all services: `docker-compose up`
2. Frontend loads without errors
3. Can navigate between pages
4. ML predictions work
5. Bets can be created
6. Analytics display correctly

### ☐ 11.2 Performance Testing

Use Chrome DevTools → Lighthouse:
- Performance score > 90
- Accessibility score > 90
- Best practices score > 90

### ☐ 11.3 Security Testing

Run security audit:
```powershell
npm audit
npm audit fix
```

### ☐ 11.4 Cross-Browser Testing

Test in:
- Chrome ✓
- Firefox ✓
- Safari ✓
- Edge ✓

---

## Phase 12: Documentation (30 minutes)

### ☐ 12.1 Update README.md

Add sections for:
- New setup instructions
- Testing commands
- Docker commands
- CI/CD information

### ☐ 12.2 Create CONTRIBUTING.md

Guidelines for:
- Code style
- Commit messages
- Pull request process
- Testing requirements

### ☐ 12.3 Document API Changes

Update API.md with any new endpoints or changes

---

## 🎯 Success Criteria

You've successfully integrated all improvements when:

✅ All tests pass (`npm test`)
✅ No TypeScript errors (`npm run type-check`)
✅ No linting errors (`npm run lint`)
✅ Code is formatted (`npm run format:check`)
✅ Docker services start successfully
✅ Database schema is applied
✅ CI/CD pipeline runs on PRs
✅ Security middleware is active
✅ Logging is structured
✅ Application works as before (no regressions)

---

## 🆘 Troubleshooting

### Issue: Tests failing
**Solution:** Check jest.setup.js for proper polyfills, verify test files have correct imports

### Issue: TypeScript errors
**Solution:** Run `npm run type-check` for details, add `// @ts-expect-error` temporarily if needed

### Issue: Docker services won't start
**Solution:** Check logs with `docker-compose logs`, verify ports aren't in use, check .env file

### Issue: Database connection failed
**Solution:** Verify PostgreSQL is running, check connection string, run schema migration

### Issue: CI pipeline failing
**Solution:** Check GitHub Actions logs, verify secrets are set, test locally first

---

## 📞 Next Steps After Integration

1. **Week 1:** Monitor logs, fix any issues, add more tests
2. **Week 2:** Convert 10-20% of files to TypeScript
3. **Week 3:** Implement performance optimizations
4. **Week 4:** Real NBA API integration

---

**Start Date:** _____________
**Completed Date:** _____________
**Team Members:** _____________

---

*For questions or issues, refer to IMPLEMENTATION_SUMMARY.md*
