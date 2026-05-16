import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ReferenceLine,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { mockRecipes, computeQualityScore, getCorrectiveActions } from '../data/mockData';

// ── Custom Tooltip ────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-semibold text-slate-700">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ── Corrective Action Card ────────────────────────────────────────
function ActionCard({ action, index }) {
  const severityStyle = {
    high:   { bg: 'bg-red-50',    border: 'border-red-200',   badge: 'bg-red-500',   text: 'HIGH' },
    medium: { bg: 'bg-orange-50', border: 'border-orange-200',badge: 'bg-orange-500',text: 'MED' },
    low:    { bg: 'bg-blue-50',   border: 'border-blue-200',  badge: 'bg-blue-500',  text: 'LOW' },
    ok:     { bg: 'bg-green-50',  border: 'border-green-200', badge: 'bg-green-500', text: 'OK' },
  }[action.severity] || {};

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border ${severityStyle.bg} ${severityStyle.border} animate-fade-in-up`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className="text-xl">{action.icon}</span>
      <p className="text-sm text-slate-700 flex-1 font-medium">{action.text}</p>
      <span className={`${severityStyle.badge} text-white text-[9px] font-bold px-2 py-0.5 rounded-full`}>
        {severityStyle.text}
      </span>
    </div>
  );
}

// ── Batch Prediction Card ─────────────────────────────────────────
function PredictionCard({ batch, recipe, index }) {
  const score = computeQualityScore(batch.sensors, recipe.target);
  const pass = score >= 70;
  const actions = getCorrectiveActions(batch.sensors, recipe.target);
  const [open, setOpen] = useState(false);

  const radarData = [
    { metric: 'Moisture',    actual: Math.round(batch.sensors.moisture),    target: recipe.target.moisture    },
    { metric: 'Temperature', actual: Math.round(batch.sensors.temperature), target: recipe.target.temperature },
    { metric: 'Airflow',     actual: Math.round(batch.sensors.airflow * 10),target: Math.round(recipe.target.airflow * 10) },
    { metric: 'Vibration',   actual: Math.round(batch.sensors.vibration),   target: recipe.target.vibration   },
  ];

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border animate-fade-in-up overflow-hidden ${
        pass ? 'border-green-200' : 'border-red-200'
      }`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Header */}
      <div className={`px-5 py-4 flex items-center justify-between ${pass ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{batch.recipeEmoji}</span>
          <div>
            <p className="text-xs font-bold text-slate-600">{batch.id}</p>
            <p className="text-[10px] text-slate-400 truncate max-w-[160px]">{batch.recipeName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className={`text-2xl font-black ${pass ? 'text-green-600' : 'text-red-600'}`}>{score}</p>
            <p className="text-[9px] text-slate-400">Quality Score</p>
          </div>
          <div className={`flex flex-col items-center justify-center w-16 h-8 rounded-full font-bold text-xs text-white ${
            pass ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {pass ? '✓ PASS' : '✗ FAIL'}
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>Quality Score</span><span>{score}/100</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Model tags */}
      <div className="px-5 py-2 flex gap-2">
        <span className="text-[10px] bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">🌲 Random Forest</span>
        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">📊 Logistic Regression</span>
      </div>

      {/* Actions */}
      <div className="px-5 pb-4 space-y-2">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Corrective Actions</p>
        {actions.slice(0, 2).map((a, i) => (
          <ActionCard key={i} action={a} index={i} />
        ))}
        {actions.length > 2 && (
          <button
            onClick={() => setOpen(o => !o)}
            className="text-xs text-purple-600 font-medium hover:underline"
          >
            {open ? '▲ Show less' : `▼ +${actions.length - 2} more actions`}
          </button>
        )}
        {open && actions.slice(2).map((a, i) => (
          <ActionCard key={i + 2} action={a} index={i + 2} />
        ))}
      </div>
    </div>
  );
}

// ── Main Analysis Page ────────────────────────────────────────────
export default function Analysis() {
  const { batches, historicalData } = useApp();
  const [chartTab, setChartTab] = useState('quality');

  const batchesWithRecipe = useMemo(() =>
    batches.map(b => ({
      ...b,
      recipe: mockRecipes.find(r => r.id === b.recipeId) || mockRecipes[0],
    }))
  , [batches]);

  const avgScore = useMemo(() => {
    const total = batchesWithRecipe.reduce(
      (s, { sensors, recipe }) => s + computeQualityScore(sensors, recipe.target), 0
    );
    return Math.round(total / batchesWithRecipe.length);
  }, [batchesWithRecipe]);

  const passCount = useMemo(() =>
    batchesWithRecipe.filter(({ sensors, recipe }) => computeQualityScore(sensors, recipe.target) >= 70).length
  , [batchesWithRecipe]);

  const chartTabs = [
    { key: 'quality',     label: '📈 Quality Trend' },
    { key: 'sensors',     label: '🌡️ Sensor Readings' },
    { key: 'comparison',  label: '📊 Batch Comparison' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-slate-800">AI Quality Analysis</h2>
        <p className="text-slate-500 mt-1">
          Machine learning predictions using Random Forest + Logistic Regression models
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Average Quality Score', value: `${avgScore}%`, icon: '⭐', color: 'from-purple-500 to-purple-700', sub: 'across all batches' },
          { label: 'Batches Passing', value: `${passCount}/${batches.length}`, icon: '✅', color: 'from-green-500 to-emerald-600', sub: 'score ≥ 70' },
          { label: 'Batches Failing', value: `${batches.length - passCount}/${batches.length}`, icon: '❌', color: 'from-red-400 to-red-600', sub: 'score < 70' },
          { label: 'AI Model Accuracy', value: '94.2%', icon: '🤖', color: 'from-indigo-500 to-indigo-700', sub: 'RF + LR ensemble' },
        ].map((k, i) => (
          <div
            key={k.label}
            className={`rounded-2xl p-5 bg-gradient-to-br ${k.color} text-white shadow-lg animate-fade-in-up`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="text-3xl mb-2">{k.icon}</div>
            <p className="text-3xl font-black leading-none mb-1">{k.value}</p>
            <p className="text-sm font-medium opacity-90">{k.label}</p>
            <p className="text-[10px] opacity-70 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800">Historical Analysis</h3>
          <div className="flex gap-2">
            {chartTabs.map(t => (
              <button
                key={t.key}
                onClick={() => setChartTab(t.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  chartTab === t.key
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 320 }}>
          {chartTab === 'quality' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Pass Threshold', position: 'insideTopRight', fontSize: 10, fill: '#f59e0b' }} />
                <Line type="monotone" dataKey="quality" name="Quality Score" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {chartTab === 'sensors' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="moisture"    name="Moisture (%)"     stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="airflow"     name="Airflow (m/s)"    stroke="#14b8a6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {chartTab === 'comparison' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData.slice(0, 10)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={70} stroke="#7c3aed" strokeDasharray="4 4" />
                <Bar dataKey="quality" name="Quality Score" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Batch Predictions Grid */}
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800">Batch Predictions & Recommendations</h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {batchesWithRecipe.map(({ id, recipeEmoji, recipeName, recipeId, sensors, recipe, timestamp }, i) => (
            <PredictionCard
              key={id}
              batch={{ id, recipeEmoji, recipeName, recipeId, sensors, timestamp }}
              recipe={recipe}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
