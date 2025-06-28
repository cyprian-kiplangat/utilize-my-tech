import { useState, useEffect } from 'react';
import { Perk } from '../types';
import { mockPerks } from '../data/mockData';

export const usePerks = () => {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage or use mock data
    const savedPerks = localStorage.getItem('utilize-my-tech-perks');
    const demoCleared = localStorage.getItem('utilize-my-tech-demo-cleared');
    
    if (savedPerks && demoCleared !== 'true') {
      try {
        const parsedPerks = JSON.parse(savedPerks);
        setPerks(parsedPerks);
      } catch (error) {
        console.error('Error parsing saved perks:', error);
        setPerks(mockPerks);
      }
    } else if (demoCleared === 'true') {
      setPerks([]);
    } else {
      setPerks(mockPerks);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever perks change (but only after initial load)
    if (isLoaded) {
      localStorage.setItem('utilize-my-tech-perks', JSON.stringify(perks));
    }
  }, [perks, isLoaded]);

  const addPerk = (perk: Omit<Perk, 'id' | 'createdAt'>) => {
    const newPerk: Perk = {
      ...perk,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setPerks(prev => {
      const updatedPerks = [...prev, newPerk];
      // Immediately save to localStorage
      localStorage.setItem('utilize-my-tech-perks', JSON.stringify(updatedPerks));
      return updatedPerks;
    });
  };

  const updatePerk = (id: string, updates: Partial<Perk>) => {
    setPerks(prev => {
      const updatedPerks = prev.map(perk => 
        perk.id === id ? { ...perk, ...updates } : perk
      );
      // Immediately save to localStorage
      localStorage.setItem('utilize-my-tech-perks', JSON.stringify(updatedPerks));
      return updatedPerks;
    });
  };

  const deletePerk = (id: string) => {
    setPerks(prev => {
      const updatedPerks = prev.filter(perk => perk.id !== id);
      // Immediately save to localStorage
      localStorage.setItem('utilize-my-tech-perks', JSON.stringify(updatedPerks));
      return updatedPerks;
    });
  };

  const clearAllData = () => {
    setPerks([]);
    localStorage.removeItem('utilize-my-tech-perks');
    localStorage.setItem('utilize-my-tech-demo-cleared', 'true');
  };

  const categorizePerks = () => {
    const now = new Date();
    const expiringSoon = perks.filter(perk => {
      const expiryDate = new Date(perk.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0 && perk.status !== 'expired';
    });

    const unused = perks.filter(perk => 
      perk.status === 'unused' && !expiringSoon.includes(perk)
    );

    const inProgress = perks.filter(perk => 
      perk.status === 'in-progress' && !expiringSoon.includes(perk)
    );

    const completed = perks.filter(perk => perk.status === 'completed');
    const expired = perks.filter(perk => perk.status === 'expired');

    return { expiringSoon, unused, inProgress, completed, expired };
  };

  return {
    perks,
    addPerk,
    updatePerk,
    deletePerk,
    clearAllData,
    categorizePerks,
    isLoaded
  };
};