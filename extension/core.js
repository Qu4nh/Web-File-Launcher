import {codedError} from './i18n.js';
export const HOST = 'io.github.web_file_launcher';
export function websiteOrigin(value) {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password)
    throw codedError('invalidUrl');
  return url.origin;
}
export function matchingRules(rules, url) {
  try { const origin = websiteOrigin(url); return rules.filter(r => r.enabled && r.origin === origin); }
  catch { return []; }
}
export function nativeRequest(message) {
  return new Promise((resolve, reject) => chrome.runtime.sendNativeMessage(HOST, message, response => {
    const error = chrome.runtime.lastError;
    if (error) return reject(codedError('hostUnavailable',error.message));
    if (!response?.ok) return reject((response?.error ? codedError('requestFailed',response.error) : codedError('hostNoResponse')));
    resolve(response);
  }));
}
export async function syncRules() {
  const {rules, version} = await nativeRequest({action: 'list'});
  await chrome.storage.local.set({rules, hostVersion: version});
  return rules;
}
