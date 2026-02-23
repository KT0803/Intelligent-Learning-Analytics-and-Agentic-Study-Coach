🎓 Intelligent Learning Analytics & Agentic Study Coach

An AI-powered learning analytics system that analyzes student performance data and generates personalized study recommendations. The system evolves into an Agentic AI Study Coach capable of diagnosing learning gaps, planning strategies, retrieving resources, and producing adaptive study plans.

📌 Project Overview

This project is developed as part of the AI/ML coursework to design and deploy a publicly hosted learning analytics platform.

It consists of two milestones:

🔹 Milestone 1 — ML-Based Learning Analytics System

Classical Machine Learning models analyze student performance data and:

Predict risk levels

Classify students (At-Risk / Average / High-Performing)

Generate data-driven study recommendations

🔹 Milestone 2 — Agentic AI Study Coach

An autonomous AI study coach that:

Diagnoses learning gaps

Generates personalized multi-step study plans

Retrieves relevant learning resources

Adapts recommendations based on goals

Maintains session-based reasoning (optional)

📂 Dataset Sources
🎯 Student Performance Dataset

https://www.kaggle.com/datasets/spscientist/students-performance-in-exams

https://archive.ics.uci.edu/ml/datasets/student+performance

📚 Research Dataset (Optional Extension)

https://www.kaggle.com/datasets/Cornell-University/arxiv

🧠 System Architecture
🔹 Milestone 1 – ML Pipeline
CSV Upload → Data Preprocessing → Feature Engineering
            → ML Model (Logistic/Linear Regression)
            → Classification (Risk Levels)
            → Study Recommendation Engine
            → UI Display
Components:

Data Cleaning (Missing values handling)

Scaling (StandardScaler / MinMaxScaler)

Supervised Learning (Logistic Regression / Linear Regression)

Optional Clustering (K-Means)

Model Evaluation (Accuracy, F1-score, RMSE)

🔹 Milestone 2 – Agentic Workflow
Student Data + Goals
        ↓
Learning Gap Diagnosis
        ↓
Planning Module
        ↓
Resource Retrieval (RAG optional)
        ↓
LLM Reasoning
        ↓
Structured Study Report Generation

Possible Agent Framework:

LangGraph (recommended)

Custom agent orchestration

🚀 Features
✅ Milestone 1

Upload student performance CSV

Automatic preprocessing

Risk level prediction

Student classification:

🔴 At-Risk

🟡 Average

🟢 High-Performing

Rule-based + ML-based recommendations

Model performance analysis dashboard

✅ Milestone 2

Accept student learning goals

Diagnose weak subjects/topics

Generate:

Learning diagnosis

Personalized study plan

Weekly milestones

Resource recommendations (URLs)

Next steps & progress feedback

Optional:

Quiz generation

Adaptive difficulty

PDF export

Multi-student dashboard

🛠 Tech Stack
🧪 Machine Learning

Python

pandas

NumPy

scikit-learn

🤖 NLP / LLM (Milestone 2)

Open-source LLMs / Free-tier APIs

LangGraph (Agent orchestration)

NLTK / spaCy (optional)

💻 User Interface

Streamlit / Gradio

🌍 Deployment

Hugging Face Spaces

Streamlit Community Cloud

Render (Free Tier)

📊 Model Evaluation

Example Metrics:

Accuracy

Precision

Recall

F1-score

Confusion Matrix

RMSE (for regression)

Limitations:

Dataset bias

Limited generalization

Static recommendations (Milestone 1)

Dependency on LLM quality (Milestone 2)

📄 Structured Output Format (Milestone 2)

The AI Study Coach generates:

1. Learning Diagnosis
2. Identified Weak Areas
3. Personalized Study Plan
4. Weekly Goals
5. Recommended Resources (URLs)
6. Progress Feedback
7. Next Steps
📥 Installation & Setup
git clone https://github.com/your-username/project-name.git
cd project-name
pip install -r requirements.txt
streamlit run app.py
🌐 Live Demo

🔗 Hosted Application: [Add Public Link Here]
🎥 Demo Video: [Add YouTube/Drive Link Here]

👥 Team Members

Krrish

Jatin

Pushkar

Harshit

📌 Use Case

This system can be used by:

Schools

Coaching institutes

EdTech platforms

Individual learners

It helps improve academic outcomes using AI-driven insights.

🔮 Future Improvements

Real-time analytics dashboard

Integration with LMS platforms

Reinforcement learning for adaptive study plans

Multi-language support

Advanced knowledge tracing models

📜 License

This project is developed for academic purposes.
