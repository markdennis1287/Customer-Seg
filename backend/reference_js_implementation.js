
// This file contains the logic for machine learning models
// In a real app, these would use proper ML libraries like TensorFlow.js or similar
// For this MVP, we'll simulate ML algorithms with simplified logic

interface Customer {
  id: number;
  [key: string]: any;
}

interface ClusterResult {
  clusterId: number;
  customers: Customer[];
  centroid: Record<string, number>;
  clusterName: string;
  characteristics: string[];
}

interface ClassificationResult {
  clusters: ClusterResult[];
  featureImportance: Record<string, number>;
  accuracy: number;
}

// Simplified k-means clustering algorithm
export const kMeansClustering = (
  data: Customer[], 
  k: number = 3, 
  iterations: number = 10
): ClassificationResult => {
  // In a real app, this would be an actual implementation of k-means
  // For now, we'll create a simplified version
  
  // 1. Get numeric features only
  const numericFeatures = Object.keys(data[0]).filter(key => 
    !isNaN(Number(data[0][key])) && key !== 'id'
  );
  
  // 2. Normalize data (simplified)
  const normalizedData = data.map(customer => {
    const normalized: Record<string, any> = { id: customer.id };
    
    numericFeatures.forEach(feature => {
      normalized[feature] = Number(customer[feature]);
    });
    
    // Include non-numeric features
    Object.keys(customer).forEach(key => {
      if (!numericFeatures.includes(key) && key !== 'id') {
        normalized[key] = customer[key];
      }
    });
    
    return normalized as Customer; // Explicitly cast to Customer
  });
  
  // 3. Simulate clustering (in real app, we'd actually run k-means)
  // Here we're just dividing the data into k groups based on a simple metric
  const sortFeature = numericFeatures[0] || 'age'; // fallback to age if available
  const sortedData = [...normalizedData].sort((a, b) => a[sortFeature] - b[sortFeature]);
  
  const chunkSize = Math.ceil(sortedData.length / k);
  const clusters: ClusterResult[] = [];
  
  // Generate cluster names and characteristics based on the data
  const getClusterName = (clusterId: number, centroid: Record<string, number>): string => {
    const names = [
      "High-Value Customers",
      "Frequent Buyers",
      "New Potentials",
      "Loyal Base",
      "Premium Segment"
    ];
    return names[clusterId % names.length];
  };
  
  const getCharacteristics = (customers: Customer[], centroid: Record<string, number>): string[] => {
    const characteristics: string[] = [];
    
    // Age-based characteristics
    if (centroid.age) {
      if (centroid.age < 30) characteristics.push("Younger demographic");
      else if (centroid.age < 45) characteristics.push("Middle-aged demographic");
      else characteristics.push("Older demographic");
    }
    
    // Income-based characteristics
    if (centroid.income) {
      if (centroid.income < 60000) characteristics.push("Lower income bracket");
      else if (centroid.income < 90000) characteristics.push("Medium income bracket");
      else characteristics.push("Higher income bracket");
    }
    
    // Purchase-based characteristics
    if (centroid.purchases) {
      if (centroid.purchases < 10) characteristics.push("Low purchase frequency");
      else if (centroid.purchases < 15) characteristics.push("Medium purchase frequency");
      else characteristics.push("High purchase frequency");
    }
    
    // Region-based characteristics if present
    if (customers[0].region) {
      const regionCounts: Record<string, number> = {};
      customers.forEach(customer => {
        regionCounts[customer.region] = (regionCounts[customer.region] || 0) + 1;
      });
      
      const topRegion = Object.entries(regionCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
        
      characteristics.push(`Primarily from ${topRegion} region`);
    }
    
    return characteristics;
  };
  
  // Create clusters
  for (let i = 0; i < k; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, sortedData.length);
    const clusterCustomers = sortedData.slice(start, end);
    
    // Calculate centroid (average of numeric features)
    const centroid: Record<string, number> = {};
    numericFeatures.forEach(feature => {
      const sum = clusterCustomers.reduce((acc, customer) => acc + customer[feature], 0);
      centroid[feature] = parseFloat((sum / clusterCustomers.length).toFixed(2));
    });
    
    const clusterName = getClusterName(i, centroid);
    const characteristics = getCharacteristics(clusterCustomers, centroid);
    
    clusters.push({
      clusterId: i,
      customers: clusterCustomers,
      centroid,
      clusterName,
      characteristics
    });
  }
  
  // Calculate simulated feature importance
  const featureImportance: Record<string, number> = {};
  numericFeatures.forEach((feature, index) => {
    // Simulate different importance levels
    featureImportance[feature] = parseFloat((0.9 - (index * 0.15)).toFixed(2));
    if (featureImportance[feature] < 0.1) featureImportance[feature] = 0.1;
  });
  
  return {
    clusters,
    featureImportance,
    accuracy: 0.85 // Simulated accuracy
  };
};

// Function to get recommendations based on clusters
export const getRecommendations = (result: ClassificationResult): string[] => {
  const recommendations: string[] = [];
  
  // Generate recommendations based on clusters
  result.clusters.forEach(cluster => {
    const { clusterName, characteristics, customers } = cluster;
    
    if (characteristics.includes("High purchase frequency")) {
      recommendations.push(`Target "${clusterName}" with loyalty programs to maintain their high engagement.`);
    }
    
    if (characteristics.includes("Higher income bracket")) {
      recommendations.push(`Offer premium products to "${clusterName}" segment to increase their average order value.`);
    }
    
    if (characteristics.includes("Low purchase frequency") && characteristics.includes("Medium income bracket")) {
      recommendations.push(`Create targeted promotions for "${clusterName}" to increase their purchase frequency.`);
    }
    
    if (characteristics.includes("Younger demographic")) {
      recommendations.push(`Use digital channels to engage with "${clusterName}" segment more effectively.`);
    }
  });
  
  // Add general recommendations
  recommendations.push("Consider personalizing marketing campaigns based on the identified customer segments.");
  recommendations.push("Review product offerings to ensure they meet the needs of each customer segment.");
  recommendations.push("Develop retention strategies for your high-value customer segments.");
  
  return recommendations;
};
