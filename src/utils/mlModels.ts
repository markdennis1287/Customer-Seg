
// Machine Learning Models for Customer Segmentation
// This is a simplified implementation for frontend development
// Real ML would happen on a backend

import { CustomerData } from "@/services/apiService";

/**
 * Simple K-means clustering implementation for customer segmentation
 */
export const kMeansClustering = (data: CustomerData[], k: number = 3) => {
  console.log("Running k-means clustering on", data.length, "customers with k =", k);
  
  // This is a mock implementation
  // In a real app, this would be handled by a backend ML service
  
  // Extract numeric features
  const numericFeatures = extractNumericFeatures(data);
  
  // Create mock clusters (in real implementation, this would use an actual clustering algorithm)
  const clusters = Array(k).fill(null).map((_, i) => {
    // Distribute data somewhat evenly between clusters for the mock
    const clusterCustomers = data.filter((_, idx) => idx % k === i);
    
    return {
      clusterId: i + 1,
      clusterName: `Segment ${i + 1}`,
      customers: clusterCustomers,
      centroid: calculateMockCentroid(clusterCustomers, numericFeatures),
      characteristics: generateMockCharacteristics(i)
    };
  });
  
  return {
    clusters,
    featureImportance: generateMockFeatureImportance(numericFeatures),
    accuracy: 0.87,
    rawData: data
  };
};

/**
 * Generate recommendations based on clustering results
 */
export const getRecommendations = (clusteringResult: any): string[] => {
  const { clusters } = clusteringResult;
  
  // Mock recommendations based on clusters
  const recommendations = [
    `Focus marketing efforts on Segment ${clusters[0].clusterId} which represents your highest value customers.`,
    `Consider a retention campaign for Segment ${clusters[1].clusterId} to increase customer loyalty.`,
    `Develop targeted promotions for Segment ${clusters[2].clusterId} to increase purchase frequency.`,
    `The most important customer differentiator is purchase frequency, followed by average order value.`,
    `Email campaigns should be personalized based on the segment characteristics for maximum engagement.`
  ];
  
  return recommendations;
};

// Helper functions for the mock implementation
const extractNumericFeatures = (data: CustomerData[]) => {
  const features: string[] = [];
  
  // Find all numeric fields across all records
  if (data.length) {
    const firstRecord = data[0];
    Object.keys(firstRecord).forEach(key => {
      // Check if the field is numeric in the first record
      if (typeof firstRecord[key] === 'number' && key !== 'id') {
        features.push(key);
      }
    });
  }
  
  return features;
};

const calculateMockCentroid = (customers: CustomerData[], features: string[]) => {
  const centroid: Record<string, number> = {};
  
  features.forEach(feature => {
    const values = customers
      .map(c => c[feature])
      .filter(v => typeof v === 'number');
    
    if (values.length) {
      centroid[feature] = values.reduce((sum, val) => sum + (val as number), 0) / values.length;
      // Round to 2 decimal places for display purposes
      centroid[feature] = Math.round(centroid[feature] * 100) / 100;
    } else {
      centroid[feature] = 0;
    }
  });
  
  return centroid;
};

const generateMockFeatureImportance = (features: string[]) => {
  const importance: Record<string, number> = {};
  let totalWeight = 100;
  
  features.forEach((feature, index) => {
    // Distribute importance with decreasing weights
    const weight = totalWeight / (index + 1);
    importance[feature] = Math.min(Math.round(weight), totalWeight);
    totalWeight -= importance[feature];
  });
  
  return importance;
};

const generateMockCharacteristics = (clusterIndex: number) => {
  const characteristicsSets = [
    [
      "High purchase frequency",
      "High average order value",
      "Frequent site visitors",
      "Responsive to email campaigns"
    ],
    [
      "Moderate purchase frequency",
      "Price-sensitive shoppers",
      "Weekend shoppers", 
      "Social media engaged"
    ],
    [
      "Low purchase frequency",
      "New customers",
      "Mobile app users",
      "Promotional buyers"
    ]
  ];
  
  return characteristicsSets[clusterIndex % characteristicsSets.length];
};
