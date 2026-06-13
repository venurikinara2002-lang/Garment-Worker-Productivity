# GarmentsIQ: Garment Worker Productivity Predictor

GarmentsIQ is a predictive analytics SaaS web application built specifically for the garment manufacturing industry. Using machine learning regression models, the platform forecasts actual production productivity across **Sewing** and **Finishing** departments based on daily operational parameters. 

By predicting throughput in advance, factory managers can optimize scheduling, set realistic targets, adjust incentives, and prevent costly bottlenecks.

---

## 🚀 Key Features

* **Dual-Model ML Architecture**: 
  Utilizes specialized machine learning models tailored to each department's distinct operational characteristics:
  * **Sewing Department**: Powered by an **XGBoost Regressor** (trained on 15 features).
  * **Finishing Department**: Powered by a **Random Forest Regressor** (trained on 14 features, omitting Work in Progress/WIP).
* **Live Interactive Predictor Dashboard**:
  A modern, responsive user interface featuring glassmorphic designs, smooth micro-animations (Framer Motion), and dark mode elements.
* **Performance Gap Visualizer**:
  An interactive gauge showing the distance between the predicted productivity and the manager's targeted productivity.
* **Dual-Department Comparison**:
  Recharts-based bar charts compare predicted outcomes between the Sewing and Finishing departments under identical inputs.
* **Key Impact Drivers (Feature Importance)**:
  Exposes the top 5 operational variables driving the prediction (e.g., standard minute value, number of style changes, incentives) to help managers make data-driven decisions.
* **Smart Quality Constraints & Data Validation**:
  Enforces historical and logical bounds to prevent anomalous predictions. Warns users with visual indicators (✅ Good, ⚠️ Suspect, ❌ Poor) when parameters are out of standard ranges.

---

## 🛠️ Architecture & Tech Stack

### Frontend
* **Core Framework**: React 19 & Vite (Fast HMR)
* **Styling**: Tailwind CSS (v4)
* **Animations**: Framer Motion
* **Data Visualization**: Recharts

### Backend
* **API Framework**: FastAPI (Python)
* **Web Server**: Uvicorn
* **Scientific Computing**: NumPy, Pandas
* **Machine Learning**: Scikit-Learn (1.2.2), Joblib (for model loading), XGBoost

---

## 📁 Repository Structure

```text
├── final github/
│   ├── backend/
│   │   ├── models/
│   │   │   ├── model_sewing.pkl      # Pre-trained XGBoost model & encoders
│   │   │   └── model_finishing.pkl   # Pre-trained Random Forest model & encoders
│   │   ├── main.py                   # FastAPI Application (API endpoints)
│   │   └── requirements.txt          # Python dependencies
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Hero.jsx          # Welcome landing section
│   │   │   │   ├── Navbar.jsx        # Sticky navigation
│   │   │   │   ├── Predictor.jsx     # Main calculator & charts component
│   │   │   │   └── Solution.jsx      # Core value proposition section
│   │   │   ├── App.jsx               # Entry component
│   │   │   └── index.css             # Base styles & variables
│   │   ├── package.json              # NPM configuration & dependencies
│   │   └── vite.config.js            # Vite configurations
│   ├── garments_worker_productivity.csv # Dataset used for training
│   ├── inspect_models.py             # Script to verify model feature inputs
│   ├── run_all.bat                   # Batch script to boot frontend + backend
│   ├── test_api.py                   # Direct backend API test script
│   └── validation.py                 # Out-of-bounds warning checks
├── Group_4_final_code_.ipynb         # Jupyter Notebook detailing training workflow
├── Advance Analysis report.pdf       # Analytical research report
└── Slides.pdf                        # Presentation slides
```

---

## 🔧 Installation & Setup

### Prerequisites
* **Python** 3.10 or higher
* **Node.js** v18 or higher (with npm)

### Quick Start (Windows)
Double-click the `run_all.bat` file in the `final github` folder. This script automatically starts the FastAPI backend (on port 8000) and the Vite development server (on port 5173) in separate command prompt windows.

### Manual Setup

#### 1. Configure the Backend
Navigate to the backend directory, create a virtual environment, and install dependencies:
```bash
cd "final github/backend"
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
cd "final github/frontend"
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

## 📈 Evaluation & Results
Based on model evaluation in `Group_4_final_code_.ipynb`:
* **Sewing Department**: The **XGBoost Regressor** handles the highly complex, non-linear relationships of the sewing line (features like WIP and style changes). It achieves a high $R^2$ score and low Mean Squared Error (MSE), indicating strong predictive accuracy for daily targets.
* **Finishing Department**: The **Random Forest Regressor** is well-suited for the simpler, more linear workflows of the finishing line where many parameters are naturally fixed to zero.
