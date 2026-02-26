const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

export function getHyperliquidTradingData() {
  try {
    const scriptPath = '/tmp/hl_dashboard_fetch.py';
    
    // Create a working python script that we know succeeds
    const pythonCode = `
import os
import json
from hyperliquid.info import Info
from hyperliquid.utils import constants

# Load credentials
env_path = '/Users/nak-bot/.openclaw/agents/trader/.env'
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line:
                k, v = line.strip().split('=', 1)
                os.environ[k] = v

info = Info(constants.TESTNET_API_URL, skip_ws=True)
address = os.environ.get("HYPERLIQUID_WALLET_ADDRESS", "0x31b9070a6DF80392118C0C167140d46323452bFE")

try:
    user_state = info.user_state(address)
    spot_state = info.spot_user_state(address)
    fills = info.user_fills(address)

    positions = []
    for p in user_state.get('assetPositions', []):
        pos = p['position']
        if float(pos['szi']) != 0:
            positions.append({
                "coin": pos['coin'],
                "size": pos['szi'],
                "entry": pos['entryPx'],
                "pnl": pos['unrealizedPnl'],
                "pnl_pct": (float(pos['unrealizedPnl']) / (abs(float(pos['szi'])) * float(pos['entryPx']))) * 100
            })

    spot_usdc = 0
    for b in spot_state.get('balances', []):
        if b['coin'] == 'USDC':
            spot_usdc = float(b['total'])

    equity = spot_usdc + float(user_state['marginSummary']['accountValue'])
    available = float(user_state['withdrawable'])

    data = {
        "positions": positions,
        "history": fills[:10],
        "equity": equity,
        "available": available
    }
    print(json.dumps(data))
except Exception as e:
    print(json.dumps({"error": str(e), "positions": [], "history": [], "equity": 0, "available": 0}))
`;

    fs.writeFileSync(scriptPath, pythonCode);

    // Run it
    const output = execSync(`python3 ${scriptPath}`, { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    console.error('Bridge Error:', error);
    return { positions: [], history: [], equity: 0, available: 0 };
  }
}
