// Pure JS Hyperliquid integration - Simplified to use only working endpoints
export async function getHyperliquidTradingData() {
  const address = process.env.HYPERLIQUID_WALLET_ADDRESS || "0x31b9070a6DF80392118C0C167140d46323452bFE";
  const url = "https://api.hyperliquid-testnet.xyz/info";

  try {
    // 1. Fetch User State (Positions & Equity) - This works reliably
    const userStateRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "clearinghouseState", user: address })
    });
    
    if (!userStateRes.ok) {
      console.error("HL User State HTTP error:", userStateRes.status);
      return { positions: [], history: [], equity: 0, available: 0 };
    }
    
    const userState = await userStateRes.json();

    // 2. Fetch User Fills (History)
    const historyRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "userFills", user: address })
    });
    const history = await historyRes.json();

    // 3. Extract positions from user state
    const positions = [];
    if (userState.assetPositions) {
      for (const p of userState.assetPositions) {
        const pos = p.position;
        if (parseFloat(pos.szi) !== 0) {
          positions.push({
            coin: pos.coin,
            size: pos.szi,
            entry: pos.entryPx,
            pnl: pos.unrealizedPnl,
            pnl_pct: (parseFloat(pos.unrealizedPnl) / (Math.abs(parseFloat(pos.szi)) * parseFloat(pos.entryPx))) * 100
          });
        }
      }
    }

    // 4. Extract equity values from margin summary
    const equity = parseFloat(userState.marginSummary?.accountValue || 0);
    const available = parseFloat(userState.withdrawable || 0);

    console.log(`[HL API] Equity: $${equity.toFixed(2)}, Available: $${available.toFixed(2)}`);

    return {
      positions,
      history: (history || []).slice(0, 10),
      equity,
      available
    };
  } catch (error) {
    console.error("HL API Error:", error.message);
    return { positions: [], history: [], equity: 0, available: 0 };
  }
}
