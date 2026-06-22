# FraudLens - Blockchain Security Platform

FraudLens is a web application designed to analyze and detect fraudulent activities on blockchain smart contracts and transactions.

## Getting Started

### Quick Start (Windows)
To quickly launch both the frontend client and the backend API server with a single double-click:
1. Double-click the [run.bat](file:///d:/FraudLens/run.bat) file at the root of the project.
2. The script will check if Node.js is installed.
3. It will automatically check for and install dependencies (`node_modules`) if they are missing.
4. It will launch the Backend and Frontend servers in separate console windows.
5. Finally, it will open the application in your default browser at `http://localhost:5173`.

### Manual Start

If you are not on Windows or prefer manual commands:

#### 1. Start the Backend API Server
```bash
cd backend
npm install
npm run dev
```
The backend server runs on `http://localhost:5000`.

#### 2. Start the Frontend Client
```bash
cd frontend
npm install
npm run dev
```
The frontend client runs on `http://localhost:5173`.
