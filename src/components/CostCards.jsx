import data from '../data/landscape.json'
import SourceTag from './SourceTag'

const overrun = data.facts.budgetOverrun
const rates = data.facts.consultantRates
const unmigrated = data.facts.unmigratedCustomers

function Card({ big, label, fact }) {
  return (
    <div className="rounded-lg border border-hairline bg-ink-card p-6 sm:p-8 flex flex-col animate-fade-rise">
      <div className="font-mono font-bold text-amber text-5xl sm:text-6xl tabular-nums leading-none mb-4">
        {big}
      </div>
      <p className="text-paper text-base leading-snug mb-auto">{label}</p>
      <SourceTag
        dense
        confidence={fact.confidence}
        surveyName={fact.surveyName}
        sources={fact.sources}
        lastVerified={data.meta.lastVerified}
      />
    </div>
  )
}

export default function CostCards() {
  return (
    <section className="bg-ink border-b border-hairline">
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="mb-2">
          <span className="text-xs font-mono tracking-[0.2em] text-paper-faint uppercase">Module 04</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-paper mb-1">What Waiting Costs</h2>
        <p className="text-paper-dim max-w-2xl mb-10 leading-relaxed">
          Delay isn't free. Three figures on what's already happening to companies still deciding.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          <Card
            big={`${overrun.value}%+`}
            label="of S/4HANA migration projects exceed their original budget or timeline."
            fact={overrun}
          />
          <Card
            big={`${rates.valueLow}–${rates.valueHigh}%`}
            label="projected rise in SAP migration consultant day-rates, 2026–2027 vs. 2024."
            fact={rates}
          />
          <Card
            big={unmigrated.value.toLocaleString()}
            label={`of ${unmigrated.total.toLocaleString()} SAP ECC customers have not yet migrated.`}
            fact={{ ...unmigrated, surveyName: unmigrated.sourceLabel }}
          />
        </div>
      </div>
    </section>
  )
}
