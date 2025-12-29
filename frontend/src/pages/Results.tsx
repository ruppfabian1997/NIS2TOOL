import { useEffect, useState } from 'react'
import { DomainScore } from '../types'
import { fetchDomainScores, fetchOverallScore } from '../services/api'

export function ResultsPage() {
  const [overall, setOverall] = useState(0)
  const [domains, setDomains] = useState<DomainScore[]>([])

  useEffect(() => {
    fetchOverallScore().then(setOverall).catch(console.error)
    fetchDomainScores().then(setDomains).catch(console.error)
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Ergebnisse</h1>
        <p className="text-slate-600">NIS-2-Ready Score und Domain-Scores.</p>
      </div>
      <div className="card p-4">
        <div className="text-sm text-slate-500">Overall Score</div>
        <div className="text-4xl font-bold text-primary">{overall.toFixed(1)}%</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {domains.map((d) => (
          <div key={d.domain_id} className="card p-4">
            <div className="text-sm text-slate-500">{d.domain_id}</div>
            <div className="text-2xl font-semibold">{d.score_percent.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
