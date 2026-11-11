import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { scorecardFlow } from '../_shared/scorecard-flow.ts';
const origins=['https://purpledrop.com','https://www.purpledrop.com','https://purpledrop.pages.dev','https://purpledrop-newsite.pages.dev','http://localhost:5173'];
serve(async req=>{
 const origin=req.headers.get('Origin')||'';
 const headers={'Access-Control-Allow-Origin':origins.includes(origin)?origin:origins[0],'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store, private'};
 if(req.method==='OPTIONS')return new Response('ok',{headers});
 if(!origins.includes(origin))return new Response('Forbidden',{status:403});
 if(req.method!=='POST')return new Response('Method not allowed',{status:405,headers});
 try {const raw=await req.text(); if(raw.length>4096)return new Response('Request too large',{status:413,headers}); const body=JSON.parse(raw);return await scorecardFlow(req,body,headers,'scan');}
 catch {return new Response(JSON.stringify({error:'Could not complete this check. Please request a fresh code and try again.'}),{status:500,headers:{...headers,'Content-Type':'application/json'}});}
});
