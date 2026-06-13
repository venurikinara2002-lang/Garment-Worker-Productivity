# GarmentsIQ: Garment Worker Productivity Predictor

![Application Interface](https://raw.githubusercontent.com/venurikinara2002-lang/Garment-Worker-Productivity/main/Application%20Interface.png)

## 📌 Project Introduction & Industry Context

Garment manufacturing is a highly labor-intensive industry operating on incredibly thin profit margins and tight delivery windows. In countries like **Bangladesh**, the garment sector is a critical cornerstone of the economy, responsible for billions in exports. However, factory floors often suffer from high variability in worker productivity due to complex variables like standard minute values (SMV), style changes, labor count, incentives, and overtime.

This project tackles this **real-world industry problem** using a **real-world dataset**—the **Productivity Prediction of Garment Employees Dataset** from the UCI Machine Learning Repository, which logs the actual production metrics of garment factory workers in Bangladesh. By training custom machine learning regression models on this historical data, **GarmentsIQ** predicts the actual productivity of worker teams in the **Sewing** and **Finishing** departments, enabling factory managers to plan schedules, set realistic targets, and prevent shipping delays.

---

## 📁 Repository Overview & Deliverables

This repository contains the complete pipeline for the predictive model, the web application backend, the interactive frontend dashboard, and supporting analytical documentation.

### 🔗 Quick Links to Project Assets:
* 📄 **[Analytical Research Report (PDF)](../Advance%20Analysis%20report.pdf)**: In-depth statistical analysis, preprocessing steps, feature engineering, and model evaluation metrics.
* 📊 **[Presentation Slides (PDF)](../Slides.pdf)**: Slide deck summarizing findings, model comparisons, and application architecture.
* 🎥 **[Video Demonstration (Google Drive)](https://drive.google.com/drive/folders/1ZJ_tAdrYwVPq1BzvaX5WV5CN63daLLG4?usp=sharing)**: Walkthrough demonstration of the web application and its predictive functionalities.

---

## 💡 Business & Industry Impact: Why It Matters

### 1. Eliminating Missed Deadlines
In international fashion supply chains, late deliveries trigger severe penalties, order cancellations, or require **costly air-freight shipping** (which can completely wipe out profit margins). **GarmentsIQ** helps managers spot bottlenecks days in advance, keeping shipments on schedule.

### 2. What-If Scenario Sandbox
Instead of relying on guesswork, managers can run simulations before shifting lines:
* *"If I add 5 workers to the Sewing department, will we hit our 0.8 target?"*
* *"Does increasing overtime translate to actual output, or does worker fatigue lower productivity?"*

### 3. Optimizing Labor and Minimizing Idle Time
Labor idle time is a direct loss for the business. This model highlights how style changes and idle men affect the bottom line, enabling planners to schedule style transitions (which require line reconfiguration) at the least disruptive times.

### 4. Balanced Incentive Planning
Financial incentives drive motivation but must be balanced against operational costs. The system models the sweet spot between incentive increases and final productivity outputs.

---

## 🚀 Key Features

* **Dual-Model ML Architecture**: 
  Tailored algorithms train separately to capture the distinct operational natures of production lines:
  * **Sewing Department Model**: Powered by an **XGBoost Regressor** (15 features) to analyze complex workflows, style changes, and WIP.
  * **Finishing Department Model**: Powered by a **Random Forest Regressor** (14 features, omitting WIP) for simpler packaging/pressing line parameters.
* **Modern SaaS Web Dashboard**:
  Responsive interface built in dark mode with premium glassmorphism, glowing micro-animations (Framer Motion), and responsive analytics (Recharts).
* **Performance Gap Visualizer**:
  A visual slider comparing predicted actual productivity against targeted productivity, instantly identifying lines falling short.
* **Feature Importance Insights**:
  Draws feature importance metrics directly from the model pipelines, telling managers exactly which lever (e.g., incentives, overtime) has the highest impact on that department's output.
* **Smart Bounds Validation**:
  Interactive validation system with a quality badge (✅ Good, ⚠️ Suspect, ❌ Poor) to alert managers when they enter parameters that are mathematically or historically anomalous.

---

## 🛠️ Tech Stack & Architecture

### Frontend
* **Framework**: React 19 & Vite
* **Styling**: Tailwind CSS (v4)
* **Charts**: Recharts
* **Animations**: Framer Motion

### Backend
* **API Framework**: FastAPI (Python)
* **Web Server**: Uvicorn
* **Libraries**: NumPy, Pandas, Scikit-Learn (1.2.2), Joblib, XGBoost

---

## 📁 Repository Structure

```text
├── backend/
│   ├── models/
│   │   ├── model_sewing.pkl      # Pre-trained XGBoost model & encoders
│   │   └── model_finishing.pkl   # Pre-trained Random Forest model & encoders
│   ├── main.py                   # FastAPI Application (API endpoints)
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx          # Welcome landing section
│   │   │   │   ├── Navbar.jsx    # Sticky navigation
│   │   │   │   ├── Predictor.jsx # Main calculator & charts component
│   │   │   │   └── Solution.jsx  # Core value proposition section
│   │   │   ├── App.jsx           # Entry component
│   │   │   └── index.css         # Base styles & variables
│   │   ├── package.json          # NPM configuration & dependencies
│   │   └── vite.config.js        # Vite configurations
├── garments_worker_productivity.csv # Dataset used for training
├── inspect_models.py             # Script to verify model feature inputs
├── run_all.bat                   # Batch script to boot frontend + backend
├── test_api.py                   # Direct backend API test script
└── validation.py                 # Out-of-bounds warning checks
```

---

## 🔧 Installation & Setup

### Prerequisites
* **Python** 3.10 or higher
* **Node.js** v18 or higher (with npm)

### Quick Start (Windows)
Double-click the `run_all.bat` file in this folder. This script automatically starts the FastAPI backend (on port 8000) and the Vite development server (on port 5173) in separate command prompt windows.

### Manual Setup

#### 1. Configure the Backend
Navigate to the backend directory, create a virtual environment, and install dependencies:
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
The backend API will be running at `http://localhost:8000`. You can access the API docs at `http://localhost:8000/docs`.

#### 2. Configure the Frontend
In a new terminal window, navigate to the frontend folder and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The web dashboard will be available at `http://localhost:5173`.

---

## 📈 Evaluation & Results
Based on model evaluation in `Group_4_final_code_.ipynb`:
* **Sewing Department**: The **XGBoost Regressor** handles the highly complex, non-linear relationships of the sewing line (features like WIP and style changes). It achieves a high $R^2$ score and low Mean Squared Error (MSE), indicating strong predictive accuracy for daily targets.
* **Finishing Department**: The **Random Forest Regressor** is well-suited for the simpler, more linear workflows of the finishing line where many parameters are naturally fixed to zero.
