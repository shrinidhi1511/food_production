// ── Mock Recipes ─────────────────────────────────────────────────
export const mockRecipes = [
  {
    id: 'r1',
    name: 'Artisan Sourdough Bread',
    emoji: '🍞',
    duration: 180,
    description: 'Traditional long-fermentation sourdough with controlled humidity and airflow cycles.',
    target: { moisture: 68, temperature: 145, airflow: 1.8, vibration: 12 },
    category: 'Bread',
  },
  {
    id: 'r2',
    name: 'Chocolate Layer Cake',
    emoji: '🎂',
    duration: 60,
    description: 'Multi-layer chocolate sponge requiring precise moisture balance and even heat distribution.',
    target: { moisture: 54, temperature: 170, airflow: 1.2, vibration: 8 },
    category: 'Pastry',
  },
  {
    id: 'r3',
    name: 'Crispy Baguette',
    emoji: '🥖',
    duration: 90,
    description: 'French-style baguette with high-temp baking and steam injection phases.',
    target: { moisture: 45, temperature: 220, airflow: 2.5, vibration: 15 },
    category: 'Bread',
  },
  {
    id: 'r4',
    name: 'Glazed Croissant',
    emoji: '🥐',
    duration: 120,
    description: 'Laminated dough with precise proofing and butter-melt temperature windows.',
    target: { moisture: 50, temperature: 185, airflow: 1.5, vibration: 6 },
    category: 'Pastry',
  },
  {
    id: 'r5',
    name: 'Thin-Crust Pizza',
    emoji: '🍕',
    duration: 15,
    description: 'High-heat flash bake achieving perfect crispiness with low moisture retention.',
    target: { moisture: 30, temperature: 260, airflow: 3.0, vibration: 20 },
    category: 'Savory',
  },
  {
    id: 'r6',
    name: 'Vanilla Cheesecake',
    emoji: '🍰',
    duration: 75,
    description: 'Water-bath baked cheesecake requiring ultra-low vibration and gradual cooling.',
    target: { moisture: 72, temperature: 155, airflow: 0.8, vibration: 2 },
    category: 'Pastry',
  },
];

// ── Batch ID generator ────────────────────────────────────────────
export const generateBatchId = (index) =>
  `BATCH-${String(index + 1).padStart(3, '0')}-${Date.now().toString(36).toUpperCase().slice(-4)}`;

// ── Random sensor generator ───────────────────────────────────────
export const generateSensorReading = (recipeTarget = null) => {
  const base = recipeTarget || { moisture: 60, temperature: 150, airflow: 1.5, vibration: 10 };
  const rand = (center, spread) =>
    parseFloat((center + (Math.random() - 0.5) * 2 * spread).toFixed(2));

  return {
    moisture:    rand(base.moisture,    18),
    temperature: rand(base.temperature, 30),
    airflow:     rand(base.airflow,     1.0),
    vibration:   rand(base.vibration,   8),
  };
};

// ── Initial batches (6 batches) ───────────────────────────────────
export const generateInitialBatches = () =>
  Array.from({ length: 6 }, (_, i) => {
    const recipe = mockRecipes[i % mockRecipes.length];
    const sensors = generateSensorReading(recipe.target);
    return {
      id: generateBatchId(i),
      recipeId: recipe.id,
      recipeName: recipe.name,
      recipeEmoji: recipe.emoji,
      timestamp: new Date(Date.now() - (6 - i) * 5 * 60 * 1000).toISOString(),
      sensors,
    };
  });

// ── AI quality scoring ────────────────────────────────────────────
export const computeQualityScore = (sensors, target) => {
  const weights = { moisture: 0.3, temperature: 0.35, airflow: 0.2, vibration: 0.15 };
  const tolerances = { moisture: 15, temperature: 25, airflow: 0.8, vibration: 7 };
  let score = 0;
  for (const key of Object.keys(weights)) {
    const diff = Math.abs(sensors[key] - target[key]);
    const ratio = Math.max(0, 1 - diff / tolerances[key]);
    score += ratio * weights[key];
  }
  return Math.round(score * 100);
};

// ── Corrective actions ────────────────────────────────────────────
export const getCorrectiveActions = (sensors, target) => {
  const actions = [];
  if (sensors.temperature > target.temperature + 10)
    actions.push({ icon: '🌡️', text: `Reduce temperature by ${Math.round(sensors.temperature - target.temperature)}°C`, severity: 'high' });
  else if (sensors.temperature < target.temperature - 10)
    actions.push({ icon: '🔥', text: `Increase temperature by ${Math.round(target.temperature - sensors.temperature)}°C`, severity: 'medium' });

  if (sensors.moisture > target.moisture + 10)
    actions.push({ icon: '💧', text: `Decrease moisture by ${Math.round(sensors.moisture - target.moisture)}%`, severity: 'high' });
  else if (sensors.moisture < target.moisture - 10)
    actions.push({ icon: '🫧', text: `Increase moisture by ${Math.round(target.moisture - sensors.moisture)}%`, severity: 'medium' });

  if (sensors.airflow > target.airflow + 0.5)
    actions.push({ icon: '🌬️', text: `Reduce airflow by ${(sensors.airflow - target.airflow).toFixed(1)} m/s`, severity: 'low' });
  else if (sensors.airflow < target.airflow - 0.5)
    actions.push({ icon: '💨', text: `Increase airflow by ${(target.airflow - sensors.airflow).toFixed(1)} m/s`, severity: 'low' });

  if (sensors.vibration > target.vibration + 5)
    actions.push({ icon: '📳', text: `Reduce vibration by ${Math.round(sensors.vibration - target.vibration)} Hz`, severity: 'medium' });

  if (actions.length === 0)
    actions.push({ icon: '✅', text: 'All parameters within optimal range', severity: 'ok' });

  return actions;
};

// ── Historical trend (last 12 data points) ───────────────────────
export const generateHistoricalTrend = (batchCount = 12) =>
  Array.from({ length: batchCount }, (_, i) => ({
    label: `B${String(i + 1).padStart(2, '0')}`,
    quality: Math.floor(55 + Math.random() * 45),
    temperature: parseFloat((130 + Math.random() * 80).toFixed(1)),
    moisture: parseFloat((35 + Math.random() * 50).toFixed(1)),
    airflow: parseFloat((0.5 + Math.random() * 2.5).toFixed(2)),
  }));
