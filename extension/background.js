import {matchingRules, nativeRequest, syncRules} from './core.js';
let queue = Promise.resolve();
async function log(rule, ok, record) {
  const {events = []} = await chrome.storage.local.get('events');
  await chrome.storage.local.set({events: [{time: Date.now(), name: rule.label, ok, ...record}, ...events].slice(0, 30)});
  await chrome.action.setBadgeText({text: ok ? '' : '!'});
  await chrome.action.setBadgeBackgroundColor({color: '#b42318'});
}
async function navigate(details) {
  if (details.frameId !== 0 || details.tabId < 0 || details.documentLifecycle === 'prerender') return;
  const {rules = []} = await chrome.storage.local.get('rules');
  for (const rule of matchingRules(rules, details.url)) {
    try {
      const reply = await nativeRequest({action: 'launch', id: rule.id, origin: rule.origin});
      await log(rule, true, {code:reply.status === 'already_running' ? 'eventRunning' : reply.status === 'cooldown' ? 'eventCooldown' : 'eventOpened'});
    } catch (error) { await log(rule, false, {text:error.message,errorCode:error.code,detail:error.detail}); }
  }
}
function enqueue(details) {
  queue = queue.then(() => navigate(details)).catch(console.error);
}
const filter = {url: [{schemes: ['https', 'http']}]};
chrome.webNavigation.onCommitted.addListener(enqueue, filter);
chrome.webNavigation.onHistoryStateUpdated.addListener(enqueue, filter);
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id || sender.url !== chrome.runtime.getURL('popup.html') || message?.action !== 'choose-rule') return;
  const input = message.payload || {};
  const payload = {action:'choose', label:input.label, origin:input.origin,kind:input.kind,preventDuplicate:input.preventDuplicate};
  if (input.id) payload.id=input.id;
  (async () => {
    try {
      const {language} = await chrome.storage.local.get('language');
      payload.language = language === 'vi' ? 'vi' : 'en';
      const response = await nativeRequest(payload);
      await syncRules();
      await chrome.storage.local.set({lastSelection:{time:Date.now(),ok:true,code:response.cancelled ? 'selectionCancelled' : 'selectionSaved'}});
      if (!response.cancelled) await chrome.storage.local.remove('draft');
      sendResponse({ok:true,cancelled:Boolean(response.cancelled)});
    } catch (error) {
      await chrome.storage.local.set({lastSelection:{time:Date.now(),ok:false,text:error.message,errorCode:error.code,detail:error.detail}});
      sendResponse({ok:false,error:error.message,errorCode:error.code,detail:error.detail});
    }
  })();
  return true;
});
