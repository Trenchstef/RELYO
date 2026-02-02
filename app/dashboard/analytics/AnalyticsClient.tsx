'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type ChartPoint = {
  date: string
  count: number
}

type Keyword = {
  word: string
  count: number
}

type AnalyticsClientProps = {
  chartData: ChartPoint[]
  keywords: Keyword[]
}

export default function AnalyticsClient({ chartData, keywords }: AnalyticsClientProps) {
  const maxKeyword = keywords[0]?.count ?? 1

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-700">
          Évolution des avis reçus
        </h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-700">Nuage de mots-clés</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {keywords.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aucun mot-clé disponible pour le moment.
            </p>
          ) : (
            keywords.map((keyword) => {
              const size = 12 + Math.round((keyword.count / maxKeyword) * 16)
              return (
                <span
                  key={keyword.word}
                  style={{ fontSize: `${size}px` }}
                  className="rounded-full bg-slate-100 px-3 py-1 text-slate-700"
                >
                  {keyword.word}
                </span>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
