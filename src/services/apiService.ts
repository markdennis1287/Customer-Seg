
// API Service for communicating with the Python ML backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Types for API requests and responses
export interface CustomerData {
  id: number;
  [key: string]: any;
}

export interface AnalysisRequest {
  customerData: CustomerData[];
}

export interface ClusterData {
  clusterId: number;
  customers: CustomerData[];
  centroid: Record<string, number>;
  clusterName: string;
  characteristics: string[];
}

export interface AnalysisResponse {
  clusters: ClusterData[];
  featureImportance: Record<string, number>;
  accuracy: number;
}

/**
 * Process customer data through the ML backend to generate segmentation analysis
 */
export const processCustomerData = async (data: CustomerData[]): Promise<AnalysisResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerData: data }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing customer data:', error);
    throw new Error('Failed to process data. Please try again or check backend connectivity.');
  }
};

/**
 * Get recommendations based on analysis results
 */
export const getSegmentationRecommendations = async (analysisData: AnalysisResponse): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ analysis: analysisData }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw new Error('Failed to get recommendations. Please try again.');
  }
};

