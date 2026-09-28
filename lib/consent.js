export const CONSENT_STORAGE_KEY = 'bp_cookie_consent'
export const OPEN_CONSENT_EVENT = 'bp:open-cookie-settings'

// Recommandation CNIL : redemander le choix au bout de 6 mois.
const CONSENT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182

/** @returns {'granted' | 'denied' | null} */
export function readConsent() {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const { value, at } = JSON.parse(raw)
    if ((value !== 'granted' && value !== 'denied') || Date.now() - at > CONSENT_MAX_AGE_MS) return null
    return value
  } catch {
    return null
  }
}

/** @param {'granted' | 'denied'} value */
export function writeConsent(value) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ value, at: Date.now() }))
  } catch {
    // Stockage indisponible (navigation privée…) : le choix vaut pour la session en cours.
  }
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))
}
