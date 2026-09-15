const CONFIDENCE_STYLES = {
  high: { label: 'DIRECT REPORTING', className: 'text-teal border-teal/30 bg-teal/5' },
  reasonable: { label: 'SURVEY DATA', className: 'text-amber border-amber/30 bg-amber/5' },
  directional: { label: 'DIRECTIONAL ANALYSIS', className: 'text-paper-dim border-hairline bg-white/[0.02]' },
}

export default function SourceTag({ confidence, sources = [], surveyName, lastVerified, dense = false }) {
  const style = CONFIDENCE_STYLES[confidence] || CONFIDENCE_STYLES.directional

  return (
    <div className={dense ? 'mt-2' : 'mt-4'}>
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        <span
          className={`inline-block text-[10px] font-mono font-semibold tracking-[0.12em] uppercase px-1.5 py-0.5 rounded border ${style.className}`}
        >
          {style.label}
        </span>
        {lastVerified && (
          <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-paper-faint">
            Verified {lastVerified}
          </span>
        )}
      </div>
      {surveyName && (
        <p className="text-xs text-paper-dim mb-1 leading-snug">
          Source: <span className="text-paper-dim/90">{surveyName}</span>
        </p>
      )}
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {sources.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-paper-faint hover:text-amber underline decoration-dotted underline-offset-2 transition-colors"
          >
            {s.name} ↗
          </a>
        ))}
      </div>
    </div>
  )
}
