import "fake-indexeddb/auto"; import { webcrypto } from "node:crypto"; import { readFileSync } from "node:fs";
const S=process.argv[2]; globalThis.window=globalThis;
for (const p of ["01_storage","02_spore"]) new Function("global","window","globalThis","crypto","console","btoa","atob","TextEncoder","TextDecoder","indexedDB",readFileSync(S+"/src/modules/"+p+".js","utf8"))(globalThis,globalThis,globalThis,webcrypto,{info(){},warn(){},error(){},log(){}},btoa,atob,TextEncoder,TextDecoder,indexedDB);
const Sp=globalThis.SbkimSpore; await Sp.getOrCreateIdentity("a");
const s=await Sp.generateOwnSpore({domain:"d",endpoint:"https://x/",nodeType:"hybrid"},"a");
const k=JSON.parse(JSON.stringify(s)); k.signature="AAAA"; const k2=JSON.parse(JSON.stringify(s)); k2.domainDescription="nachträglich eingefügt";
for (const [n,x] of [["echt",s],["Signatur kaputt",k],["Feld nachträglich verändert",k2]]) { const r=await Sp.verifyForeignSpore(x); console.log(n.padEnd(28), JSON.stringify(r), "→ Modul 23 wertet `r !== false` als echt:", r!==false); }
