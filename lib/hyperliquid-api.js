// Correct JS Hyperliquid integration (Works on Vercel & Local)
export async function getHyperliquidTradingData() {
  const address = "0x31b9070a6DF80392118C0C167140d46323452bFE";
  const url = "https://api.hyperliquid-testnet.xyz/info";

  try {
    // 1. Fetch Perp State
    const userStateRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "clearinghouseState", user: address })
    });
    const userState = await userStateRes.json();

    // 2. Fetch Spot State
    const spotStateRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "spotClearinghouseState", user: address })
    });
    const spotState = await spotStateRes.json();

    // 3. Fetch History
    const historyRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "userFills", user: address })
    });
    const history = await historyRes.json();

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

    let spotUsdc = 0;
    if (spotState && spotState.balances) {
      const usdcBalance = spotState.balances.find(b => b.coin === "USDC");
      if (usdcBalance) spotUsdc = parseFloat(usdcBalance.total);
    }

    const equity = spotUsdc + parseFloat(userState.marginSummary?.accountValue || 0);
    const available = spotUsdc - parseFloat(userState.marginSummary?.totalMarginUsed || 0);

    return {
      positions,
      history: (history || []).slice(0, 10),
      equity,
      available
    };
  } catch (error) {
    console.error("HL API Error:", error);
    return { positions: [], history: [], equity: 0, available: 0 };
  }
}
