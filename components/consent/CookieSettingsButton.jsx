'use client'

import { openConsentSettings } from '@/lib/consent'
import PropTypes from 'prop-types'

export default function CookieSettingsButton({ label }) {
  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className="text-paragraph hover:text-secondary cursor-pointer text-sm transition-colors duration-300">
      {label}
    </button>
  )
}

CookieSettingsButton.propTypes = {
  label: PropTypes.string.isRequired,
}
