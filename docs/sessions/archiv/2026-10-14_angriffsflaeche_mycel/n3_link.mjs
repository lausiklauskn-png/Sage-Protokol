// N3: Link aus einer eingefügten KI-Antwort — parseAiAnswer + openUrl wörtlich aus Modul 22 im echten Chromium.
import { readFileSync } from "node:fs"; import http from "node:http"; import { chromium } from "playwright-core";
const src = readFileSync(process.argv[2] + "/src/modules/22_such_widget.js", "utf8");
const teil = src.slice(src.indexOf("function cleanUrl"), src.indexOf("// Kurze KI-Zusammenfassung"));
const open = src.slice(src.indexOf("  function openUrl(url)"), src.indexOf("  // Sprache der Zusammenfassung"));
const seite = `<!doctype html><title>App</title><a id=a>Treffer</a><button id=b>↗ Seite öffnen</button><script>
var global=window; function warn(){}; ${teil}; ${open};
localStorage.setItem("geheim","KI-SCHLUESSEL-123");
var antwort = JSON.stringify({treffer:[{titel:"Offizielle Seite",url:"javascript:window.__lief=1;document.title=localStorage.getItem(String.fromCharCode(103,101,104,101,105,109));void(0)"}]});
var t = parseAiAnswer(antwort)[0]; window.__url = t.url;
var a=document.getElementById("a"); a.href=t.url; a.target="_blank"; a.rel="noopener noreferrer";
document.getElementById("b").onclick=function(){ openUrl(t.url); };
</script>`;
const srv = http.createServer((q,r)=>{r.setHeader("content-type","text/html;charset=utf-8");r.end(seite);}).listen(0);
const port = srv.address().port;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext(); const p = await ctx.newPage();
const neue=[]; ctx.on("page", pg => neue.push(pg));
await p.goto(`http://127.0.0.1:${port}/`);
console.log("URL nach parseAiAnswer:", await p.evaluate(()=>window.__url));
await p.click("#b"); await p.waitForTimeout(1500);
console.log("openUrl (Knopf ↗ Seite öffnen): neue Seiten", neue.length, "| Titel der App:", await p.title(),
  "| neue Seite lief?", await Promise.all(neue.map(async n=>{ try { return (await n.evaluate(()=>[location.href,document.title,window.__lief||0,(()=>{try{return localStorage.getItem('geheim')}catch(e){return 'kein Zugriff: '+e.name}})()])); } catch(e){ return "Fehler "+e.message.slice(0,60);} })));
neue.length=0;
await p.click("#a", { modifiers:["Control"] }); await p.waitForTimeout(1200);
console.log("<a target=_blank> Strg-Klick: neue Seiten", neue.length, "| Titel der App:", await p.title());
await p.evaluate(()=>{ document.getElementById("a").removeAttribute("target"); });
await p.click("#a"); await p.waitForTimeout(800);
console.log("<a> ohne target (wie ein App-Glue, der target vergisst): Titel der App:", await p.title());
await b.close(); srv.close();
