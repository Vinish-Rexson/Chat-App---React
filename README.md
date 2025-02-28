# Real-time Chat Application

A real-time chat application built with React, Socket.IO, and Google OAuth authentication. Users can create chat rooms, join existing rooms, and communicate in real-time with other users.

## Features

- Google OAuth Authentication
- Real-time messaging
- Create and join chat rooms
- User presence indicators
- Message history within rooms
- Responsive design

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Google OAuth credentials (Client ID)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Vinish-Rexson/Chat-App---React.git
   cd chat-app
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install client dependencies
   npm install

   # Install server dependencies
   cd server
   npm install
   ```

3. Configure Google OAuth:
   - Go to the [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Create OAuth 2.0 credentials (Client ID)
   - Add your application domain to the authorized domains
   - Replace the `GOOGLE_CLIENT_ID` in `src/App.js`

4. Create a `.env` file in the root directory:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

## Running the Application

1. Start the server:
   ```bash
   cd server
   node index.js
   ```
   The server will run on port 3001.

2. Start the React application:
   ```bash
   # From the project root directory
   npm start
   ```
   The application will run on port 3000.

3. Open your browser and navigate to: `http://localhost:3000`
