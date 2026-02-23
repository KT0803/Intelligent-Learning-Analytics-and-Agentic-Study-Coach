# Step-by-Step Running Guide

This guide describes how to completely bootstrap the Learning Analytics Risk Predictor locally on your machine.

## Prerequisites
Before you begin, ensure your system has the following installed:
- **Python** (version 3.10 or higher)
- **Node.js** (version 18 or higher)
- **Git**

---

## Step 1: Clone the Repository
Download the project to your local directory:
```bash
git clone https://github.com/VIPAX-JIT/Dummy_AI-ML-.git
cd AI_ML_Project
```

## Step 2: Create a Virtual Environment
We strongly recommend isolating Python dependencies in a Virtual Environment to avoid systemic conflicts. Run this command inside the project root:
```bash
python3 -m venv venv
```

Activate the environment based on your operating system:
- **Mac/Linux:**
  ```bash
  source venv/bin/activate
  ```
- **Windows:**
  ```bash
  venv\Scripts\activate
  ```
*(You must do this every time you open a new terminal window to run the backend.)*

## Step 3: Install Backend Dependencies
Ensure your `venv` is active, then navigate to the backend directory and install the necessary libraries:
```bash
cd backend
pip install -r requirements.txt
```

## Step 4: Ensure Artifacts Exist
The system relies on serialized machine learning models. Ensure the following files exist in the `ml-service/` folder:
- `model.pkl`
- `scaler.pkl`
- `weighted_scores.pkl`

*(If they are missing, you must open `ml-service/train_model.ipynb` using Jupyter Notebook, completely run all cells, and save the notebook. It will automatically generate these files for you.)*

## Step 5: Run the FastAPI Backend
With your virtual environment still active, run the Uvicorn ASGI server from inside the `backend/` directory:
```bash
uvicorn main:app --reload --port 8000
```
This boots the inference system silently in the background.

## Step 6: Run the Frontend Server
Open an entirely new, **SECOND terminal window**. Navigate directly to the `frontend/` directory, install node modules, and boot Vite.
```bash
cd frontend
npm install
npm run dev
```

## Step 7: Test the API
You can verify backend API health autonomously by visiting:
**http://localhost:8000/docs**

This launches the Swagger UI, allowing you to invoke the `POST /predict-risk` endpoint cleanly natively from the web browser before modifying frontend React data. 

To use the visual application, open the frontend URI provided in Terminal 2 (usually **http://localhost:3000**).

---

## Troubleshooting

### CORS Issues
If your frontend responds with "Failed to fetch" or throws a CORS error in the browser console, ensure that the `FRONTEND_URL` in `backend/.env` explicitly strictly matches your exact Vite frontend URL (e.g., `http://localhost:3000` or `http://localhost:5173`). Also ensure no trailing slashes exist.

### Artifact Not Found Errors
If the server crashes immediately claiming `FileNotFoundError`, the relative path calculating `ml-service/` internally failed. Ensure you are launching Uvicorn identically from *inside* the `backend/` directory, rather than executing it globally from the project root.

### "Command Not Found" or "Module Not Found"
If you see errors invoking `uvicorn` or FastAPI stating the package isn't recognized, you forgot to activate the virtual environment natively in that terminal window. Redo Step 2 in the offending console window.

### Port Conflicts
If port `8000` is already taken remotely, uvicorn will crash. Halt existing processes, or execute with an alternative port target by explicitly passing `--port 8001`, then update `fetch("http://localhost:8001")` respectively inside the frontend code.
