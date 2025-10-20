
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, PairingStatus, PairedInfo } from './types';
import LoginScreen from './components/LoginScreen';
import LobbyScreen from './components/LobbyScreen';
import { findPartnerAPI, checkStatusAPI, cancelWaitAPI } from './services/api';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [pairingStatus, setPairingStatus] = useState<PairingStatus>(PairingStatus.IDLE);
  const [pairedInfo, setPairedInfo] = useState<PairedInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollingIntervalRef = useRef<number | null>(null);

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (pairingStatus === PairingStatus.WAITING && user) {
      pollingIntervalRef.current = window.setInterval(async () => {
        try {
          const result = await checkStatusAPI(user.name);
          if (result.status === 'PAIRED' && result.pairedInfo) {
            setPairedInfo(result.pairedInfo);
            setPairingStatus(PairingStatus.PAIRED);
            stopPolling();
          }
        } catch (err) {
          setError("Failed to check pairing status. Please try again.");
          setPairingStatus(PairingStatus.ERROR);
          stopPolling();
        }
      }, 3000); // Poll every 3 seconds
    }
    
    // Cleanup function to stop polling when component unmounts or status changes
    return stopPolling;
  }, [pairingStatus, user]);


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
      if (result.status === 'PAIRED' && result.pairedInfo) {
        setPairedInfo(result.pairedInfo);
        setPairingStatus(PairingStatus.PAIRED);
      } else {
        setPairingStatus(PairingStatus.WAITING);
      }
    } catch (err) {
      setError("An error occurred while finding a partner. Please try again.");
      setPairingStatus(PairingStatus.ERROR);
    }
  }, [user]);

  const handleCancelSearch = useCallback(async () => {
    if (!user) return;
    stopPolling();
    await cancelWaitAPI(user.name);
    setPairingStatus(PairingStatus.IDLE);
  }, [user]);

  const handleReset = async () => {
    stopPolling();
    if (user) await cancelWaitAPI(user.name);
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

       <footer className="absolute bottom-4 text-center text-gray-500 text-sm px-2">
        <p>A full-stack application connecting users with real-time Google Meet links.</p>
      </footer>
    </div>
  );
}

export default App;
