
/**
 * NOTE: This file simulates a backend service.
 * In a real-world, scalable application, this logic would live on a server.
 * The state (`waitingQueue`) would be managed in a database or a fast in-memory store like Redis
 * to handle multiple server instances and ensure data persistence.
 *
 * The Google Calendar API calls to generate a real Meet link would also be made from the server
 * to protect the service account credentials. The private key should NEVER be exposed on the frontend.
 */

// Simulates a server-side FIFO queue of waiting user names.
let waitingQueue: string[] = [];

/**
 * Simulates a backend API call to find a partner.
 * @param currentUser The name of the user requesting a partner.
 * @returns A promise that resolves to a partner object if one is found, or null if the user is now waiting.
 */
export const findPartnerAPI = (currentUser: string): Promise<{ partnerName: string; meetLink: string } | null> => {
  return new Promise((resolve) => {
    // Simulate network latency and processing time.
    setTimeout(() => {
      // If the user is somehow already in the queue, just let them wait.
      // This can happen with rapid clicks, though UI should prevent this.
      if (waitingQueue.includes(currentUser)) {
        resolve(null);
        return;
      }
      
      if (waitingQueue.length > 0) {
        // Partner found! Dequeue the first user.
        const partner = waitingQueue.shift()!;

        // --- REAL BACKEND LOGIC WOULD GO HERE ---
        // 1. Call Google Calendar API with service account credentials.
        // 2. Create a new event for the two users.
        // 3. Enable conferenceData to generate a unique Google Meet link.
        // 4. Return the link and partner's name.
        // For now, we mock the link.
        const mockMeetLink = `https://meet.google.com/mock-${Math.random().toString(36).substring(2, 9)}`;

        console.log(`Paired ${currentUser} with ${partner}. Link: ${mockMeetLink}`);
        resolve({ partnerName: partner, meetLink: mockMeetLink });
      } else {
        // No partner found. Add the current user to the waiting queue.
        waitingQueue.push(currentUser);
        console.log(`${currentUser} is now in the waiting queue.`);
        resolve(null);
      }
    }, 2500); // 2.5-second delay to simulate searching
  });
};

/**
 * Simulates a user cancelling their search and leaving the queue.
 * @param currentUser The name of the user to remove from the queue.
 */
export const cancelWaitAPI = (currentUser: string): void => {
  waitingQueue = waitingQueue.filter(user => user !== currentUser);
  console.log(`${currentUser} has been removed from the waiting queue.`);
};
