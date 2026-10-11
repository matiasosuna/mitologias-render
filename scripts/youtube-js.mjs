// Genera el JavaScript que completa el diálogo de subida de YouTube Studio con la metadata
// del video (título, descripción con capítulos, etiquetas, lista, idioma, categoría, no-niños,
// contenido sintético). Uso: node scripts/youtube-js.mjs griegas-04-edades [anterior]
import { readFileSync } from 'node:fs';
const [id, anterior] = process.argv.slice(2);
const m = JSON.parse(readFileSync(`out/${id}/youtube.json`, 'utf8'));
let desc = m.descripcion.replace('📜 ', '').replace('▶ ', '');
if (anterior) desc = desc.replace('Next episode:', `Previous episode: ${anterior}\nNext episode:`);
const M = { titulo: m.titulo, desc, tags: [...new Set(m.etiquetas)].join(',') + ',', lista: (m.lista ?? '').startsWith('Greek') && m.lista.includes('Season 1') ? 'Season 1' : m.lista };
console.log(`const M=${JSON.stringify(M)};
const W=(ms)=>new Promise(x=>setTimeout(x,ms)); const d=document.querySelector('ytcp-uploads-dialog');
const put=(el,txt)=>{el.focus(); document.execCommand('selectAll'); document.execCommand('insertText',false,txt);};
const tb=d.querySelectorAll('#textbox'); put(tb[0],M.titulo); await W(300); put(tb[1],M.desc); await W(300);
d.querySelector('tp-yt-paper-radio-button[name=VIDEO_MADE_FOR_KIDS_NOT_MFK]')?.click();
d.querySelector('#toggle-button')?.click(); await W(1200);
d.querySelector('tp-yt-paper-radio-button[name=VIDEO_HAS_ALTERED_CONTENT_YES]')?.click();
d.querySelector('ytcp-video-metadata-playlists ytcp-dropdown-trigger').click(); await W(1500);
const c=[...document.querySelectorAll('ytcp-playlist-dialog *')].filter(e=>e.childElementCount===0 && e.textContent.includes(M.lista))[0]; const row=c?.closest('li, [role=listitem]')||c; (row?.querySelector('ytcp-checkbox-lit, [role=checkbox]')||row)?.click(); await W(500);
[...document.querySelectorAll('ytcp-playlist-dialog ytcp-button, ytcp-playlist-dialog button')].find(b=>/Done/.test(b.innerText))?.click(); await W(800);
d.querySelector('#language-input ytcp-dropdown-trigger, ytcp-form-language-input ytcp-dropdown-trigger')?.click(); await W(800);
[...document.querySelectorAll('tp-yt-paper-item')].find(e=>e.innerText.trim()==='English')?.click(); await W(600);
d.querySelector('#category ytcp-dropdown-trigger')?.click(); await W(800);
[...document.querySelectorAll('tp-yt-paper-item')].find(e=>e.innerText.trim()==='Education')?.click(); await W(600);
const ti=d.querySelector('ytcp-free-text-chip-bar input'); ti.focus(); document.execCommand('insertText',false,M.tags); ti.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,bubbles:true})); await W(800);
const r={tags:d.querySelector('ytcp-free-text-chip-bar').querySelectorAll('ytcp-chip').length, pl:d.querySelector('ytcp-video-metadata-playlists')?.innerText.replace(/\\s+/g,' ').slice(0,50), alt:d.querySelector('tp-yt-paper-radio-button[name=VIDEO_HAS_ALTERED_CONTENT_YES]')?.getAttribute('aria-checked')};
d.querySelectorAll('button[id^=step-badge]')[3]?.click(); await W(1500); d.querySelector('tp-yt-paper-radio-button[name=PUBLIC]')?.click(); await W(400);
JSON.stringify({...r, pub:d.querySelector('tp-yt-paper-radio-button[name=PUBLIC]')?.getAttribute('aria-checked')})`);
