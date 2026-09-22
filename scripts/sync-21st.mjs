import fs from "node:fs/promises";

const BASE = "https://21st.dev/community/components";
const OUT = "data/21st-catalog.json";

function absolute(href) {
  if (!href) return null;
  try { return new URL(href, BASE).href; } catch { return null; }
}

function clean(s) {
  return (s || "").replace(/\\s+/g, " ").trim();
}

const html = await (await fetch(BASE, {headers:{ "user-agent":"Archive-W/1.0 catalog-sync" }})).text();
const links = [...html.matchAll(/href=["']([^"']*\\/community\\/components\\/[^"']+)["'][^>]*>([\\s\\S]*?)<\\/a>/gi)];

const seen = new Set();
const items = [];
for (const m of links) {
  const url = absolute(m[1]);
  if (!url || seen.has(url) || url === BASE) continue;
  const title = clean(m[2].replace(/<[^>]+>/g, " "));
  if (!title || title.length < 2 || title.length > 120) continue;
  seen.add(url);
  items.push({
    id: Buffer.from(url).toString("base64url").slice(0, 18),
    title,
    category: "Community",
    source: url,
    preview: null,
    fetchedAt: new Date().toISOString()
  });
}

const unique = items.slice(0, 2000);
await fs.mkdir("data", {recursive:true});
await fs.writeFile(OUT, JSON.stringify({
  source: BASE,
  generatedAt: new Date().toISOString(),
  count: unique.length,
  note: "Canonical links are kept instead of republishing third-party source code or prompts.",
  items: unique
}, null, 2) + "\n");

console.log("Synced", unique.length, "21st component links");
