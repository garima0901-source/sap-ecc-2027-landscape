import data from '../data/landscape.json'
import SourceTag from './SourceTag'

const ri = data.facts.regionalIndustry

function intensity(low, high) {
  const mid = (low + high) / 2
  return Math.min(1, mid / 45)
}

function RegionBar({ region }) {
  const t = intensity(region.shareLow, region.shareHigh)
  return (
    <div className="group">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-paper">{region.name}</span>
        <span className="font-mono text-sm text-amber tabular-nums">
          {region.shareLow}–{region.shareHigh}%
        </span>
      </div>
      <div className="h-8 rounded-sm bg-ink-raised border border-hairline overflow-hidden relative">
        <div
          className="h-full rounded-sm transition-all duration-700 ease-out"
          style={{
            width: `${region.shareHigh}%`,
            background: `linear-gradient(90deg, rgba(245,166,35,${0.15 + t * 0.55}), rgba(245,166,35,${0.35 + t * 0.5}))`,
          }}
        />
      </div>
      <p className="mt-1.5 text-xs text-paper-faint leading-snug">{region.note}</p>
    </div>
  )
}

export default function HeatMap() {
  return (
    <section className="bg-ink border-b border-hairline">
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="mb-2">
          <span className="text-xs font-mono tracking-[0.2em] text-paper-faint uppercase">Module 02</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-paper mb-1">The Landscape</h2>
        <p className="text-sm font-mono uppercase tracking-[0.1em] text-amber mb-6">
          Directional industry analysis — not precise percentages
        </p>
        <p className="text-paper-dim max-w-2xl mb-10 leading-relaxed">
          Relative share of documented SAP S/4HANA adoption by region. These are ranges from a
          single industry analysis, not a census — treat width and glow as directional exposure,
          not exact figures.
        </p>

        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          {ri.regions.map((region) => (
            <RegionBar key={region.name} region={region} />
          ))}
        </div>

        <div className="rounded-lg border border-hairline bg-ink-card p-6">
          <h3 className="text-sm font-semibold text-paper mb-3 uppercase tracking-wide">
            Industry concentration
          </h3>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1.5 rounded-full bg-amber/10 border border-amber/30 text-amber text-sm font-medium">
              Manufacturing
            </span>
            <span className="px-3 py-1.5 rounded-full bg-amber/10 border border-amber/30 text-amber text-sm font-medium">
              Retail
            </span>
            <span className="text-paper-dim text-sm">
              together account for <span className="text-paper font-medium">well over half</span> of
              documented S/4HANA transformation case studies.
            </span>
          </div>
          <p className="text-xs text-paper-faint">
            The source does not disaggregate remaining industries (financial services, public
            sector, logistics, utilities, etc.) into comparable figures, so they are not charted
            here rather than estimated.
          </p>
        </div>

        <SourceTag
          confidence={ri.confidence}
          surveyName={ri.surveyName}
          sources={ri.sources}
          lastVerified={data.meta.lastVerified}
        />
      </div>
    </section>
  )
}
