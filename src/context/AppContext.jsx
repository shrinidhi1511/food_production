import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  generateInitialBatches,
  generateSensorReading,
  mockRecipes,
  generateHistoricalTrend,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [batches, setBatches] = useState(generateInitialBatches);
  const [simulating, setSimulating] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [historicalData] = useState(() => generateHistoricalTrend(16));

  const simulateNewReading = useCallback(() => {
    setBatches(prev => {
      const updated = prev.map(batch => {
        const recipe = mockRecipes.find(r => r.id === batch.recipeId) || mockRecipes[0];
        return {
          ...batch,
          sensors: generateSensorReading(recipe.target),
          timestamp: new Date().toISOString(),
        };
      });
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!simulating) return;
    const interval = setInterval(simulateNewReading, 3000);
    return () => clearInterval(interval);
  }, [simulating, simulateNewReading]);

  const totalAlerts = batches.filter(
    b => b.sensors.temperature > 160 || b.sensors.moisture > 90
  ).length;

  const avgQuality = Math.round(
    batches.reduce((sum, b) => {
      const recipe = mockRecipes.find(r => r.id === b.recipeId) || mockRecipes[0];
      const diff =
        Math.abs(b.sensors.temperature - recipe.target.temperature) / recipe.target.temperature +
        Math.abs(b.sensors.moisture - recipe.target.moisture) / recipe.target.moisture;
      return sum + Math.max(0, 100 - diff * 60);
    }, 0) / batches.length
  );

  return (
    <AppContext.Provider value={{
      batches,
      setBatches,
      simulating,
      setSimulating,
      selectedRecipeId,
      setSelectedRecipeId,
      historicalData,
      totalAlerts,
      avgQuality,
      recipes: mockRecipes,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
