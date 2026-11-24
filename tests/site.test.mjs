import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {routes,projects} from '../src/data.mjs';
test('all routes have prerendered headings and unique titles',async()=>{const titles=new Set();for(const r of routes){const path=r.path==='/'?'index.html':r.noindex?'404.html':r.path.slice(1)+'index.html';const html=await readFile('dist/'+path,'utf8');assert.match(html,/<h1>/);assert.match(html,/rel="canonical"/);assert.ok(html.includes(r.title.replaceAll('&','&amp;')));assert.ok(!titles.has(r.title));titles.add(r.title);}});
test('planned projects are not presented as existing repositories',()=>{for(const p of projects.filter(p=>p.status==='Planned'))assert.equal(p.url,undefined);});
test('404 excluded from sitemap and noindexed',async()=>{assert.match(await readFile('dist/404.html','utf8'),/noindex,follow/);assert.doesNotMatch(await readFile('dist/sitemap.xml','utf8'),/404\.html/);});
