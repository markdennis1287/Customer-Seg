
# Customer Segmentation Backend API

This document outlines the API interface for the Python ML backend that processes customer data and generates segmentation analysis.

## Setup Instructions

1. Create a Python virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install required packages:
   ```
   pip install fastapi uvicorn pandas scikit-learn numpy matplotlib seaborn
   ```

3. Run the server:
   ```
   uvicorn main:app --reload
   ```

## API Endpoints

### 1. Analyze Customer Data

**Endpoint:** `POST /api/analyze`

**Purpose:** Process customer data and generate segmentation analysis using machine learning algorithms.

**Request Body:**
```json
{
  "customerData": [
    {
      "id": 1,
      "age": 35,
      "gender": "Male",
      "income": 75000,
      "purchases": 12,
      "region": "North"
    },
    // ... more customer records
  ]
}
```

**Response:**
```json
{
  "clusters": [
    {
      "clusterId": 0,
      "customers": [/* array of customer objects */],
      "centroid": {
        "age": 35.5,
        "income": 72000,
        "purchases": 14.3
        // any other numeric features
      },
      "clusterName": "High-Value Customers",
      "characteristics": [
        "Higher income bracket",
        "Medium purchase frequency",
        "Primarily from North region"
      ]
    },
    // ... more clusters
  ],
  "featureImportance": {
    "age": 0.15,
    "income": 0.65,
    "purchases": 0.20
    // any other features
  },
  "accuracy": 0.85
}
```

### 2. Generate Recommendations

**Endpoint:** `POST /api/recommendations`

**Purpose:** Generate strategic recommendations based on customer segmentation analysis.

**Request Body:**
```json
{
  "analysis": {
    // The entire analysis response from the /api/analyze endpoint
  }
}
```

**Response:**
```json
{
  "recommendations": [
    "Target \"High-Value Customers\" with loyalty programs to maintain their high engagement.",
    "Create targeted promotions for \"New Potentials\" to increase their purchase frequency.",
    // ... more recommendations
  ]
}
```

## Implementation Guidelines

1. Use appropriate ML algorithms for clustering:
   - K-means for numerical data
   - Hierarchical clustering for more complex patterns
   - DBSCAN for density-based clustering

2. Feature engineering:
   - Normalize numerical features
   - One-hot encode categorical features
   - Consider dimensionality reduction (PCA) for high-dimensional data

3. Model evaluation:
   - Calculate silhouette score to determine optimal cluster count
   - Implement cluster validation techniques
   - Provide confidence metrics

4. Performance considerations:
   - Implement caching for frequent requests
   - Use async processing for large datasets
   - Consider batch processing options

## Example Python Implementation Structure

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib

app = FastAPI()

# Define data models
class CustomerData(BaseModel):
    id: int
    age: Optional[int]
    gender: Optional[str]
    income: Optional[float]
    purchases: Optional[int]
    region: Optional[str]
    # Add any other fields

class AnalysisRequest(BaseModel):
    customerData: List[Dict[str, Any]]

@app.post("/api/analyze")
async def analyze_customer_data(request: AnalysisRequest):
    # Convert to DataFrame
    df = pd.DataFrame(request.customerData)
    
    # Preprocess data
    # ... feature engineering code ...
    
    # Perform clustering
    # ... ML code ...
    
    # Generate response
    # ... format results ...
    
    return {
        "clusters": clusters,
        "featureImportance": feature_importance,
        "accuracy": accuracy_score
    }
```
