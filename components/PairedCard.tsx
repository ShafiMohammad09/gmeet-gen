
import React from 'react';
import { PairedInfo } from '../types';

interface PairedCardProps {
  pairedInfo: PairedInfo;
  onReset: () => void;
}

const PairedCard: React.FC<PairedCardProps> = ({ pairedInfo, onReset }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-purple-700 text-center animate-fade-in-up">
      <h3 className="text-2xl font-bold mb-2 text-green-400">You've been paired!</h3>
      <p className="text-lg text-gray-300 mb-6">
        You are now connected with <span className="font-bold text-white">{pairedInfo.partnerName}</span>.
      </p>
      
      <a
        href={pairedInfo.meetLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-green-700 disabled:bg-gray-600 transition-all transform hover:scale-105 mb-6"
      >
        Join Google Meet
      </a>

      <p className="text-xs text-gray-500 mb-6">
        Note: This is a mock link. In a real app, this would be a unique Google Meet URL.
      </p>
      
      <button
        onClick={onReset}
        className="w-full bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-all"
      >
        Find Another Partner
      </button>
    </div>
  );
};

export default PairedCard;
