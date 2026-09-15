import { useEffect, useState } from 'react'
import data from '../data/landscape.json'

const DEADLINE = new Date(data.meta.deadline)

function getTimeParts() {
  const now = new Date()
  const diff = Math.max(0, DEADLINE.getTime() - now.getTime())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="font-mono font-bold tabular-nums text-[13vw] leading-none sm:text-6xl md:text-7xl lg:text-8xl text-paper tracking-tight">
        {String(value).padStart(label === 'DAYS' ? 1 : 2, '0')}
      </div>
      <div className="mt-2 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-amber font-medium">
        {label}
      </div>
    </div>
  )
}

export default function Hero() {
  const [t, setT] = useState(getTimeParts)

  useEffect(() => {
    const id = setInterval(() => setT(getTimeParts()), 1000)
    return () => clearInterval(id)
  }, [])

  const fact = data.facts.eccDeadline
  const unmigrated = data.facts.unmigratedCustomers

  return (
    <section className="relative bg-ink bg-grid border-b border-hairline overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-ink" />
      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-14 sm:pt-24 sm:pb-20">
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-rise">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber" />
          </span>
          <span className="text-xs font-mono tracking-[0.2em] text-paper-dim uppercase">
            SAP ECC End-of-Support Countdown
          </span>
        </div>

        <div
          className="flex justify-center gap-4 sm:gap-10 animate-fade-rise"
          style={{ animationDelay: '80ms' }}
        >
          <Unit value={t.days} label="DAYS" />
          <Unit value={t.hours} label="HRS" />
          <Unit value={t.minutes} label="MIN" />
          <Unit value={t.seconds} label="SEC" />
        </div>

        <p
          className="mt-10 text-center text-lg sm:text-2xl text-paper max-w-2xl mx-auto leading-snug animate-fade-rise"
          style={{ animationDelay: '160ms' }}
        >
          That's when SAP ends mainstream support for the system{' '}
          <span className="text-amber font-semibold">
            {unmigrated.value.toLocaleString()}+ companies
          </span>{' '}
          still run on.
        </p>

        <div className="mt-6 flex justify-center animate-fade-rise" style={{ animationDelay: '220ms' }}>
          <div className="text-center max-w-xl">
            <p className="text-xs font-mono text-paper-faint uppercase tracking-[0.1em]">
              {fact.value} &middot; {unmigrated.value.toLocaleString()} of {unmigrated.total.toLocaleString()} ECC customers not yet migrated — Gartner, via Sifted &amp; TechFundingNews
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
