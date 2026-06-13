# Running the Garments AI Application

This document provides instructions on how to start the application.

## Quick Start (Recommended)

Double-click the `run_all.bat` file in the project root directory. This will open two separate terminal windows for the Backend and Frontend.

## Manual Start

If you prefer to run the components manually, follow these steps:

### 1. Start the Backend API
1. Open a terminal in the project root.
2. Run the following commands:
   ```bash
   cd backend
   ..\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
   ```
3. The API will be available at `http://localhost:8000`.

### 2. Start the Frontend
1. Open a new terminal in the project root.
2. Run the following commands:
   ```bash
   cd frontend
   npm run dev
   ```
3. The UI will be available at `http://localhost:5173`.

## Troubleshooting

- **Port already in use**: If port 8000 or 5173 is already in use, you may need to close those processes or change the ports.
- **Missing dependencies**: If the application fails to start, ensure you have run `npm install` in the `frontend` directory.
