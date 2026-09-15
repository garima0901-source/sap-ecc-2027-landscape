import { useMemo, useState } from 'react'

const QUESTIONS = [
  {
    key: 'age',
    prompt: 'How current is your ECC environment?',
    options: [
      { label: 'Recently upgraded — on EhP7 or EhP8', score: 0 },
      { label: 'Mid-life — EhP5 or EhP6, moderately maintained', score: 1 },
      { label: "Old and heavily patched — not sure what enhancement package we're on", score: 2 },
    ],
  },
  {
    key: 'custom',
    prompt: 'How much custom code sits on top of standard SAP?',
    options: [
      { label: 'Minimal — mostly vanilla SAP', score: 0 },
      { label: 'Moderate — some custom modules and Z-programs', score: 1 },
      { label: 'Extensive — deeply customized, many years of Z-code', score: 2 },
    ],
  },
  {
    key: 'planning',
    prompt: 'Where does migration planning stand today?',
    options: [
      { label: 'In progress or already completed', score: 0 },
      { label: 'Assessment started, no roadmap or budget yet', score: 1 },
      { label: 'Not started', score: 2 },
    ],
  },
]

const BANDS = [
  {
    max: 1,
    tone: 'text-teal',
    ring: 'border-teal/30 bg-teal/5',
    title: 'Lower exposure',
    body: "You're ahead of most of the market on the factors that predict a rough migration. The 2027 deadline is still fixed — worth keeping the roadmap current rather than shelving it.",
  },
  {
    max: 3,
    tone: 'text-amber',
    ring: 'border-amber/30 bg-amber/5',
    title: 'Moderate exposure',
    body: "You have real work ahead, but time to do it deliberately. Companies in this band typically benefit most from a serious code and landscape assessment in the next planning cycle — before consultant rates climb further.",
  },
  {
    max: 6,
    tone: 'text-red',
    ring: 'border-red/30 bg-red/5',
    title: 'High exposure',
    body: 'An old, heavily customized system with no migration plan is exactly the profile behind the budget and timeline overruns industry data keeps flagging. This is worth executive attention now, not after the next budget cycle.',
  },
]

export default function SelfCheck() {
  const [answers, setAnswers] = useState({})

  const answeredCount = Object.keys(answers).length
  const total = QUESTIONS.length
  const done = answeredCount === total

  const score = useMemo(
    () => Object.values(answers).reduce((sum, s) => sum + s, 0),
    [answers]
  )

  const band = useMemo(() => BANDS.find((b) => score <= b.max) || BANDS[BANDS.length - 1], [score])

  return (
    <section className="bg-ink-raised">
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="mb-2">
          <span className="text-xs font-mono tracking-[0.2em] text-paper-faint uppercase">Module 05</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-paper mb-1">Quick Self-Check</h2>
        <p className="text-paper-dim max-w-2xl mb-10 leading-relaxed">
          Three questions, a plain-language read-out. No email, no sales call — just a rough sense
          of where you sit.
        </p>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            {QUESTIONS.map((q, qi) => (
              <div key={q.key}>
                <p className="text-sm font-mono text-paper-faint mb-3">
                  {String(qi + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </p>
                <p className="text-paper font-medium mb-3">{q.prompt}</p>
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const selected = answers[q.key] === opt.score
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setAnswers((a) => ({ ...a, [q.key]: opt.score }))}
                        className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-colors cursor-pointer ${
                          selected
                            ? 'border-amber bg-amber/10 text-paper'
                            : 'border-hairline bg-ink-card text-paper-dim hover:border-paper-faint hover:text-paper'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            {!done ? (
              <div className="rounded-lg border border-dashed border-hairline bg-ink-card p-8 text-center">
                <p className="text-paper-dim">
                  Answer all three questions ({answeredCount}/{total} so far) to see your read-out.
                </p>
              </div>
            ) : (
              <div className={`rounded-lg border p-8 animate-fade-rise ${band.ring}`}>
                <p className="text-xs font-mono uppercase tracking-[0.15em] text-paper-faint mb-2">
                  Your read-out
                </p>
                <h3 className={`text-2xl font-semibold mb-3 ${band.tone}`}>{band.title}</h3>
                <p className="text-paper-dim leading-relaxed mb-4">{band.body}</p>
                <p className="text-xs text-paper-faint leading-snug">
                  This is a rough, self-scored heuristic for general orientation — not a formal
                  risk assessment, and not tied to any product or vendor.
                </p>
                <button
                  type="button"
                  onClick={() => setAnswers({})}
                  className="mt-5 text-xs font-mono uppercase tracking-wide text-paper-faint hover:text-amber transition-colors cursor-pointer"
                >
                  Reset ↺
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
