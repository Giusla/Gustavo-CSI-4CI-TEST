const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync('assets/js/chatbot-theme-inject.js','utf8').split('const microphoneLogic = String.raw`')[1].split('\n`;')[0];
function harness(native=true,userAgent='') {
 let click,rec,sent=0,status; const classes=new Set(); let starts=0;
 const btn={classList:{add(name){classes.add(name);},remove(name){classes.delete(name);}},setAttribute(){},addEventListener(_,fn){click=fn;}};
 const input={value:''};
 class Recognition {constructor(){rec=this;}start(){starts++;}stop(){this.onend();}abort(){}}
 const ctx={window:{SpeechRecognition:native?Recognition:null,addEventListener(){}},document:{getElementById:()=>btn,createElement:()=>({setAttribute(){}})},messages:{appendChild(s){status=s;}},input,_isSpeaking:false,_sendInFlight:false,_lastUserMessageAt:-Infinity,Date,setTimeout:()=>1,clearTimeout(){},navigator:{userAgent},sendMessage(){sent++;}};
 vm.createContext(ctx);vm.runInContext(code,ctx);
 return {ctx,input,btn,click:()=>click(),rec:()=>rec,sent:()=>sent,status:()=>status.textContent,classes,starts:()=>starts};
}
(async()=>{
 const h=harness();await h.click();assert.equal(h.rec().lang,'it-IT');assert(h.classes.has('listening'));assert.equal(h.rec().continuous,true);assert.equal(h.rec().interimResults,true);
 const result=[{transcript:'Dove si trova aula 224?'}];result.isFinal=false;
 h.rec().onresult({resultIndex:0,results:[result]});assert.match(h.status(),/Ho sentito/);await h.click();assert(!h.classes.has('listening'));
 assert.equal(h.sent(),1);assert.equal(h.input.value,'Dove si trova aula 224?');assert.equal(h.btn.disabled,false);
 await h.click();h.rec().onerror({error:'not-allowed'});h.rec().onend();assert.equal(h.sent(),1);assert.match(h.status(),/Consenti/);
 await h.click();h.rec().onend();assert.equal(h.starts(),4);assert(h.classes.has('listening'));await h.click();assert.equal(h.sent(),1);assert.match(h.status(),/non supporta/);
 h.ctx._isSpeaking=true;await h.click();assert.equal(h.sent(),1);
 const opera=harness(true,'Mozilla/5.0 OPR/120.0');let recorder,stopped=0,form;
 opera.ctx.navigator.userAgent='Mozilla/5.0 OPR/120.0';
 opera.ctx.navigator.mediaDevices={getUserMedia:async()=>({getTracks:()=>[{stop(){stopped++;}}]})};
 class Recorder {
   static isTypeSupported(type){return type==='audio/webm;codecs=opus';}
   constructor(stream,options){recorder=this;this.mimeType=options.mimeType;this.state='inactive';}
   start(){this.state='recording';}
   stop(){this.state='inactive';this.ondataavailable({data:new Blob(['test audio'],{type:this.mimeType})});return this.onstop();}
 }
 opera.ctx.window.MediaRecorder=Recorder;opera.ctx.MediaRecorder=Recorder;
 opera.ctx.Blob=Blob;opera.ctx.FormData=FormData;opera.ctx.AbortController=AbortController;
 opera.ctx.SERVER_URL='https://gustavo1.avoprogetti.it';
 opera.ctx.fetch=async(url,options)=>{form=options.body;assert.equal(url,'https://gustavo1.avoprogetti.it/api/transcribe');return {ok:true,json:async()=>({text:'aula 224'})};};
 await opera.click();assert(recorder);assert.equal(opera.starts(),0);assert(opera.classes.has('listening'));
 await recorder.stop();assert(form.has('audio'));assert(!form.has('file'));assert.equal(opera.sent(),1);assert.equal(stopped,1);assert(!opera.classes.has('listening'));
 const no=harness(false);await no.click();assert.match(no.status(),/non supporta/);assert.equal(no.btn.disabled,false);
 console.log('PASS: Immediate red stop button, interim transcript submission, premature-session restart, Italian voice recognition, denied permission, empty audio, speaking guard and unsupported browser cleanup.');
})().catch(e=>{console.error(e);process.exitCode=1;});
