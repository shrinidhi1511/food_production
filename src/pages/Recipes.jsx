import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Bread', 'Pastry', 'Savory'];

function ParamBar({ label, value, max, unit, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between mb-0.5">
        <span className="text-[10px] text-slate-400">{label}</span>
        <span className="text-[10px] font-semibold text-slate-600">{value}{unit}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RecipeCard({ recipe, isSelected, onClick, currentBatch }) {
  const [expanded, setExpanded] = useState(false);

  const paramDefs = [
    { k: 'moisture',    label: 'Moisture',     max: 100, unit: '%',   color: 'bg-blue-400' },
    { k: 'temperature', label: 'Temperature',  max: 300, unit: '°C',  color: 'bg-orange-400' },
    { k: 'airflow',     label: 'Airflow',      max: 5,   unit: ' m/s',color: 'bg-teal-400' },
    { k: 'vibration',   label: 'Vibration',    max: 30,  unit: ' Hz', color: 'bg-purple-400' },
  ];

  return (
    <div
      className={`card-hover bg-white rounded-2xl shadow-sm border transition-all overflow-hidden cursor-pointer ${
        isSelected ? 'border-purple-400 ring-2 ring-purple-200' : 'border-slate-100 hover:border-purple-200'
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-2xl shadow-sm">
              {recipe.emoji}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm leading-tight">{recipe.name}</h4>
              <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                {recipe.category}
              </span>
            </div>
          </div>
          <div className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
            ⏱ {recipe.duration} min
          </div>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{recipe.description}</p>

        {/* Target parameters */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Target Parameters</p>
          {paramDefs.map(p => (
            <ParamBar
              key={p.k}
              label={p.label}
              value={recipe.target[p.k]}
              max={p.max}
              unit={p.unit}
              color={p.color}
            />
          ))}
        </div>

        {/* Current sensor comparison (if a batch uses this recipe) */}
        {currentBatch && (
          <div className="mt-4 bg-purple-50 rounded-xl p-3">
            <p className="text-[10px] font-semibold text-purple-500 uppercase tracking-wide mb-2">
              Live Comparison — {currentBatch.id}
            </p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {paramDefs.map(({ k, label, unit }) => {
                const diff = currentBatch.sensors[k] - recipe.target[k];
                const color = Math.abs(diff) < 5 ? 'text-green-600' : Math.abs(diff) < 15 ? 'text-yellow-600' : 'text-red-600';
                return (
                  <div key={k} className="bg-white rounded-lg p-1.5">
                    <p className="text-[9px] text-slate-400">{label}</p>
                    <p className={`text-[11px] font-bold ${color}`}>
                      {diff > 0 ? '+' : ''}{diff.toFixed(1)}{unit}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Recipes() {
  const { recipes, batches, setSelectedRecipeId, selectedRecipeId } = useApp();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const navigate = useNavigate();

  const filtered = recipes.filter(r =>
    (category === 'All' || r.category === category) &&
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const getBatchForRecipe = (recipeId) =>
    batches.find(b => b.recipeId === recipeId) || null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-in-up">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Recipe Management</h2>
          <p className="text-slate-500 mt-1">Manage and compare production recipes with real-time sensor data</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full">
              {recipes.length} Recipes
            </span>
            <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
              {batches.length} Active Batches
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-green-200 transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Recipe
        </button>
      </div>

      {/* New Recipe Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-slate-800 mb-4">➕ New Recipe</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">Recipe Name</label>
                <input className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400" placeholder="e.g. Honey Brioche" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Moisture (%)', 'Temperature (°C)', 'Airflow (m/s)', 'Vibration (Hz)'].map(l => (
                  <div key={l}>
                    <label className="text-xs font-semibold text-slate-500">{l}</label>
                    <input type="number" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400" />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Duration (min)</label>
                <input type="number" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowNew(false)} className="flex-1 border border-slate-200 rounded-xl py-2 text-sm text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
              <button onClick={() => setShowNew(false)} className="flex-1 bg-green-500 text-white rounded-xl py-2 text-sm font-semibold hover:bg-green-600">Create Recipe</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
        <div className="flex items-center gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                category === c
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 focus-within:border-purple-400 transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-400">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search recipes…"
            className="text-sm text-slate-700 focus:outline-none bg-transparent placeholder-slate-400 w-44"
          />
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-3 gap-5">
        {filtered.map((recipe, i) => (
          <div key={recipe.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            <RecipeCard
              recipe={recipe}
              isSelected={selectedRecipeId === recipe.id}
              onClick={() => setSelectedRecipeId(id => id === recipe.id ? null : recipe.id)}
              currentBatch={getBatchForRecipe(recipe.id)}
            />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-semibold">No recipes match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
