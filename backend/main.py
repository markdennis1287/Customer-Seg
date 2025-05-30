
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Union
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import silhouette_score
from sklearn.feature_selection import mutual_info_regression
import joblib
import os
import json
from pathlib import Path

# Initialize FastAPI
app = FastAPI(title="Customer Segmentation API")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class CustomerData(BaseModel):
    id: int
    age: Optional[float] = None
    gender: Optional[str] = None
    income: Optional[float] = None
    purchases: Optional[float] = None
    region: Optional[str] = None
    # Other fields can be added as needed

class AnalysisRequest(BaseModel):
    customerData: List[Dict[str, Any]]

class RecommendationRequest(BaseModel):
    analysis: Dict[str, Any]

# Helper functions
def determine_optimal_clusters(data, max_clusters=10):
    """Determine the optimal number of clusters using silhouette score"""
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(data)
    
    silhouette_scores = []
    for n_clusters in range(2, min(max_clusters + 1, len(data) // 5 + 1)):
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        cluster_labels = kmeans.fit_predict(X_scaled)
        silhouette_avg = silhouette_score(X_scaled, cluster_labels)
        silhouette_scores.append(silhouette_avg)
    
    # Get the optimal number of clusters (max silhouette score)
    if not silhouette_scores:
        return 3  # Default if data is too small
    optimal_clusters = silhouette_scores.index(max(silhouette_scores)) + 2
    return optimal_clusters

def calculate_feature_importance(X, y):
    """Calculate feature importance using mutual information"""
    importance = mutual_info_regression(X, y)
    # Normalize to sum to 1
    importance = importance / np.sum(importance)
    return {col: float(imp) for col, imp in zip(X.columns, importance)}

def generate_cluster_characteristics(df, cluster_col, centroid):
    """Generate human-readable cluster characteristics"""
    characteristics = []
    
    # Age-based characteristics
    if 'age' in centroid:
        if centroid['age'] < 30:
            characteristics.append("Younger demographic")
        elif centroid['age'] < 45:
            characteristics.append("Middle-aged demographic")
        else:
            characteristics.append("Older demographic")
    
    # Income-based characteristics
    if 'income' in centroid:
        if centroid['income'] < 60000:
            characteristics.append("Lower income bracket")
        elif centroid['income'] < 90000:
            characteristics.append("Medium income bracket")
        else:
            characteristics.append("Higher income bracket")
    
    # Purchase-based characteristics
    if 'purchases' in centroid:
        if centroid['purchases'] < 10:
            characteristics.append("Low purchase frequency")
        elif centroid['purchases'] < 15:
            characteristics.append("Medium purchase frequency")
        else:
            characteristics.append("High purchase frequency")
    
    # Region-based characteristics
    if 'region' in df.columns:
        region_counts = df[df[cluster_col] == centroid['cluster']]['region'].value_counts()
        if not region_counts.empty:
            top_region = region_counts.idxmax()
            characteristics.append(f"Primarily from {top_region} region")
    
    return characteristics

def generate_cluster_name(characteristics):
    """Generate a descriptive name for the cluster"""
    names = [
        "High-Value Customers",
        "Frequent Buyers",
        "New Potentials", 
        "Loyal Base",
        "Premium Segment"
    ]
    
    if any("Higher income" in c for c in characteristics):
        return "Premium Customers"
    elif any("High purchase" in c for c in characteristics):
        return "Frequent Buyers"
    elif any("Younger" in c for c in characteristics):
        return "Emerging Customers"
    else:
        # Return a default name if no specific conditions are met
        import random
        return random.choice(names)

@app.post("/api/analyze")
async def analyze_customer_data(request: AnalysisRequest):
    try:
        # Convert the request data to a pandas DataFrame
        df = pd.DataFrame(request.customerData)
        
        # Keep a copy of original data
        original_df = df.copy()
        
        # Extract numeric and categorical columns
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        numeric_cols = [col for col in numeric_cols if col != 'id']  # Exclude ID
        
        categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
        
        if not numeric_cols:
            raise HTTPException(
                status_code=400, 
                detail="No numeric columns found for clustering"
            )
        
        # Create preprocessing pipeline
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), numeric_cols),
                ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols) if categorical_cols else ('cat', 'passthrough', [])
            ]
        )
        
        # Fit and transform data
        X = df[numeric_cols + categorical_cols] if categorical_cols else df[numeric_cols]
        
        # Determine optimal number of clusters
        n_clusters = determine_optimal_clusters(df[numeric_cols])
        
        # Create KMeans clustering pipeline
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        
        # Fit KMeans on numeric data for simplicity in getting centroids
        kmeans.fit(StandardScaler().fit_transform(df[numeric_cols]))
        
        # Add cluster to original DataFrame
        df['cluster'] = kmeans.labels_
        
        # Calculate feature importance based on cluster assignment
        feature_importance = calculate_feature_importance(
            df[numeric_cols], 
            df['cluster']
        )
        
        # Calculate centroids in original scale
        centroids = []
        for i in range(n_clusters):
            cluster_data = df[df['cluster'] == i]
            
            # Calculate centroid for this cluster
            centroid = {'cluster': i}
            for col in numeric_cols:
                centroid[col] = float(cluster_data[col].mean())
            
            # Generate characteristics for this cluster
            characteristics = generate_cluster_characteristics(df, 'cluster', centroid)
            
            # Generate cluster name
            cluster_name = generate_cluster_name(characteristics)
            
            # Get customers in this cluster
            customers = original_df[df['cluster'] == i].to_dict('records')
            
            centroids.append({
                'clusterId': i,
                'customers': customers,
                'centroid': centroid,
                'clusterName': cluster_name,
                'characteristics': characteristics
            })
        
        # Calculate accuracy (silhouette score)
        X_scaled = StandardScaler().fit_transform(df[numeric_cols])
        accuracy = float(silhouette_score(X_scaled, kmeans.labels_))
        
        # Prepare response
        response = {
            'clusters': centroids,
            'featureImportance': feature_importance,
            'accuracy': accuracy
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommendations")
async def generate_recommendations(request: RecommendationRequest):
    try:
        analysis = request.analysis
        recommendations = []
        
        # Generate recommendations based on clusters
        for cluster in analysis.get('clusters', []):
            cluster_name = cluster.get('clusterName', '')
            characteristics = cluster.get('characteristics', [])
            
            if any("High purchase frequency" in c for c in characteristics):
                recommendations.append(f"Target \"{cluster_name}\" with loyalty programs to maintain their high engagement.")
            
            if any("Higher income bracket" in c for c in characteristics):
                recommendations.append(f"Offer premium products to \"{cluster_name}\" segment to increase their average order value.")
            
            if any("Low purchase frequency" in c for c in characteristics) and any("Medium income bracket" in c for c in characteristics):
                recommendations.append(f"Create targeted promotions for \"{cluster_name}\" to increase their purchase frequency.")
            
            if any("Younger demographic" in c for c in characteristics):
                recommendations.append(f"Use digital channels to engage with \"{cluster_name}\" segment more effectively.")
        
        # Add general recommendations
        recommendations.append("Consider personalizing marketing campaigns based on the identified customer segments.")
        recommendations.append("Review product offerings to ensure they meet the needs of each customer segment.")
        recommendations.append("Develop retention strategies for your high-value customer segments.")
        
        return {"recommendations": recommendations}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
