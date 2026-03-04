import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), ".vercel/output/functions/_render.func/.vc-config.json");

try {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  // Fix runtime format from nodejs24.x to node-24.x (Vercel's expected format)
  config.runtime = config.runtime.replace(/^nodejs(\d+)\.x$/, "node-$1.x");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`✓ Patched .vc-config.json runtime to ${config.runtime}`);
} catch (err) {
  console.error("Failed to patch Vercel runtime config:", err.message);
  process.exit(1);
}

