import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {routes,render} from '../.ssr/entry-server.js';
const base=new URL(process.env.VITE_SITE_URL||'https://ops-universe.github.io/');
if(base.protocol!=='https:'||base.pathname!=='/'||base.search||base.hash||base.username||base.password)throw new Error('Expected HTTPS root URL');
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shell=await readFile('dist/index.html','utf8');
for(const route of routes){
 const canonical=new URL(route.path,base).href;
 const meta='<meta name="description" content="'+esc(route.description)+'"><link rel="canonical" href="'+esc(canonical)+'"><meta property="og:title" content="'+esc(route.title)+'"><meta property="og:description" content="'+esc(route.description)+'"><meta property="og:url" content="'+esc(canonical)+'"><meta name="robots" content="'+(route.noindex?'noindex,follow':'index,follow')+'">';
 const html=shell.replace(/<title>.*?<\/title>/,'<title>'+esc(route.title)+'</title>').replace('<!--seo-->',meta).replace('<!--app-->',()=>render(route.path));
 const file=join('dist',route.path==='/'?'index.html':route.noindex?'404.html':route.path.slice(1)+'index.html');
 await mkdir(dirname(file),{recursive:true});await writeFile(file,html);
}
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.filter(r=>!r.noindex).map(r=>'<url><loc>'+esc(new URL(r.path,base).href)+'</loc></url>').join('')+'</urlset>');
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: '+new URL('sitemap.xml',base).href+'\n');
