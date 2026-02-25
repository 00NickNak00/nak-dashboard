# NAK Trading Dashboard

Live-updating dashboard for trading, billing, and agent monitoring. Deployed on Vercel.

## Features

- 📊 Real-time billing tracking (Gemini & Anthropic)
- 🤖 Agent status monitoring (Trader, Researcher, Monitor)
- 📈 Trading position & P&L display
- 🎨 Dark theme with purple/pink/yellow accents
- ⚡ Live updates every 30 seconds
- 📱 Responsive sidebar navigation

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

3. **Run dev server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

## Deployment to Vercel

### Step 1: Push to GitHub
```bash
cd /Users/nak-bot/.openclaw/workspace/dashboard
git init
git add .
git commit -m "Initial dashboard setup"
git remote add origin https://github.com/YOUR_USERNAME/nak-dashboard.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `TRADER_WORKSPACE` = `/Users/nak-bot/.openclaw/agents/trader`
   - `GOOGLE_BILLING_API_KEY` = Your Google Cloud API key
   - `ANTHROPIC_API_KEY` = Your Anthropic API key
5. Click "Deploy"

### Step 3: Live Updates
Vercel will auto-deploy on every push to `main` branch. Your dashboard will be live at:
```
https://nak-dashboard.vercel.app
```

## API Routes

- `GET /api/billing` - Current billing status & spend
- `GET /api/trading` - Open positions & P&L
- `GET /api/agents` - Agent status & last run times

## Next Steps

1. Integrate real Google Cloud Billing API
2. Integrate real Anthropic usage API
3. Read actual trader state files
4. Add more pages (Billing detail, Trading history, etc.)
5. Add WebSocket for truly live updates
6. Add trading controls (manual spawn, stop)

## Color Scheme

- **Background:** Slate-900 to purple-900 gradient
- **Primary accent:** Purple (500-600)
- **Secondary accent:** Pink (500-600)
- **Tertiary accent:** Yellow (400-500)
- **Success:** Green (400)
- **Warning:** Yellow (400)
- **Danger:** Red (400)
