#!/usr/bin/env node
/*
 * SB·KIMTool·Point — Spore-Generator (kopierbare Variante, von Sage geliefert)
 * ----------------------------------------------------------------------------
 * Erzeugt eine `sbkim/spore.json`, die durch Sages Verifizierer als ✔ VALID
 * läuft. Umgesetzt nach eurem eigenen Vertrag docs/ANDOCK.md (§2 Schema,
 * §3 Schlüssel-Haltung, §4 kanonische Signier-Form, §5 Demo-Vektor) — ergänzt
 * um die zwei Pflichtfelder, die Sages Modul 02 zusätzlich verlangt:
 * `createdAt` und `embeddingModel`.
 *
 * EINBAU bei euch (SB-KIMTool-Point):
 *   1. Datei ablegen, z.B. als scripts/generate_spore.mjs
 *   2. Identität dauerhaft hinterlegen (ANDOCK §3): Umgebungs-Secret
 *        SBKIM_NODE_KEY = base64 eures Ed25519-PKCS8-PEM.
 *      Einmalig erzeugen (lokal/CI), Ausgabe als Secret speichern:
 *        node -e "import('node:crypto').then(c=>{const{privateKey}=c.generateKeyPairSync('ed25519');process.stdout.write(Buffer.from(privateKey.export({type:'pkcs8',format:'pem'})).toString('base64'))})"
 *   3. Lauf:  SBKIM_NODE_KEY=... node scripts/generate_spore.mjs
 *      -> schreibt sbkim/spore.json
 *   4. Veröffentlichen (Pages) und Sage Bescheid geben.
 *
 * OHNE Secret erzeugt das Skript eine FLÜCHTIGE Test-Identität und markiert
 * sie klar als „ungesichert / nur Test" (genau wie ANDOCK §3 verlangt) — die
 * nodeId wechselt dann pro Lauf und ist KEIN bleibender Endknoten.
 *
 * Node ≥ 18 (getestet v22). Keine npm-Abhängigkeiten.
 *
 * Gegenprobe (mit Sages Werkzeug, sobald die Datei live ist):
 *   node tools/verify_remote_spore.mjs https://lausiklauskn-png.github.io/SB-KIMTool-Point/sbkim/spore.json
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve, isAbsolute } from "node:path";
import {
  createPrivateKey, createPublicKey, generateKeyPairSync, sign as edSign, createHash,
} from "node:crypto";

/* ============================ KONFIG — hier anpassen ====================== */
const CONFIG = {
  nodeName: "SB-KIMTool-Point",
  nodeType: "hybrid",                       // provider | seeker | hybrid
  domain: "SBKIM-Werkzeuge",
  domainDescription: "Werkzeug-Knoten am SBKIM-Mycel — Observatorium light für Forker.",
  domainKeywords: ["SBKIM-Tools", "Andock-Werkzeug", "Observatorium-light"],
  endpoint: "https://lausiklauskn-png.github.io/SB-KIMTool-Point/",  // mit Schrägstrich!
  embeddingModel: "Xenova/multilingual-e5-small",
  protocolVersion: "0.1",
  outPath: "sbkim/spore.json",
};
/* ========================================================================= */

// --- base64url ohne Padding (RFC 4648 §5), deckungsgleich zu Sage Modul 02 ---
function base64url(buf) {
  return Buffer.from(buf).toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64urlToBuf(str) {
  const pad = str.length % 4 === 0 ? "" : "====".slice(str.length % 4);
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

// --- kanonische Form: rekursiver lexikografischer Schlüssel-Sort, kein Whitespace ---
function canonicalize(value) {
  if (value === null) return null;
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = canonicalize(value[k]);
    return out;
  }
  return value;
}
function canonicalBytes(obj) {
  return Buffer.from(JSON.stringify(canonicalize(obj)), "utf8");
}

// --- deterministischer Demo-Vektor (KEIN echtes Embedding, ANDOCK §5) ---
function demoVector(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  const v = new Array(384);
  for (let i = 0; i < 384; i++) {
    s = (1103515245 * s + 12345) >>> 0;
    v[i] = (s / 0xffffffff) * 2 - 1;
  }
  const norm = Math.sqrt(v.reduce((a, x) => a + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

// --- Schlüssel laden (ANDOCK §3): SBKIM_NODE_KEY oder flüchtig ---
function loadKeyPair() {
  const raw = process.env.SBKIM_NODE_KEY;
  if (raw && raw.trim()) {
    let pem = raw.trim();
    if (!pem.includes("BEGIN")) {
      const decoded = Buffer.from(pem, "base64").toString("utf8");
      pem = decoded.includes("BEGIN") ? decoded : pem; // base64(PEM) oder schon PEM
    }
    const privateKey = createPrivateKey({ key: pem, format: "pem" });
    const publicKey = createPublicKey(privateKey);
    return { privateKey, publicKey, ephemeral: false };
  }
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  return { privateKey, publicKey, ephemeral: true };
}

async function main() {
  const { privateKey, publicKey, ephemeral } = loadKeyPair();

  // publicKey als JWK in Sages Feld-Reihenfolge/-Form
  const jwk = publicKey.export({ format: "jwk" }); // {kty:"OKP",crv:"Ed25519",x}
  const publicKeyJwk = {
    alg: "Ed25519", crv: "Ed25519", ext: true,
    key_ops: ["verify"], kty: "OKP", x: jwk.x,
  };

  // id = base64url(SHA256(roher 32-Byte-Pubkey)) — roher Pubkey = decode(x)
  const rawPub = base64urlToBuf(jwk.x);
  const id = base64url(createHash("sha256").update(rawPub).digest());

  const unsigned = {
    createdAt: new Date().toISOString(),         // von Sage verlangt
    domain: CONFIG.domain,
    domainDescription: CONFIG.domainDescription,
    domainKeywords: CONFIG.domainKeywords,
    domainVector: demoVector(CONFIG.nodeName),
    embeddingModel: CONFIG.embeddingModel,       // von Sage verlangt
    endpoint: CONFIG.endpoint,
    id,
    nodeName: CONFIG.nodeName,
    nodeType: CONFIG.nodeType,
    protocolVersion: CONFIG.protocolVersion,
    publicKey: publicKeyJwk,
    _demo: ["domainVector"],                     // ehrliche Demo-Markierung (ANDOCK §5)
  };

  // Ed25519-Signatur über die kanonischen Bytes (ANDOCK §4)
  const signature = base64url(edSign(null, canonicalBytes(unsigned), privateKey));
  const spore = canonicalize(unsigned);
  spore.signature = signature;

  const outPath = isAbsolute(CONFIG.outPath) ? CONFIG.outPath : resolve(process.cwd(), CONFIG.outPath);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(spore, null, 2) + "\n", "utf8");

  console.log("spore.json geschrieben:", outPath);
  console.log("  nodeId:", id);
  if (ephemeral) {
    console.warn("  ⚠ UNGESICHERT / NUR TEST — kein SBKIM_NODE_KEY gesetzt.");
    console.warn("    nodeId wechselt pro Lauf. Für einen bleibenden Endknoten Secret setzen (ANDOCK §3).");
  } else {
    console.log("  ✓ bleibende Identität aus SBKIM_NODE_KEY.");
  }
}

main().catch((err) => { console.error("FEHLER:", err && err.stack ? err.stack : err); process.exit(1); });
