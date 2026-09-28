'use client'

import { OPEN_CONSENT_EVENT, readConsent, writeConsent } from '@/lib/consent'
import Link from 'next/link'
import Script from 'next/script'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

/** Supprime les cookies _ga* posés sur le domaine courant et ses parents. */
function clearAnalyticsCookies() {
  const hostParts = window.location.hostname.split('.')
  const domains = hostParts.map((_, i) => hostParts.slice(i).join('.'))
  document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((name) => name.startsWith('_ga'))
    .forEach((name) => {
      document.cookie = `${name}=; max-age=0; path=/`
      domains.forEach((d) => {
        document.cookie = `${name}=; max-age=0; path=/; domain=.${d}`
      })
    })
}

export default function CookieConsent({ gaId, locale, strings }) {
  const [consent, setConsent] = useState(/** @type {'granted' | 'denied' | null} */ (null))
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const stored = readConsent()
    setConsent(stored)
    setOpen(stored === null)

    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [])

  const choose = (/** @type {'granted' | 'denied'} */ value) => {
    writeConsent(value)
    window[`ga-disable-${gaId}`] = value === 'denied'
    if (value === 'denied' && consent === 'granted') clearAnalyticsCookies()
    setConsent(value)
    setOpen(false)
  }

  return (
    <>
      {consent === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window['ga-disable-${gaId}'] = false;
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}</Script>
        </>
      )}

      {open && (
        <div
          role="dialog"
          aria-live="polite"
          aria-labelledby="cookie-consent-title"
          className="dark:bg-dark-200 fixed inset-x-4 bottom-4 z-[9999] mx-auto max-w-[560px] rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:left-6 sm:mx-0 dark:border-[#313330]">
          <p id="cookie-consent-title" className="mb-2 font-semibold text-[#0A0A0A] dark:text-white">
            {strings.title}
          </p>
          <p className="text-paragraph mb-5 text-sm leading-relaxed">
            {strings.text}{' '}
            <Link href={`/${locale}/mentions-legales`} className="text-primary-500 underline underline-offset-2">
              {strings.learnMore}
            </Link>
          </p>
          <div className="flex flex-wrap gap-3 max-sm:flex-col">
            <button type="button" onClick={() => choose('denied')} className="btn-outline btn-sm flex-1">
              {strings.refuse}
            </button>
            <button type="button" onClick={() => choose('granted')} className="btn btn-sm flex-1">
              {strings.accept}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

CookieConsent.propTypes = {
  gaId: PropTypes.string.isRequired,
  locale: PropTypes.oneOf(['fr', 'en']).isRequired,
  strings: PropTypes.shape({
    title: PropTypes.string,
    text: PropTypes.string,
    learnMore: PropTypes.string,
    accept: PropTypes.string,
    refuse: PropTypes.string,
  }).isRequired,
}
