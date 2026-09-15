import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import data from '../data/landscape.json'
import SourceTag from './SourceTag'

const survey = data.facts.adoptionSurvey
const intent = data.facts.migrationIntent2026

const estimated2024 = survey.value2025 - survey.pointsUp

const chartData = [
  { label: '2024', value: estimated2024, kind: 'estimated' },
  { label: 'Nov 2025', value: survey.value2025, kind: 'survey' },
]

function CustomDot(props) {
  const { cx, cy, payload } = props
  return (
    <circle cx={cx} cy={cy} r={5} fill="var(--color-amber)" stroke="var(--color-ink)" strokeWidth={2} />
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="bg-ink-card border border-hairline rounded-md px-3 py-2 shadow-xl">
      <p className="text-xs font-mono text-paper-faint uppercase tracking-wide">{p.label}</p>
      <p className="text-lg font-mono font-bold text-amber tabular-nums">{p.value}%</p>
      <p className="text-[11px] text-paper-dim max-w-[180px]">
        {p.kind === 'estimated'
          ? 'Estimated — derived from the 13pp increase reported for 2025, not directly sourced'
          : 'Directly sourced survey figure'}
      </p>
    </div>
  )
}

export default function AdoptionChart() {
  return (
    <section className="bg-ink-raised border-b border-hairline">
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="mb-2">
          <span className="text-xs font-mono tracking-[0.2em] text-paper-faint uppercase">Module 03</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-paper mb-1">
          The Clock Is Already Ticking
        </h2>
        <p className="text-paper-dim max-w-2xl mb-10 leading-relaxed">
          Companies fully or partially live on S/4HANA, from a rough 2024 estimate to the latest
          confirmed survey figure — plus a separate, unconnected data point on stated intent for
          2026, which measures a different question and should not be read as a running total.
        </p>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 h-72 sm:h-80 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid stroke="var(--color-hairline-soft)" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="var(--color-paper-faint)"
                  tick={{ fill: 'var(--color-paper-dim)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                  axisLine={{ stroke: 'var(--color-hairline)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  stroke="var(--color-paper-faint)"
                  tick={{ fill: 'var(--color-paper-dim)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-hairline)' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-amber)"
                  strokeWidth={2.5}
                  dot={<CustomDot />}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1 text-xs font-mono uppercase tracking-wide">
              <span className="flex items-center gap-1.5 text-paper-dim">
                <span className="w-2 h-2 rounded-full bg-amber inline-block" /> % fully/partially live on S/4HANA
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-hairline bg-ink-card p-6 h-full">
            <p className="text-xs font-mono uppercase tracking-[0.15em] text-paper-faint mb-3">
              Separate metric — stated intent
            </p>
            <div className="font-mono font-bold text-4xl text-paper tabular-nums mb-1">
              {intent.value}%
            </div>
            <p className="text-sm text-paper-dim leading-snug mb-3">{intent.value}% {intent.label}.</p>
            <p className="text-xs text-paper-faint leading-snug">
              This is a stated-intent figure, not a confirmed outcome — and not directly additive
              to the 59% "live" figure above, since it comes from a different survey question.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <SourceTag
            confidence={survey.confidence}
            surveyName={`${survey.surveyName} (${survey.date}); ${intent.surveyName}`}
            sources={[...survey.sources, ...intent.sources]}
            lastVerified={data.meta.lastVerified}
          />
        </div>
      </div>
    </section>
  )
}
