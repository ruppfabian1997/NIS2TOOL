import { useEffect, useMemo, useState } from 'react'
import { Domain } from '../types'
import { fetchDomains, saveAnswer } from '../services/api'

const scaleValues = [0, 1, 2, 3, 4]

export function AssessmentPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const currentDomain = useMemo(() => domains[currentIndex], [domains, currentIndex])

  useEffect(() => {
    fetchDomains().then((data) => {
      setDomains(data)
      if (data.length > 0) setCurrentIndex(0)
    })
  }, [])

  const handleChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    if (!currentDomain) return
    setSaving(true)
    try {
      await Promise.all(
        currentDomain.questions.map((q) => saveAnswer(currentDomain.id, q.id, answers[q.id] ?? 0))
      )
      if (currentIndex < domains.length - 1) {
        setCurrentIndex((idx) => idx + 1)
      }
    } finally {
      setSaving(false)
    }
  }

  if (!currentDomain) {
    return <div>Keine Domains geladen.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Assessment</div>
          <h1 className="text-2xl font-bold">{currentDomain.title}</h1>
        </div>
        <div className="text-sm text-slate-600">
          Schritt {currentIndex + 1} / {domains.length}
        </div>
      </div>

      <div className="space-y-4">
        {currentDomain.questions.map((q) => (
          <div key={q.id} className="card p-4 space-y-2">
            <div className="font-semibold">{q.text}</div>
            {q.type === 'boolean' ? (
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={q.id}
                    value="1"
                    checked={(answers[q.id] ?? 0) === 4}
                    onChange={() => handleChange(q.id, 4)}
                  />
                  Ja
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={q.id}
                    value="0"
                    checked={(answers[q.id] ?? 0) === 0}
                    onChange={() => handleChange(q.id, 0)}
                  />
                  Nein
                </label>
              </div>
            ) : (
              <div className="flex gap-3 flex-wrap items-center">
                {scaleValues.map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={q.id}
                      value={v}
                      checked={(answers[q.id] ?? 0) === v}
                      onChange={() => handleChange(q.id, v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <button
          className="btn"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
        >
          Zurück
        </button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {currentIndex === domains.length - 1 ? 'Fertigstellen' : 'Weiter'}
        </button>
      </div>
    </div>
  )
}
