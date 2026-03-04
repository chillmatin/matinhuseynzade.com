import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), ".vercel/output/functions/_render.func/.vc-config.json");

try {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  config.runtime = "nodejs20.x";
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("✓ Patched .vc-config.json runtime to nodejs20.x");
} catch (err) {
  console.error("Failed to patch Vercel runtime config:", err.message);
  process.exit(1);
}

