# MeetStream: Real-Time Partner Pairing with Google Meet Integration

## Overview

MeetStream is a full-stack web application designed to randomly and instantly pair users for a conversation. Upon a successful match, the application leverages the Google Calendar API to automatically generate a unique, real-time Google Meet link, facilitating a seamless connection between the two parties.

This project demonstrates a modern monorepo architecture, a secure backend handling sensitive API interactions, and a responsive, user-friendly frontend built with React.

![MeetStream Demo](https://storage.googleapis.com/aistudio-hosting/meetstream-demo.gif)

## Features

-   **User Authentication:** Simple name-based entry to the platform.
-   **Real-Time Pairing:** A server-side queue efficiently matches users looking for a partner.
-   **Automatic Google Meet Generation:** Securely creates a new calendar event with a unique Google Meet link for each pair.
-   **Asynchronous Status Polling:** The frontend polls the backend to update the user's status from "Waiting" to "Paired" without requiring a page refresh.
-   **Responsive Design:** A clean, modern UI that works on various screen sizes.
-   **Secure API Handling:** All interactions with the Google API are handled by the backend, ensuring that sensitive credentials are never exposed to the client.

## Tech Stack

| Category      | Technology                                    |
| ------------- | --------------------------------------------- |
| **Frontend**  | React, Vite, TypeScript, Tailwind CSS         |
| **Backend**   | Node.js, Express, TypeScript, dotenv          |
| **API**       | Google Calendar API (`googleapis`)            |
| **Structure** | Monorepo with NPM Workspaces                  |

## Project Structure

The project is organized as a monorepo with two primary workspaces:

-   `frontend/`: Contains the React application that users interact with. It communicates with the backend via API calls.
-   `backend/`: Contains the Node.js/Express server that manages the pairing logic, user queue, and secure communication with the Google Calendar API.

## Setup and Installation

Follow these steps to get the application running on your local machine.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm (v9 or later)
-   A Google Cloud Platform (GCP) account with billing enabled.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd meetstream-fullstack-monorepo
```

### 2. Google Cloud Platform Setup

This is the most critical part of the setup. The backend needs credentials to interact with your Google Calendar.

**Step A: Create a Google Cloud Project**
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.

**Step B: Enable the Google Calendar API**
1.  In your project dashboard, navigate to **APIs & Services > Library**.
2.  Search for "Google Calendar API" and click **Enable**.

**Step C: Create a Service Account**
A service account is a special type of Google account intended to represent a non-human user that needs to authenticate and be authorized to access data in Google APIs.
1.  Go to **APIs & Services > Credentials**.
2.  Click **Create Credentials** and select **Service account**.
3.  Give the service account a name (e.g., "meetstream-calendar-bot") and a description.
4.  Click **Create and Continue**.
5.  Grant the service account the **Owner** role for simplicity in a development environment. For production, you would use more granular permissions.
6.  Click **Continue**, then **Done**.

**Step D: Generate a Service Account Key**
1.  On the Credentials page, find your newly created service account.
2.  Click on it to manage its details.
3.  Go to the **KEYS** tab.
4.  Click **Add Key** and select **Create new key**.
5.  Choose **JSON** as the key type and click **Create**. A JSON file containing your credentials will be downloaded. **Treat this file like a password and keep it secure.**

**Step E: Create & Share a Google Calendar**
1.  Go to [Google Calendar](https://calendar.google.com/).
2.  Create a new calendar by clicking the `+` sign next to "Other calendars". Name it something like "MeetStream Events".
3.  Open the settings for this new calendar.
4.  Under "Share with specific people or groups", click **Add people and groups**.
5.  Open the JSON key file you downloaded in the previous step. Find the `client_email` value (it will look like `...gserviceaccount.com`).
6.  Paste this email address into the sharing settings.
7.  Set the permissions to **Make changes to events**.
8.  Click **Send**.

### 3. Backend Configuration

**Step A: Create the `.env` File**
1.  Navigate to the backend directory: `cd backend`.
2.  Create a new file named `.env`.
3.  Populate this file using the information from your downloaded JSON key and your calendar settings.

Your `backend/.env` file should look like this:

```env
# The Calendar ID for the calendar you created and shared.
# Find this in your calendar's settings under "Integrate calendar".
GOOGLE_CALENDAR_ID="your-unique-calendar-id@group.calendar.google.com"

# --- Credentials from your downloaded service-account.json file ---

# The "project_id" from the JSON file
GOOGLE_PROJECT_ID="your-gcp-project-id"

# The "client_email" from the JSON file
GOOGLE_CLIENT_EMAIL="your-service-account-email@...gserviceaccount.com"

# The "private_key" from the JSON file.
# IMPORTANT: Copy the entire key, including "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----".
# Enclose it in double quotes and replace all newline characters with the literal '\\n'.
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...your...key...data...\n-----END PRIVATE KEY-----\n"

# Optional: Set the port for the backend server
PORT=3001
```

**How to format the `GOOGLE_PRIVATE_KEY`:**
The private key in the JSON file spans multiple lines. To use it in a `.env` file, you must format it into a single line. The easiest way is to copy the value and manually replace each line break with the characters `\n`. The backend code is already configured to correctly parse this format.

**Step B: Install Dependencies**
Navigate to the root of the project and run the installation script. This will install dependencies for the root, frontend, and backend workspaces.

```bash
# Make sure you are in the root directory
npm run install:all
```

## Running the Application

From the root directory, you can start both the frontend and backend servers concurrently with a single command:

```bash
npm run dev
```

-   The **Backend Server** will start on `http://localhost:3001`.
-   The **Frontend Development Server** will start on `http://localhost:3000` and automatically open in your browser.

The frontend is configured to proxy API requests from `/api` to the backend server, so you don't need to worry about CORS issues during development.

## API Endpoints

The backend exposes the following RESTful endpoints:

-   `POST /api/pair`: Initiates the pairing process for a user.
    -   Body: `{ "name": "string" }`
    -   Response: `{ status: 'PAIRED', pairedInfo: { ... } }` or `{ status: 'WAITING' }`
-   `GET /api/status/:name`: Allows the frontend to poll for a user's pairing status.
    -   Response: `{ status: 'PAIRED' | 'WAITING' | 'IDLE', pairedInfo?: { ... } }`
-   `POST /api/cancel`: Removes a user from the waiting queue.
    -   Body: `{ "name": "string" }`
    -   Response: `{ message: "Search cancelled successfully." }`

## Security

-   **Credential Management:** Service account credentials are kept on the backend and loaded securely from environment variables using `dotenv`.
-   **`.env` File:** The `backend/.env` file is critical and must not be committed to version control. Ensure it is listed in your `.gitignore` file.
-   **API Exposure:** The backend acts as a secure intermediary, ensuring that no Google API keys or service account details are ever exposed to the client-side application.

## License

This project is licensed under the ISC License. See the `package.json` file for details.
