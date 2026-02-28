'use client'

import { useEffect } from 'react'
import { APP_VERSION } from '@/lib/version'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Including APP_VERSION in the URL forces the browser to treat each
      // deploy as a new SW, which triggers install → activate → cache rotation.
      navigator.serviceWorker.register(`/sw.js?v=${APP_VERSION}`).catch(() => {
        // SW registration failed — app still works, just without offline support
      })
    }
  }, [])

  return null
}
