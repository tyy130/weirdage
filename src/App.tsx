import React, { useState, useEffect } from 'react';
import { BirthDateInput, AgeStatistics } from './types';
import { calculateAgeStatistics } from './calculations/ageEngine';
import { generatePerspectiveItems } from './calculations/perspective';
import { getSavedBirthday, saveBirthday } from './storage/storage';
import { purchaseManager } from './purchases/purchaseManager';
import { Header } from './components/Header';
import { InputScreen } from './components/InputScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ShareModal } from './components/ShareModal';
import { MonetizationModal } from './components/MonetizationModal';
import { PrivacyModal } from './components/PrivacyModal';

export const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState<BirthDateInput | null>(() => getSavedBirthday());
  const [isPro, setIsPro] = useState<boolean>(purchaseManager.isPro());

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isProOpen, setIsProOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Subscribe to Pro purchase changes
  useEffect(() => {
    const unsubscribe = purchaseManager.subscribe((pro) => {
      setIsPro(pro);
    });
    return unsubscribe;
  }, []);

  const handleCalculate = (input: BirthDateInput) => {
    saveBirthday(input);
    setBirthDate(input);
  };

  const handleReset = () => {
    setBirthDate(null);
  };

  const handleDataCleared = () => {
    setBirthDate(null);
  };

  const stats: AgeStatistics | null = birthDate
    ? calculateAgeStatistics(birthDate)
    : null;

  const perspectiveItems = stats ? generatePerspectiveItems(stats) : [];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-electric-lime selection:text-black">
      <Header
        isPro={isPro}
        onOpenPro={() => setIsProOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        {!stats ? (
          <InputScreen
            initialValue={getSavedBirthday()}
            onCalculate={handleCalculate}
          />
        ) : (
          <ResultsScreen
            stats={stats}
            perspectiveItems={perspectiveItems}
            isPro={isPro}
            onOpenShare={() => setIsShareOpen(true)}
            onOpenPro={() => setIsProOpen(true)}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Modals */}
      {stats && (
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          stats={stats}
          isPro={isPro}
          onOpenPro={() => setIsProOpen(true)}
        />
      )}

      <MonetizationModal
        isOpen={isProOpen}
        onClose={() => setIsProOpen(false)}
        onSuccess={() => setIsPro(true)}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onDataCleared={handleDataCleared}
      />
    </div>
  );
};

export default App;
