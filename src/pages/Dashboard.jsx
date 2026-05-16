import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function StatCard({ icon, label, value, sub, color, bgColor, delay = 0 }) {
  return (
    <div
      className="card-hover bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center text-xl shadow-sm`}>
          {icon}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color} bg-opacity-10`}>
          {sub}
        </span>
      </div>
      <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function FeatureBullet({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl hover:bg-white transition-all duration-200 group">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-slate-800 text-sm">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { batches, recipes, avgQuality, totalAlerts, simulating } = useApp();
  const navigate = useNavigate();

  const activeSensors = batches.length * 4;
  const alertBatches = batches.filter(
    b => b.sensors.temperature > 160 || b.sensors.moisture > 90
  ).length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Welcome back, <span className="gradient-text">shri1511</span> 👋
            </h2>
            <p className="text-slate-500 mt-1">Here's what's happening in your food production facility today.</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">System time</p>
            <p className="text-sm font-semibold text-slate-600">
              {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard
          icon="📡"
          label="Total Sensors"
          value={activeSensors}
          sub="Active"
          color="text-blue-600"
          bgColor="bg-blue-50"
          delay={0}
        />
        <StatCard
          icon="📖"
          label="Active Recipes"
          value={recipes.length}
          sub="Running"
          color="text-green-600"
          bgColor="bg-green-50"
          delay={80}
        />
        <StatCard
          icon="🤖"
          label="AI Predictions"
          value={batches.length}
          sub={alertBatches > 0 ? `${alertBatches} alerts` : 'All clear'}
          color={alertBatches > 0 ? "text-red-600" : "text-orange-600"}
          bgColor="bg-orange-50"
          delay={160}
        />
        <StatCard
          icon="⭐"
          label="Avg Quality Score"
          value={`${avgQuality}%`}
          sub={avgQuality >= 75 ? 'Good' : avgQuality >= 50 ? 'Fair' : 'Poor'}
          color="text-teal-600"
          bgColor="bg-teal-50"
          delay={240}
        />
      </div>

      {/* Welcome / Feature Card */}
      <div
        className="rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8 mb-8 shadow-xl shadow-purple-200 animate-fade-in-up relative overflow-hidden"
        style={{ animationDelay: '300ms' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Digital Twin Platform</h3>
              <p className="text-purple-200 text-sm max-w-lg">
                Monitor, analyze, and optimize your entire food production line using real-time IoT data,
                machine learning predictions, and intelligent recipe management.
              </p>
            </div>
            <div className="text-5xl">🏭</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FeatureBullet
              icon="📡"
              title="Real-time Sensor Monitoring"
              desc="Live moisture, temperature, airflow & vibration from every batch"
            />
            <FeatureBullet
              icon="🤖"
              title="AI-Powered Quality Predictions"
              desc="Random Forest + Logistic Regression models score every batch"
            />
            <FeatureBullet
              icon="📖"
              title="Recipe Management & Optimization"
              desc="Compare live readings vs target parameters for each recipe"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate('/sensors')}
              className="bg-white text-purple-700 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-purple-50 transition-all shadow-sm"
            >
              View Sensors →
            </button>
            <button
              onClick={() => navigate('/analysis')}
              className="bg-purple-500/40 backdrop-blur border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-purple-500/60 transition-all"
            >
              Open Analysis →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Batch Overview */}
      <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-700">Recent Batches</h3>
          <button
            onClick={() => navigate('/sensors')}
            className="text-sm text-purple-600 font-medium hover:text-purple-700 hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {batches.slice(0, 3).map((batch) => {
            const hasAlert = batch.sensors.temperature > 160 || batch.sensors.moisture > 90;
            return (
              <div
                key={batch.id}
                className={`bg-white rounded-xl p-4 shadow-sm border ${hasAlert ? 'border-red-200' : 'border-slate-100'} hover:shadow-md transition-all cursor-pointer`}
                onClick={() => navigate('/sensors')}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{batch.recipeEmoji}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-600">{batch.id}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{batch.recipeName}</p>
                    </div>
                  </div>
                  {hasAlert && (
                    <span className="badge-pulse bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">ALERT</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-slate-500">Temp</p>
                    <p className={`text-xs font-bold ${batch.sensors.temperature > 160 ? 'text-red-600' : 'text-blue-600'}`}>
                      {batch.sensors.temperature.toFixed(1)}°C
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-slate-500">Moisture</p>
                    <p className={`text-xs font-bold ${batch.sensors.moisture > 90 ? 'text-red-600' : 'text-teal-600'}`}>
                      {batch.sensors.moisture.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
