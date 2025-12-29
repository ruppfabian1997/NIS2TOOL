import { useEffect, useState } from 'react'
import { Domain, DomainScore } from '../types'
import { fetchDomains, fetchDomainScores } from '../services/api'
import { DomainTile } from '../components/DomainTile'

export function DashboardPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [scores, setScores] = useState<DomainScore[]>([])

  useEffect(() => {
    fetchDomains().then(setDomains).catch(console.error)
    fetchDomainScores()
      .then(setScores)
      .catch((err) => {
        console.error(err)
        setScores([])
      })
  }, [])

  const scoreMap = new Map(scores.map((s) => [s.domain_id, s]))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">NIS-2 Dashboard</h1>
        <p className="text-slate-600">Übersicht über alle Domains mit Reifegrad.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((domain) => (
          <DomainTile key={domain.id} title={domain.title} score={scoreMap.get(domain.id)} />
        ))}
      </div>
    </div>
  )
}
