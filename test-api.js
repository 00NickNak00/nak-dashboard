// Test script to debug the JS fetch logic
const address = "0x31b9070a6DF80392118C0C167140d46323452bFE";
const url = "https://api.hyperliquid-testnet.xyz/info";

async function testFetch() {
  console.log("Testing User State fetch...");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "clearinghouseState", user: address })
    });
    const data = await res.json();
    console.log("User State Success. Margin Account Value:", data.marginSummary?.accountValue);
    console.log("Withdrawable (Available):", data.withdrawable);
  } catch (e) {
    console.error("User State Failed:", e);
  }

  console.log("\nTesting Spot State fetch...");
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "spotUserState", user: address })
    });
    const data = await res.json();
    console.log("Spot State Success. Balances count:", data.balances?.length);
    const usdc = data.balances?.find(b => b.coin === "USDC");
    console.log("Spot USDC:", usdc?.total);
  } catch (e) {
    console.error("Spot State Failed:", e);
  }
}

testFetch();
