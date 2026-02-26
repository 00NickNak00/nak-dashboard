const { execSync } = require('child_process');
const path = require('path');

export function getHyperliquidTradingData() {
  try {
    // Run a python script to get the actual data from the exchange
    const scriptPath = path.join(process.cwd(), '../agents/trader/get_dashboard_data.py');
    
    // Create the script if it doesn't exist
    const pythonScript = `
import os
import json
from hyperliquid.info import Info
from hyperliquid.utils import constants

# Load credentials
env_path = os.path.expanduser('~/.openclaw/workspace/../agents/trader/.env')
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line:
                k, v = line.strip().split('=', 1)
                os.environ[k] = v

info = Info(constants.TESTNET_API_URL, skip_ws=True)
address = os.environ.get("HYPERLIQUID_WALLET_ADDRESS")

data = {
    "positions": [],
    "history": [],
    "equity": 0
}

if address:
    # Get positions
    user_state = info.user_state(address)
    data["equity"] = float(user_state['marginSummary']['accountValue'])
    
    for p in user_state.get('assetPositions', []):
        pos = p['position']
        if float(pos['szi']) != 0:
            data["positions"].append({
                "coin": pos['coin'],
                "size": pos['szi'],
                "entry": pos['entryPx'],
                "pnl": pos['unrealizedPnl'],
                "pnl_pct": (float(pos['unrealizedPnl']) / (abs(float(pos['szi'])) * float(pos['entryPx']))) * 100
            })
            
    # Get history
    fills = info.user_fills(address)
    for f in fills[:10]:
        data["history"].append({
            "coin": f['coin'],
            "side": f['side'],
            "sz": f['sz'],
            "px": f['px'],
            "time": f['time'],
            "closed_pnl": f.get('closedPnl', '0')
        })

print(json.dumps(data))
`;

    const fs = require('fs');
    fs.writeFileSync(scriptPath, pythonScript);

    const output = execSync(`python3 ${scriptPath}`, { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    console.error('Error fetching HL data:', error);
    return { positions: [], history: [], equity: 0 };
  }
}
