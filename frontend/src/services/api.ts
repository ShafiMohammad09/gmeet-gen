
import { PairedInfo } from '../types';

const API_BASE_URL = '/api';

/**
 * Calls the backend to find a partner for the current user.
 * @param name The name of the user.
 * @returns A promise that resolves to the API response.
 */
export const findPartnerAPI = async (name: string): Promise<{ status: 'PAIRED' | 'WAITING'; pairedInfo?: PairedInfo }> => {
  const response = await fetch(`${API_BASE_URL}/pair`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Failed to connect to the pairing service.');
  }
  return response.json();
};

/**
 * Polls the backend to check the pairing status for a user.
 * @param name The name of the user.
 * @returns A promise that resolves to the user's status.
 */
export const checkStatusAPI = async (name: string): Promise<{ status: 'PAIRED' | 'WAITING' | 'IDLE'; pairedInfo?: PairedInfo }> => {
  const response = await fetch(`${API_BASE_URL}/status/${name}`);

  if (!response.ok) {
    throw new Error('Failed to check pairing status.');
  }
  return response.json();
};

/**
 * Calls the backend to cancel the user's waiting status.
 * @param name The name of the user.
 */
export const cancelWaitAPI = async (name: string): Promise<void> => {
   const response = await fetch(`${API_BASE_URL}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    // We can choose to ignore errors here, as the user is just navigating away.
    console.error('Failed to cancel search on the server.');
  }
};
