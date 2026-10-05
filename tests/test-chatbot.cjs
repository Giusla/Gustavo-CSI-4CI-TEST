const fs=require('fs'),vm=require('vm'),assert=require('assert');
const data=JSON.parse(fs.readFileSync('intents.json','utf8'));
const ctx={window:{GUSTAVO_INTENTS_DATA:data},document:{readyState:'loading',addEventListener(){}},console};
vm.createContext(ctx);
let src=fs.readFileSync('assets/js/chatbot-theme-inject.js','utf8').replace('  // Esecuzione al caricamento del DOM','  window.testHtml = buildModernHtml(); window.testMatcher = robustSendLogic; window.testSpeech = mouthAndBotSpeakLogic;\n  // Esecuzione al caricamento del DOM');
vm.runInContext(src,ctx);
const scripts=[...ctx.window.testHtml.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
scripts.forEach((s,i)=>new vm.Script(s[1],{filename:'iframe-script-'+i}));
vm.runInContext(ctx.window.testMatcher,ctx);
let count=0;
for (const room of data.intents.filter(i=>i.room)) {
 for(const q of room.patterns) {
 const found=ctx.matchLocalIntent(q);
 assert(found && (found.intent.tag===room.tag || found.intent.responses[0].startsWith('Quale aula')), q+' -> '+found?.intent.tag);
 count++;
 }
}
for (const [q,tag] of [['Mi porti alla 2 / 24?','luogo_aula_2_24'],['Dove si trova il laboratorio informatica 2?','destinazione_laboratorio_informatica_2'],['aula 224','luogo_aula_2_24']]) {
 const result=ctx.matchLocalIntent(q); assert(result?.intent.tag===tag,q+' -> '+result?.intent.tag);
}
for(const q of ['aula 999','aula 2/99','fisica','misure','laboratorio linguistico']) assert(!ctx.matchLocalIntent(q)?.intent.room,q);
vm.runInContext(fs.readFileSync('assets/js/intents-data.js','utf8'),ctx);
assert.deepStrictEqual(JSON.parse(JSON.stringify(ctx.window.GUSTAVO_INTENTS_DATA)),data);
console.log('PASS: '+count+' room patterns; generated iframe scripts parse; unknown and ambiguous rooms; JSON and browser data synchronized.');
(async () => {
 const input={value:'bozza veloce',disabled:false,focus(){}};
 const button={classList:{add(){},remove(){}}};
 const mic={};
 let now=10000; const bubbles=[];
 ctx.window.addEventListener=()=>{};
 ctx.document.getElementById=id=>({input,'btn-send':button,'mic-btn':mic}[id]||null);
 ctx.document.createElement=()=>({});
 ctx.messages={appendChild:b=>bubbles.push(b)};
 ctx.Date={now:()=>now};
 vm.runInContext(ctx.window.testSpeech,ctx);
 ctx.botSpeak=()=>{};
 ctx.setSpeakingState(true);
 assert.equal(input.value,'');assert.equal(input.disabled,true);assert.equal(input.placeholder,'Gustavo sta parlando...');
 input.value='aula 224'; await ctx.sendMessage();assert.equal(bubbles.length,0);assert.equal(input.value,'');
 ctx.setSpeakingState(false);assert.equal(input.disabled,false);
 input.value='aula 224';await ctx.sendMessage();assert.equal(bubbles.length,1);
 input.value='aula 225';now+=999;await ctx.sendMessage();assert.equal(bubbles.length,1);
 now+=1;await ctx.sendMessage();assert.equal(bubbles.length,2);
 now+=1000;ctx.AbortController=AbortController;ctx.setTimeout=setTimeout;ctx.clearTimeout=clearTimeout;
 let finish;ctx.fetch=()=>new Promise(r=>finish=r);
 input.value='domanda totalmente sconosciuta';const pending=ctx.sendMessage();
 now+=1000;input.value='aula 224';await ctx.sendMessage();assert.equal(bubbles.length,3);
 finish({ok:true,json:async()=>({answer:'Risposta'})});await pending;
 await ctx.sendMessage();assert.equal(bubbles.length,4);
 console.log('PASS: speech clears and locks input; messages at 999 ms blocked and 1000 ms accepted; concurrent requests blocked and lock released.');
})().catch(error=>{console.error(error);process.exitCode=1;});
