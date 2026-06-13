# GarmentsIQ: Garment Worker Productivity Predictor

![Application Interface](https://raw.githubusercontent.com/venurikinara2002-lang/Garment-Worker-Productivity/main/Application%20Interface.png)

<div align="center">

[![Video Demonstration](https://img.shields.io/badge/🎥_Watch_Video-Demo_&_Resources-orange?style=for-the-badge&logo=google-drive&logoColor=white)](https://drive.google.com/drive/folders/1ZJ_tAdrYwVPq1BzvaX5WV5CN63daLLG4?usp=sharing)
[![Python Version](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![NodeJS Version](https://img.shields.io/badge/Node-v18+-green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

---

## 💡 Why This Project Matters: Business & Industry Impact

Garment manufacturing is a high-volume, low-margin industry where profitability depends heavily on operational efficiency. The industry faces several core challenges that **GarmentsIQ** directly addresses:

### 1. The Cost of Missed Deadlines
In fashion supply chains, shipping delays of even a few days can result in severe financial penalties, order cancellations by international buyers, or the need for **expensive air-freight shipping** (which can wipe out entire profit margins). By predicting actual productivity in advance, managers can identify line bottlenecks days before they happen and adjust schedules to ensure on-time delivery.

### 2. Move from Guesswork to Data-Driven Scheduling
Traditional production target-setting relies on static spreadsheets, historical averages, or simple intuition. Managers often ask "what-if" questions blindly: 
* *"Will adding 5 more workers to line 3 help us hit our target?"*
* *"Is an overtime increment going to yield actual output, or will workers experience fatigue?"*

**GarmentsIQ** provides a sandbox to run these scenarios instantly. Using parameters like SMV (Standard Minute Value), team size, style changes, and target metrics, managers can see realistic, machine-learning-backed outcomes immediately.

### 3. Idle Labor and Resource Wastage
Idle time and idle men represent pure loss. The platform visualizes how idle men and style changes drag down efficiency. By simulating the impact of a style change in the Sewing line, production planners can schedule changes at optimal times (e.g., end of shifts) to minimize disruption.

### 4. Balanced Incentives
Incentives drive worker motivation but must be balanced against operational costs. The model highlights the direct correlation between worker incentive structures and final productivity output, enabling managers to set optimized, self-funding incentive plans.

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

## 📊 Operational Validation Limits

To keep model predictions realistic, the dashboard validates user inputs against the training dataset's logical limits:

| Parameter | Sewing Department Limits | Finishing Department Limits | Description |
| :--- | :--- | :--- | :--- |
| **SMV (Standard Minute Value)** | Max: **51** | Max: **5** | Allocated time in minutes for a single task |
| **WIP (Work In Progress)** | Max: **23,122** | **N/A** (Omitted) | Count of unfinished items in pipeline |
| **Workers** | **1 to 60** | **1 to 28** | Number of workers in the team |
| **Overtime** | Max: **25,920** | Max: **15,000** | Total overtime hours/minutes for the team |
| **Incentive** | Max: **138** | Max: **3,600** | Financial incentive paid to workers |
| **Style Changes** | Max: **2** | Fixed: **0** | Number of style changes in a single day |
| **Idle Men** | Max: **40** | Fixed: **0** | Number of workers left idle |
| **Idle Time** | Max: **150** | Fixed: **0** | Duration of production stoppage (minutes) |

---

## 💡 Usage & API Integration

### API Prediction Endpoint
* **URL**: `/predict`
* **Method**: `POST`
* **Content-Type**: `application/json`

#### Example Request
```json
{
  "quarter": "Quarter1",
  "department": "Sewing",
  "day": "Monday",
  "targeted_productivity": 0.8,
  "smv": 11.2,
  "over_time": 0,
  "incentive": 0,
  "idle_time": 0,
  "wip": 1000,
  "idle_men": 0,
  "no_of_style_change": 0,
  "no_of_workers": 50
}
```

#### Example Response
```json
{
  "prediction": 0.7682,
  "status": "Moderate",
  "extras": {
    "targeted_productivity": 0.8,
    "dept_comparison": {
      "Sewing": 0.7682,
      "Finishing": 0.6953
    },
    "feature_importances": [
      { "feature": "incentive", "importance": 0.384 },
      { "feature": "smv", "importance": 0.152 },
      { "feature": "targeted_productivity", "importance": 0.119 }
    ]
  }
}
```

---

## ⚠️ Note on Slides.pdf and Large Files
GitHub has a recommended file preview limit of **50 MB**. Because `Slides.pdf` (~63.7 MB) and `website video demonstration.mp4` (~65.5 MB) exceed this recommendation, GitHub will show a warning or say **"Unable to render code block" / "Unable to preview"** when clicking on them in the web interface. 

To view these files:
1. Click the **"Download"** button on GitHub to view them locally.
2. Or open the [Video Demo and Project Resources Folder](https://drive.google.com/drive/folders/1ZJ_tAdrYwVPq1BzvaX5WV5CN63daLLG4?usp=sharing) directly in your browser.
