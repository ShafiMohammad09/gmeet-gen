
import { PairedInfo } from '../types';
import { createEventWithMeet } from './googleCalendarService';

// In-memory state management. For production, consider using Redis or a database.
let waitingQueue: string[] = [];
const completedPairs = new Map<string, PairedInfo>();

/**
 * Attempts to find a partner for the given user.
 * If a partner is found, they are paired, a Meet link is generated, and the result is stored.
 * If not, the user is added to the waiting queue.
 * @param currentUser The name of the user looking for a partner.
 * @returns A PairedInfo object if a partner was found immediately, otherwise null.
 */
export async function findPartner(currentUser: string): Promise<PairedInfo | null> {
  // Prevent duplicate entries from rapid clicks
  if (waitingQueue.includes(currentUser) || completedPairs.has(currentUser)) {
    return null; 
  }

  if (waitingQueue.length > 0) {
    const partner = waitingQueue.shift()!; // Dequeue the waiting user
    
    console.log(`Pairing ${currentUser} with ${partner}...`);

    // Generate the Google Meet link
    const meetLink = await createEventWithMeet(currentUser, partner);

    // Store the result for both users so they can poll for it
    const pairInfoForCurrentUser: PairedInfo = { partnerName: partner, meetLink };
    const pairInfoForPartner: PairedInfo = { partnerName: currentUser, meetLink };

    completedPairs.set(currentUser, pairInfoForCurrentUser);
    completedPairs.set(partner, pairInfoForPartner);
    
    console.log(`Pairing complete for ${currentUser} and ${partner}.`);
    return pairInfoForCurrentUser;
  } else {
    // No one is waiting, so add the current user to the queue
    console.log(`${currentUser} is now waiting.`);
    waitingQueue.push(currentUser);
    return null;
  }
}

/**
 * Checks the status of a user.
 * @param userName The name of the user to check.
 * @returns An object indicating the user's status: PAIRED, WAITING, or IDLE.
 */
export function checkUserStatus(userName: string): { status: 'PAIRED' | 'WAITING' | 'IDLE'; pairedInfo?: PairedInfo } {
  if (completedPairs.has(userName)) {
    const pairedInfo = completedPairs.get(userName)!;
    completedPairs.delete(userName); // Consume the result
    return { status: 'PAIRED', pairedInfo };
  }

  if (waitingQueue.includes(userName)) {
    return { status: 'WAITING' };
  }

  return { status: 'IDLE' };
}

/**
 * Removes a user from the waiting queue.
 * @param userName The name of the user to remove.
 */
export function cancelUserWait(userName: string): void {
  waitingQueue = waitingQueue.filter(user => user !== userName);
  console.log(`${userName} has cancelled their search.`);
}
