import { useEffect, useState } from 'react'
import { Task } from '../types'
import { fetchTasks, generateTasks, updateTask } from '../services/api'

const columns: { key: Task['status']; title: string }[] = [
  { key: 'backlog', title: 'Backlog' },
  { key: 'in_progress', title: 'In Progress' },
  { key: 'done', title: 'Done' }
]

export function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const data = await fetchTasks()
    setTasks(data)
  }

  useEffect(() => {
    load().catch(console.error)
  }, [])

  const handleGenerate = async () => {
    setLoading(true)
    try {
      await generateTasks()
      await load()
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (taskId: number, status: Task['status']) => {
    await updateTask(taskId, { status })
    await load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kanban</h1>
          <p className="text-slate-600">Aufgaben aus Maßnahmen.</p>
        </div>
        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
          Aufgaben generieren
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col.key} className="card p-3 space-y-3">
            <div className="font-semibold">{col.title}</div>
            {tasks
              .filter((t) => t.status === col.key)
              .map((task) => (
                <div key={task.id} className="border border-slate-200 rounded p-2 space-y-2 bg-white">
                  <div className="text-sm text-slate-500">{task.domain_id}</div>
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-xs uppercase text-slate-500">Priority: {task.priority}</div>
                  <select
                    className="w-full border rounded p-1 text-sm"
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                  >
                    {columns.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
