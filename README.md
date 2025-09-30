# 🎓 Student Dropout Predictor

A comprehensive machine learning application that predicts student dropout risk using advanced analytics and provides actionable insights for educational institutions.

## 🌟 Features

- **Machine Learning Models**: XGBoost-based dropout prediction with hyperparameter tuning
- **Interactive Dashboard**: Real-time risk assessment and visualization
- **Student Analytics**: Individual student risk analysis with SHAP explanations
- **Data Processing**: Automated data validation and preprocessing
- **Export Capabilities**: CSV exports and detailed reports
- **Modern UI**: React-based frontend with responsive design

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
```bash
   git clone https://github.com/2006-Aman/students-dropout-predictor.git
   cd students-dropout-predictor
```

2. **Set up Python environment**
```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Set up Frontend**
```bash
   cd frontend
   npm install
   cd ..
```

4. **Run the application**
   ```bash
   # Option 1: Full-stack (recommended)
   python start-full-stack.py

   # Option 2: Streamlit only
streamlit run app.py
   
   # Option 3: API only
   uvicorn api:app --reload
   ```

## 📊 Usage

### Data Upload
1. Upload a CSV file with student data
2. Map your columns to the expected format
3. Process and validate the data

### Model Training
1. Configure model settings (hyperparameter tuning, SMOTE)
2. Train the model on your data
3. View performance metrics

### Risk Assessment
1. View the dashboard with risk distribution
2. Analyze individual student details
3. Get intervention recommendations
4. Export results and reports

## 🏗️ Architecture

```
├── api.py                 # FastAPI backend
├── app.py                 # Streamlit application
├── model_trainer.py      # ML model training
├── data_processor.py     # Data preprocessing
├── explainability.py     # SHAP explanations
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/       # Application pages
│   │   └── lib/         # Utilities
│   └── package.json
└── models/               # Trained models
```

## 🔧 Configuration

### Required Data Columns
- `student_id`: Unique student identifier
- `attendance_percentage`: Student attendance rate
- `quiz_test_avg_pct`: Average quiz/test performance
- `fee_payment_status`: Payment status
- `lms_login_count_monthly`: LMS engagement

### Optional Columns
- `student_name`, `age`, `gender`
- `assignment_timeliness`
- `time_spent_online_hours_week`
- `socioeconomic_status`

## 🌐 Deployment

### Render Deployment
This application is configured for deployment on Render:

1. **Backend API**: Deployed as a web service
2. **Frontend**: Deployed as a static site
3. **Configuration**: See `render.yaml` for deployment settings

### Environment Variables
- `PORT`: Server port (automatically set by Render)
- `VITE_API_BASE_URL`: Frontend API URL for production

## 📈 Model Performance

The application uses XGBoost with the following features:
- **Hyperparameter Tuning**: Optuna-based optimization
- **Class Imbalance**: SMOTE for handling imbalanced data
- **Feature Engineering**: Automated feature selection
- **Explainability**: SHAP values for model interpretation

## 🛠️ Development

### Backend Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run API server
uvicorn api:app --reload

# Run Streamlit app
streamlit run app.py
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## 📝 API Documentation

Once the API is running, visit:
- **Interactive Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API documentation

## 🔮 Future Enhancements

- [ ] Real-time data integration
- [ ] Advanced visualization features
- [ ] Multi-institution support
- [ ] Mobile application
- [ ] Advanced reporting features