/**
 * Pathao sandbox smoke test — run: node scripts/test-pathao-sandbox.mjs
 */
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] ??= value;
  }
}

loadEnv();

const baseUrl =
  process.env.PATHAO_SANDBOX === "true"
    ? "https://courier-api-sandbox.pathao.com"
    : process.env.PATHAO_BASE_URL || "https://api-hermes.pathao.com";

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  return { ok: res.ok, status: res.status, data, text };
}

async function getToken() {
  console.log("\n1) Issue token...");
  const result = await fetchJson(`${baseUrl}/aladdin/api/v1/issue-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.PATHAO_CLIENT_ID,
      client_secret: process.env.PATHAO_CLIENT_SECRET,
      username: process.env.PATHAO_USERNAME,
      password: process.env.PATHAO_PASSWORD,
      grant_type: "password",
    }),
  });

  console.log("   Status:", result.status);
  if (!result.ok) {
    console.log("   Error:", JSON.stringify(result.data, null, 2));
    throw new Error("Token failed");
  }

  const token = result.data.access_token;
  console.log("   Token OK, expires_in:", result.data.expires_in);
  return token;
}

async function getStores(token) {
  console.log("\n2) Fetch stores...");
  const result = await fetchJson(`${baseUrl}/aladdin/api/v1/stores`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log("   Status:", result.status);
  console.log("   Response:", JSON.stringify(result.data, null, 2));

  const stores = result.data?.data?.data ?? result.data?.data ?? [];
  const list = Array.isArray(stores) ? stores : [];
  if (list.length === 0) throw new Error("No stores found in sandbox account");
  return list[0];
}

async function createOrder(token, storeId) {
  console.log("\n3) Create sandbox order...");
  const merchantOrderId = `EZ-TEST-${Date.now()}`;
  const payload = {
    store_id: Number(storeId),
    merchant_order_id: merchantOrderId,
    recipient_name: "Test Customer",
    recipient_phone: "01712345678",
    recipient_address: "House 12, Road 5, Dhanmondi, Dhaka",
    delivery_type: 48,
    item_type: 2,
    item_quantity: 1,
    item_weight: 0.5,
    item_description: "EZ Shop Mystery Box Test",
    amount_to_collect: 595,
  };

  const result = await fetchJson(`${baseUrl}/aladdin/api/v1/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log("   Status:", result.status);
  console.log("   Response:", JSON.stringify(result.data, null, 2));

  if (!result.ok) throw new Error("Create order failed");

  const data = result.data?.data ?? result.data;
  const consignmentId = data?.consignment_id ?? data?.consignmentId;
  return { consignmentId, merchantOrderId };
}

async function trackOrder(token, consignmentId) {
  console.log("\n4) Track order...");
  const result = await fetchJson(
    `${baseUrl}/aladdin/api/v1/orders/${encodeURIComponent(consignmentId)}/info`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("   Status:", result.status);
  console.log("   Response:", JSON.stringify(result.data, null, 2));
}

async function main() {
  console.log("Pathao Sandbox Test");
  console.log("Base URL:", baseUrl);

  const token = await getToken();

  let storeId = process.env.PATHAO_STORE_ID;
  if (!storeId) {
    const store = await getStores(token);
    storeId = String(store.store_id ?? store.id);
    console.log(`\n   Using store: ${store.store_name ?? store.name} (ID: ${storeId})`);
    console.log(`   Add to .env: PATHAO_STORE_ID=${storeId}`);
  }

  const { consignmentId } = await createOrder(token, storeId);
  console.log("\n   Consignment ID:", consignmentId);

  if (consignmentId) {
    await trackOrder(token, consignmentId);
  }

  console.log("\n✓ Pathao sandbox test completed successfully");
}

main().catch((err) => {
  console.error("\n✗ Test failed:", err.message);
  process.exit(1);
});
