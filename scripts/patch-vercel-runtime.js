import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), ".vercel/output/functions/_render.func/.vc-config.json");

try {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  config.runtime = "nodejs20.x";
  // Ensure ws is not externalized and is bundled
  config.external = (config.external || []).filter(m => m !== "ws");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("✓ Patched .vc-config.json runtime to nodejs20.x and ensured ws is bundled");
} catch (err) {
  console.error("Failed to patch Vercel runtime config:", err.message);
  process.exit(1);
}

