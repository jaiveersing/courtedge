import { useEffect, useState } from 'react';

export default function DataInitializer({ children }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize data on mount
    const initializeData = async () => {
      try {
        console.log('🚀 DataInitializer: Initializing application data...');
        // Add any data initialization logic here
        setInitialized(true);
      } catch (error) {
        console.error('❌ DataInitializer: Error initializing data:', error);
      }
    };

    initializeData();
  }, []);

  return children; // Render children components
}
