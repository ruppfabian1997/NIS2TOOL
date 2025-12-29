import { DomainScore } from '../types'
import clsx from 'clsx'

interface Props {
  title: string
  score?: DomainScore
}

function statusLabel(score?: number) {
  if (score === undefined) return 'Not started'
  if (score === 0) return 'Not started'
  if (score && score >= 99) return 'Completed'
  return 'In progress'
}

export function DomainTile({ title, score }: Props) {
  const pct = score?.score_percent ?? 0
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="text-sm text-slate-500">Domain</div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-3xl font-bold text-primary">{pct.toFixed(0)}%</div>
      <div className={clsx('text-xs uppercase font-semibold tracking-wide', pct === 0 ? 'text-slate-500' : 'text-emerald-700')}>
        {statusLabel(pct)}
      </div>
    </div>
  )
}
