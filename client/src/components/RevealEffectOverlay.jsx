import { useEffect, useRef } from 'react'
import party from 'party-js'

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function fireRandomEffect() {
  const anchor = document.body   // ← THIS is the big change
  const isConfetti = Math.random() < 0.5

  const config = {
    count: 120,    // rich but safe
    spread: 180,   // full-circle
    size: 1.4,
    speed: 65,     // slow = long fall
  }

  const fire = () => {
    if (isConfetti) {
      party.confetti(anchor, config)
    } else {
      party.sparkles(anchor, config)
    }
  }

  // layered shower
  fire()
  setTimeout(fire, 400)
  setTimeout(fire, 800)
}



function RevealEffectOverlay({ triggerKey, anchorRef, disabled = false }) {
  const lastFiredKeyRef = useRef(null)

  useEffect(() => {
    if (disabled) return
    if (prefersReducedMotion()) return
    if (!triggerKey) return

    // Prevent double-fire in React 18 StrictMode (dev)
    if (lastFiredKeyRef.current === triggerKey) return

    let rafId = null
    let attempts = 0
    let cancelled = false

    const tryFire = () => {
      if (cancelled) return
      const anchor = anchorRef?.current
      if (anchor) {
        lastFiredKeyRef.current = triggerKey
        fireRandomEffect(anchor, triggerKey)
        return
      }
      attempts += 1
      if (attempts < 8) rafId = requestAnimationFrame(tryFire)
    }

    rafId = requestAnimationFrame(tryFire)

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [triggerKey, disabled])

  return null
}

export default RevealEffectOverlay
