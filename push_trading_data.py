import os
import json
import time
from hyperliquid.info import Info
from hyperliquid.utils import constants

# Path to the dashboard data file
DATA_FILE = '/Users/nak-bot/.openclaw/workspace/dashboard/public/trading_data.json'

def push_data():
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

    while True:
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

            # Calculation to match UI 'Available'
            # UI Available = Spot USDC - Margin Used
            margin_used = float(user_state['marginSummary']['totalMarginUsed'])
            available = spot_usdc - margin_used

            data = {
                "positions": positions,
                "history": fills[:10],
                "equity": spot_usdc + float(user_state['marginSummary']['accountValue']),
                "available": available,
                "lastUpdated": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
            }

            # Write to the public folder
            os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
            with open(DATA_FILE, 'w') as f:
                json.dump(data, f)

            # print(f"Data pushed to dashboard: {data['equity']}")
            
        except Exception as e:
            print(f"Push Error: {e}")
            
        time.sleep(10)

if __name__ == "__main__":
    push_data()
