const address = "0x31b9070a6DF80392118C0C167140d46323452bFE";
const url = "https://api.hyperliquid-testnet.xyz/info";

async function debugSpot() {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "spotUserState", user: address })
  });
  const text = await res.text();
  console.log("Raw Response:", text);
}

debugSpot();
