import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockRecipes } from '../data/mockData';

function MetricBar({ label, value, max, unit, color, alertThreshold }) {
  const pct = Math.min(100, (value / max) * 100);
  const isAlert = alertThreshold && value > alertThreshold;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] text-slate-500 font-medium">{label}</span>
        <span className={`text-sm font-bold ${isAlert ? 'text-red-600' : 'text-slate-700'}`}>
          {value.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">{unit}</span>
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isAlert ? 'bg-red-500' : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function BatchCard({ batch, index }) {
  const recipe = mockRecipes.find(r => r.id === batch.recipeId) || mockRecipes[0];
  const hasAlert = batch.sensors.temperature > 160 || batch.sensors.moisture > 90;
  const ts = new Date(batch.timestamp);

  const metrics = [
    { label: 'Moisture', value: batch.sensors.moisture, max: 100, unit: '%', color: 'bg-blue-500', alertThreshold: 90 },
    { label: 'Temperature', value: batch.sensors.temperature, max: 280, unit: '°C', color: 'bg-orange-500', alertThreshold: 160 },
    { label: 'Airflow', value: batch.sensors.airflow, max: 5, unit: 'm/s', color: 'bg-teal-500', alertThreshold: null },
    { label: 'Vibration', value: batch.sensors.vibration, max: 30, unit: 'Hz', color: 'bg-purple-500', alertThreshold: null },
  ];

  return (
    <div
      className={`card-hover bg-white rounded-2xl shadow-sm border animate-fade-in-up overflow-hidden ${
        hasAlert ? 'border-red-300' : 'border-slate-100'
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Card Header */}
      <div className={`px-5 pt-5 pb-3 ${hasAlert ? 'bg-red-50' : 'bg-slate-50/60'}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{batch.recipeEmoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700">{batch.id}</span>
                {hasAlert && (
                  <span className="badge-pulse inline-flex items-center gap-1 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    ⚠ ALERT
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{batch.recipeName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400">Updated</p>
            <p className="text-[11px] font-semibold text-slate-600">
              {ts.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="px-5 py-4 space-y-3">
        {metrics.map(m => (
          <MetricBar key={m.label} {...m} />
        ))}
      </div>

      {/* Target comparison footer */}
      <div className="px-5 pb-4">
        <div className="bg-purple-50 rounded-xl p-3">
          <p className="text-[10px] font-semibold text-purple-500 uppercase tracking-wide mb-2">vs. Target ({recipe.name})</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { k: 'moisture', label: 'Moist', unit: '%' },
              { k: 'temperature', label: 'Temp', unit: '°C' },
              { k: 'airflow', label: 'Air', unit: 'm/s' },
              { k: 'vibration', label: 'Vib', unit: 'Hz' },
            ].map(({ k, label, unit }) => {
              const diff = batch.sensors[k] - recipe.target[k];
              const color = Math.abs(diff) < 5 ? 'text-green-600' : Math.abs(diff) < 15 ? 'text-yellow-600' : 'text-red-600';
              return (
                <div key={k}>
                  <p className="text-[9px] text-slate-400">{label}</p>
                  <p className={`text-[11px] font-bold ${color}`}>
                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}{unit}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sensors() {
  const { batches, simulating, setSimulating } = useApp();
  const [showConfig, setShowConfig] = useState(false);

  const alertCount = batches.filter(b => b.sensors.temperature > 160 || b.sensors.moisture > 90).length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-in-up">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Sensor Monitor</h2>
          <p className="text-slate-500 mt-1">Real-time IoT sensor data monitoring across all active batches</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
              {batches.length} Active Batches
            </span>
            {alertCount > 0 && (
              <span className="badge-pulse text-xs bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-full">
                ⚠ {alertCount} Alert{alertCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:border-purple-400 hover:text-purple-600 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Configure
          </button>
          <button
            onClick={() => setSimulating(s => !s)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all ${
              simulating
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-green-200'
            }`}
          >
            {simulating ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Stop Simulation
              </>
            ) : (
              <>▶ Simulate Data</>
            )}
          </button>
        </div>
      </div>

      {/* Config panel */}
      {showConfig && (
        <div className="mb-6 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-fade-in-up">
          <h4 className="font-bold text-slate-700 mb-3">Simulation Configuration</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-500 font-medium">Update Interval</label>
              <select className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-purple-400">
                <option>3 seconds</option>
                <option>5 seconds</option>
                <option>10 seconds</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium">Alert Threshold (Temp)</label>
              <input type="number" defaultValue={160} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-purple-400" />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium">Alert Threshold (Moisture)</label>
              <input type="number" defaultValue={90} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-purple-400" />
            </div>
          </div>
        </div>
      )}

      {/* Simulation banner */}
      {simulating && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-3 animate-fade-in-up">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-semibold text-green-700">Live simulation active — sensor readings update every 3 seconds</span>
        </div>
      )}

      {/* Batch Grid */}
      <div className="grid grid-cols-3 gap-5">
        {batches.map((batch, i) => (
          <BatchCard key={batch.id} batch={batch} index={i} />
        ))}
      </div>
    </div>
  );
}
