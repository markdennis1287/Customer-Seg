
# Customer Segmentation Application

This application provides customer segmentation and analysis using machine learning algorithms.

## Project Structure

The project is organized into two main parts:

### Frontend (React)
- Built with React, TypeScript, and Tailwind CSS
- Located in the root directory
- Provides the user interface for data upload, visualization, and analysis

### Backend (Python)
- Built with FastAPI and scikit-learn
- Located in the `backend` directory
- Provides ML algorithms for data processing and analysis

## Setup and Installation

### Frontend Setup
1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a Python virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install required packages:
   ```
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```
   uvicorn main:app --reload
   ```

## API Documentation

Once the backend is running, API documentation is available at:
- Swagger UI: http://localhost:5000/docs
- ReDoc: http://localhost:5000/redoc

## Key Features

- Customer data upload and processing
- Machine learning-based customer segmentation
- Visualization of customer segments
- Strategic recommendations based on segments
- Analysis history and saved results
