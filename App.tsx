
import React, { useState, useCallback } from 'react';
import { User, PairingStatus, PairedInfo } from './types';
import LoginScreen from './components/LoginScreen';
import LobbyScreen from './components/LobbyScreen';
import { findPartnerAPI, cancelWaitAPI } from './services/pairingService';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [pairingStatus, setPairingStatus] = useState<PairingStatus>(PairingStatus.IDLE);
  const [pairedInfo, setPairedInfo] = useState<PairedInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (name: string) => {
    if (name.trim()) {
      setUser({ name });
      setError(null);
    } else {
      setError("Please enter a valid name.");
    }
  };

  const handleFindPartner = useCallback(async () => {
    if (!user) return;
    
    setPairingStatus(PairingStatus.SEARCHING);
    setError(null);

    try {
      const result = await findPartnerAPI(user.name);
      if (result) {
        setPairedInfo(result);
        setPairingStatus(PairingStatus.PAIRED);
      } else {
        setPairingStatus(PairingStatus.WAITING);
      }
    } catch (err) {
      setError("An error occurred while finding a partner. Please try again.");
      setPairingStatus(PairingStatus.ERROR);
    }
  }, [user]);

  const handleCancelSearch = useCallback(() => {
    if (!user) return;
    cancelWaitAPI(user.name);
    setPairingStatus(PairingStatus.IDLE);
  }, [user]);

  const handleReset = () => {
    if(user) cancelWaitAPI(user.name);
    setPairingStatus(PairingStatus.IDLE);
    setPairedInfo(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 left-0 p-6">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          Meet<span className="text-purple-400">Stream</span>
        </h1>
      </header>
      
      <main className="w-full max-w-md mx-auto">
        {!user ? (
          <LoginScreen onLogin={handleLogin} error={error} />
        ) : (
          <LobbyScreen 
            user={user}
            pairingStatus={pairingStatus}
            pairedInfo={pairedInfo}
            onFindPartner={handleFindPartner}
            onCancelSearch={handleCancelSearch}
            onReset={handleReset}
          />
        )}
      </main>

       <footer className="absolute bottom-4 text-center text-gray-500 text-sm">
        <p>This is a frontend simulation. Backend logic for pairing and Google Meet generation is mocked.</p>
        <p>In a real application, Google API credentials must be handled securely on a server.</p>
      </footer>
    </div>
  );
}

export default App;
