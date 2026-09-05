import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, "../dist");
const clientDir = path.resolve(distDir, "client");

if (!fs.existsSync(distDir)) {
  console.error("dist directory does not exist!");
  process.exit(1);
}

if (!fs.existsSync(clientDir)) {
  fs.mkdirSync(clientDir, { recursive: true });
}

const entries = fs.readdirSync(distDir);

for (const entry of entries) {
  if (entry === "client") continue;

  const srcPath = path.join(distDir, entry);
  const destPath = path.join(clientDir, entry);

  fs.cpSync(srcPath, destPath, { recursive: true });
}

console.log("Successfully mirrored dist output into dist/client for Netlify compatibility.");
