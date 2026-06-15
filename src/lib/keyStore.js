const KEY = 'veritas_apikey'
const ONBOARDED = 'veritas_onboarded'

export const keyStore = {
  get: () => localStorage.getItem(KEY) || '',
  set: (k) => { localStorage.setItem(KEY, k.trim()); localStorage.setItem(ONBOARDED, '1') },
  clear: () => { localStorage.removeItem(KEY); localStorage.removeItem(ONBOARDED) },
  has: () => Boolean(localStorage.getItem(KEY)),
  isOnboarded: () => Boolean(localStorage.getItem(ONBOARDED)),
}
