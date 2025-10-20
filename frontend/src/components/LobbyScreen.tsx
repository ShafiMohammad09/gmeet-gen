
import React from 'react';
import { User, PairingStatus, PairedInfo } from '../types';
import Spinner from './Spinner';
import PairedCard from './PairedCard';

interface LobbyScreenProps {
  user: User;
  pairingStatus: PairingStatus;
  pairedInfo: PairedInfo | null;
  onFindPartner: () => void;
  onCancelSearch: () => void;
  onReset: () => void;
}

const StatusIndicator: React.FC<{ status: PairingStatus; onCancel: () => void }> = ({ status, onCancel }) => {
    if (status !== PairingStatus.SEARCHING && status !== PairingStatus.WAITING) return null;

    return (
        <div className="text-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 animate-fade-in">
            <div className="flex justify-center items-center mb-4">
                <Spinner />
            </div>
            <h3 className="text-xl font-semibold text-purple-300">
                {status === PairingStatus.SEARCHING ? 'Searching for a Partner...' : 'Waiting for a Partner...'}
            </h3>
            <p className="text-gray-400 mt-2">Please hold on, we're connecting you.</p>
            <button
                onClick={onCancel}
                className="mt-6 bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-700 transition-all"
            >
                Cancel
            </button>
        </div>
    );
}

const LobbyScreen: React.FC<LobbyScreenProps> = ({ 
    user, 
    pairingStatus, 
    pairedInfo, 
    onFindPartner, 
    onCancelSearch,
    onReset
}) => {
  return (
    <div className="text-center w-full">
      <h2 className="text-3xl font-bold mb-2 text-white">
        Hello, <span className="text-purple-400">{user.name}!</span>
      </h2>
      <p className="text-gray-400 mb-8">Ready to connect with someone new?</p>

      {pairingStatus === PairingStatus.IDLE && (
        <div className="animate-fade-in">
            <button
                onClick={onFindPartner}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
            >
                Find a Partner
            </button>
        </div>
      )}

      {(pairingStatus === PairingStatus.SEARCHING || pairingStatus === PairingStatus.WAITING) && (
        <StatusIndicator status={pairingStatus} onCancel={onCancelSearch} />
      )}

      {pairingStatus === PairingStatus.PAIRED && pairedInfo && (
        <PairedCard pairedInfo={pairedInfo} onReset={onReset} />
      )}
       {pairingStatus === PairingStatus.ERROR && (
         <div className="animate-fade-in p-6 bg-red-900/50 border border-red-700 rounded-2xl">
           <p className="text-red-300 mb-4">Something went wrong. Please try again.</p>
           <button
             onClick={onReset}
             className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-700 transition-all"
           >
             Try Again
           </button>
         </div>
       )}

    </div>
  );
};

export default LobbyScreen;
