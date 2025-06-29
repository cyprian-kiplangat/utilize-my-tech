import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PerkDetail } from './components/PerkDetail';
import { AIAssistant } from './components/AIAssistant';
import { AddPerk } from './components/AddPerk';
import { PortfolioConfig } from './components/PortfolioConfig';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPerkId, setSelectedPerkId] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedPerkId(null);
  };

  const handlePerkClick = (perkId: string) => {
    setSelectedPerkId(perkId);
    setCurrentPage('perk-detail');
  };

  const handleAddPerkSuccess = () => {
    setCurrentPage('dashboard');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPerkClick={handlePerkClick} onNavigate={handleNavigate} />;
      case 'perk-detail':
        return selectedPerkId ? (
          <PerkDetail 
            perkId={selectedPerkId} 
            onBack={() => setCurrentPage('dashboard')} 
          />
        ) : null;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'add-perk':
        return <AddPerk onSuccess={handleAddPerkSuccess} />;
      case 'settings':
        return <PortfolioConfig onNavigate={handleNavigate} />;
      default:
        return <Dashboard onPerkClick={handlePerkClick} onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderContent()}
    </Layout>
  );
}

export default App;