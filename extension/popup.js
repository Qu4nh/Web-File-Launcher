import {t, loadLanguage, setLanguage, getLanguage, errorText, storedText, codedError} from './i18n.js';
import {websiteOrigin, nativeRequest, syncRules} from './core.js';
const $ = id => document.getElementById(id);
let currentOrigin = '';
let connected = false;
function status(text, error = false) { $('status').textContent = text; $('status').hidden = !text; $('status').classList.toggle('error', error); }
function tab(name) {
  for (const key of ['rules', 'add', 'activity']) {
    $(key).hidden = key !== name; $('tab-' + key).classList.toggle('active', key === name);
    $('tab-' + key).setAttribute('aria-pressed', String(key === name));
  }
}
function node(tag, text, className) { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; return el; }
function button(text, handler, className = 'secondary') {
  const el = node('button', text, className); el.type = 'button';
  el.addEventListener('click', async () => {
    el.disabled = true;
    try { await handler(); } catch (error) { status(errorText(error), true); }
    finally { el.disabled = false; }
  }); return el;
}
async function change(message) { await nativeRequest(message); await syncRules(); await render(); }
async function choose(payload) {
  status(t('pickerOpening'));
  // The worker owns the picker request so it survives popup focus loss.
  const result = await chrome.runtime.sendMessage({action: 'choose-rule', payload});
  if (!result?.ok) throw (result?.errorCode ? codedError(result.errorCode, result.detail) : new Error(result?.error || t('noResult')));
  status(t(result.cancelled ? 'selectionCancelled' : 'selectionSaved'));
  if (!result.cancelled) { await chrome.storage.local.remove('draft'); $('rule-form').reset(); tab('rules'); }
  await render();
}
async function render() {
  const {rules = [], events = []} = await chrome.storage.local.get(['rules','events']);
  $('count').textContent = String(rules.length); $('rule-list').replaceChildren();
  if (!rules.length) {
    const empty = node('div', t('emptyRules'), 'empty');
    empty.append(document.createElement('br'), button(t('addButton'), () => tab('add'))); $('rule-list').append(empty);
  }
  for (const rule of [...rules].sort((a,b) => Number(b.origin === currentOrigin) - Number(a.origin === currentOrigin))) {
    const card = node('div', '', 'rule-card' + (rule.origin === currentOrigin ? ' current' : ''));
    const top = node('div', '', 'rule-top'); const toggle = document.createElement('input');
    toggle.type = 'checkbox'; toggle.checked = rule.enabled; toggle.setAttribute('aria-label', t('enableRule',{name:rule.label}));
    toggle.addEventListener('change', async () => {
      try { await change({action:'enable', id:rule.id, enabled:toggle.checked}); }
      catch (error) { toggle.checked = !toggle.checked; status(errorText(error),true); }
    }); top.append(node('strong', rule.label), toggle);
    const actions = node('div', '', 'rule-actions');
    actions.append(button(t('test'), async () => {
      const response = await nativeRequest({action:'launch', id:rule.id, origin:rule.origin});
      status(t(response.status === 'already_running' ? 'alreadyRunning' : response.status === 'cooldown' ? 'cooldown' : 'opened'));
    }), button(t('reselect'), () => choose({id:rule.id, label:rule.label, origin:rule.origin, kind:rule.kind, preventDuplicate:rule.preventDuplicate})), button(t('remove'), async () => {
      const confirm = button(t('confirmDelete'), async () => { await change({action:'remove',id:rule.id}); status(t('removed')); }, 'secondary danger');
      actions.replaceChildren(confirm, button(t('cancel'), render));
    }, 'secondary danger'));
    card.append(top, node('p',rule.origin,'origin'), node('p',rule.path,'file-path'), actions); $('rule-list').append(card);
  }
  $('event-list').replaceChildren();
  if (!events.length) $('event-list').append(node('div',t('emptyActivity'),'empty'));
  for (const event of events) {
    const row = node('div','','event' + (event.ok ? '' : ' error'));
    row.append(node('strong',event.name), node('p',storedText(event)), node('time',new Date(event.time).toLocaleString(getLanguage() === 'vi' ? 'vi-VN' : 'en-US'))); $('event-list').append(row);
  }
}
async function connect() {
  try { await syncRules(); connected = true; $('connection').textContent = t('connected'); $('dot').classList.add('ready'); }
  catch (error) { connected = false; $('connection').textContent = t('disconnected'); $('dot').classList.remove('ready'); status(errorText(error),true); }
  await render();
}
for (const name of ['rules','add','activity']) $('tab-' + name).addEventListener('click', () => { status(''); tab(name); });
$('refresh').addEventListener('click', () => { status(''); connect(); });
$('use-current').addEventListener('click', () => { if (currentOrigin) { $('website').value = currentOrigin; saveDraft(); } else status(t('openWebsite'),true); });
async function saveDraft() { await chrome.storage.local.set({draft:{label:$('label').value,website:$('website').value,kind:$('kind').value,duplicate:$('duplicate').checked}}); }
$('rule-form').addEventListener('input', saveDraft);
$('website').addEventListener('input', () => {
  try { $('scope').textContent = t('scopeOrigin',{origin:websiteOrigin($('website').value)}); }
  catch { $('scope').textContent = t('validUrl'); }
});
$('rule-form').addEventListener('submit', async event => {
  event.preventDefault(); $('save').disabled = true;
  try { await saveDraft(); await choose({label:$('label').value.trim(), origin:websiteOrigin($('website').value),kind:$('kind').value,preventDuplicate:$('duplicate').checked}); }
  catch (error) { status(errorText(error),true); }
  finally { $('save').disabled = false; }
});
$('clear').addEventListener('click', async () => { await chrome.storage.local.set({events:[]}); await render(); });
chrome.storage.onChanged.addListener(render);
async function init() {
  await loadLanguage(); applyLanguage();
  const [active] = await chrome.tabs.query({active:true,currentWindow:true});
  try { currentOrigin = websiteOrigin(active?.url); $('site').textContent = currentOrigin; }
  catch { $('site').textContent = t('noWebsite'); }
  const {draft,lastSelection} = await chrome.storage.local.get(['draft','lastSelection']);
  if (draft) { $('label').value=draft.label; $('website').value=draft.website; $('kind').value=draft.kind; $('duplicate').checked=draft.duplicate; }
  else if (currentOrigin) $('website').value=currentOrigin;
  if (lastSelection && Date.now()-lastSelection.time < 120000) status(storedText(lastSelection),!lastSelection.ok);
  await connect();
}
function applyLanguage() {
  document.documentElement.lang = getLanguage();
  $('language').value = getLanguage();
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent=t(el.dataset.i18n);
  for (const [attr,key] of [['title','i18nTitle'],['aria-label','i18nAria'],['placeholder','i18nPlaceholder']])
    for (const el of document.querySelectorAll('[data-'+key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())+']')) el.setAttribute(attr,t(el.dataset[key]));
  $('connection').textContent=t(connected ? 'connected' : 'disconnected');
  $('site').textContent=currentOrigin || t('noWebsite');
  try { $('scope').textContent=t('scopeOrigin',{origin:websiteOrigin($('website').value)}); } catch { $('scope').textContent=t('scope'); }
}
$('language').addEventListener('change', async () => {
  setLanguage($('language').value);
  await chrome.storage.local.set({language:getLanguage()});
  status(''); applyLanguage(); await render();
});
init().catch(error => status(errorText(error),true));
