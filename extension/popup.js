import {websiteOrigin, nativeRequest, syncRules} from './core.js';
const $ = id => document.getElementById(id);
let currentOrigin = '';
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
    try { await handler(); } catch (error) { status(error.message, true); }
    finally { el.disabled = false; }
  }); return el;
}
async function change(message) { await nativeRequest(message); await syncRules(); await render(); }
async function choose(payload) {
  status('Đang mở hộp chọn Windows…');
  // The worker owns the picker request so it survives popup focus loss.
  const result = await chrome.runtime.sendMessage({action: 'choose-rule', payload});
  if (!result?.ok) throw new Error(result?.error || 'Không nhận được kết quả. Mở lại tiện ích để kiểm tra.');
  status(result.cancelled ? 'Đã hủy chọn.' : 'Đã lưu quy tắc.');
  if (!result.cancelled) { await chrome.storage.local.remove('draft'); $('rule-form').reset(); tab('rules'); }
  await render();
}
async function render() {
  const {rules = [], events = []} = await chrome.storage.local.get(['rules','events']);
  $('count').textContent = String(rules.length); $('rule-list').replaceChildren();
  if (!rules.length) {
    const empty = node('div', 'Kết nối website với file đầu tiên của bạn.', 'empty');
    empty.append(document.createElement('br'), button('＋ Thêm quy tắc', () => tab('add'))); $('rule-list').append(empty);
  }
  for (const rule of [...rules].sort((a,b) => Number(b.origin === currentOrigin) - Number(a.origin === currentOrigin))) {
    const card = node('div', '', 'rule-card' + (rule.origin === currentOrigin ? ' current' : ''));
    const top = node('div', '', 'rule-top'); const toggle = document.createElement('input');
    toggle.type = 'checkbox'; toggle.checked = rule.enabled; toggle.setAttribute('aria-label', 'Bật quy tắc ' + rule.label);
    toggle.addEventListener('change', async () => {
      try { await change({action:'enable', id:rule.id, enabled:toggle.checked}); }
      catch (error) { toggle.checked = !toggle.checked; status(error.message,true); }
    }); top.append(node('strong', rule.label), toggle);
    const actions = node('div', '', 'rule-actions');
    actions.append(button('Mở thử', async () => {
      const response = await nativeRequest({action:'launch', id:rule.id, origin:rule.origin});
      status(response.status === 'already_running' ? 'Chương trình đang chạy.' : response.status === 'cooldown' ? 'Vừa mở gần đây; chờ 15 giây.' : 'Đã gửi yêu cầu mở.');
    }), button('Chọn lại', () => choose({id:rule.id, label:rule.label, origin:rule.origin, kind:rule.kind, preventDuplicate:rule.preventDuplicate})), button('Xóa', async () => {
      const confirm = button('Xác nhận xóa', async () => { await change({action:'remove',id:rule.id}); status('Đã xóa quy tắc. File trên máy được giữ nguyên.'); }, 'secondary danger');
      actions.replaceChildren(confirm, button('Hủy', render));
    }, 'secondary danger'));
    card.append(top, node('p',rule.origin,'origin'), node('p',rule.path,'file-path'), actions); $('rule-list').append(card);
  }
  $('event-list').replaceChildren();
  if (!events.length) $('event-list').append(node('div','Chưa có hoạt động tự mở.','empty'));
  for (const event of events) {
    const row = node('div','','event' + (event.ok ? '' : ' error'));
    row.append(node('strong',event.name), node('p',event.text), node('time',new Date(event.time).toLocaleString('vi-VN'))); $('event-list').append(row);
  }
}
async function connect() {
  try { await syncRules(); $('connection').textContent = '● Đã kết nối'; $('dot').classList.add('ready'); }
  catch (error) { $('connection').textContent = 'Chưa kết nối'; $('dot').classList.remove('ready'); status(error.message,true); }
  await render();
}
for (const name of ['rules','add','activity']) $('tab-' + name).addEventListener('click', () => { status(''); tab(name); });
$('refresh').addEventListener('click', () => { status(''); connect(); });
$('use-current').addEventListener('click', () => { if (currentOrigin) { $('website').value = currentOrigin; saveDraft(); } else status('Hãy mở một website HTTP/HTTPS trước.',true); });
async function saveDraft() { await chrome.storage.local.set({draft:{label:$('label').value,website:$('website').value,kind:$('kind').value,duplicate:$('duplicate').checked}}); }
$('rule-form').addEventListener('input', saveDraft);
$('website').addEventListener('input', () => {
  try { $('scope').textContent = 'Áp dụng cho ' + websiteOrigin($('website').value) + ' và mọi trang con.'; }
  catch { $('scope').textContent = 'Nhập URL đầy đủ bắt đầu bằng HTTP/HTTPS.'; }
});
$('rule-form').addEventListener('submit', async event => {
  event.preventDefault(); $('save').disabled = true;
  try { await saveDraft(); await choose({label:$('label').value.trim(), origin:websiteOrigin($('website').value),kind:$('kind').value,preventDuplicate:$('duplicate').checked}); }
  catch (error) { status(error.message,true); }
  finally { $('save').disabled = false; }
});
$('clear').addEventListener('click', async () => { await chrome.storage.local.set({events:[]}); await render(); });
chrome.storage.onChanged.addListener(render);
async function init() {
  const [active] = await chrome.tabs.query({active:true,currentWindow:true});
  try { currentOrigin = websiteOrigin(active?.url); $('site').textContent = currentOrigin; }
  catch { $('site').textContent = 'Chưa có website HTTP/HTTPS'; }
  const {draft,lastSelection} = await chrome.storage.local.get(['draft','lastSelection']);
  if (draft) { $('label').value=draft.label; $('website').value=draft.website; $('kind').value=draft.kind; $('duplicate').checked=draft.duplicate; }
  else if (currentOrigin) $('website').value=currentOrigin;
  if (lastSelection && Date.now()-lastSelection.time < 120000) status(lastSelection.text,!lastSelection.ok);
  await connect();
}
init().catch(error => status(error.message,true));
