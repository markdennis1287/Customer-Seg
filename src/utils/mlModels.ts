
// ML models utility file
// This is used as a fallback for development when the backend API is not available

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
  rawData?: Customer[];
}

// Simplified k-means clustering algorithm for development fallback
export const kMeansClustering = (
  data: Customer[], 
  k: number = 3
): ClassificationResult => {
  // This is a simplified version of k-means for development purposes
  
  // Get numeric features (excluding id)
  const numericFeatures = Object.keys(data[0] || {}).filter(key => 
    !isNaN(Number(data[0]?.[key])) && key !== 'id'
  );
  
  // Create clusters by simple division
  const chunkSize = Math.ceil(data.length / k);
  const clusters: ClusterResult[] = [];
  
  // Generate cluster names and characteristics
  const clusterNames = [
    "High-Value Customers",
    "Frequent Buyers", 
    "New Potentials",
    "Loyal Base",
    "Premium Segment"
  ];
  
  // Simple clustering logic - divide data into k groups
  for (let i = 0; i < k; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, data.length);
    const clusterCustomers = data.slice(start, end);
    
    // Calculate centroid (average of numeric features)
    const centroid: Record<string, number> = { cluster: i };
    numericFeatures.forEach(feature => {
      let sum = 0;
      clusterCustomers.forEach(customer => {
        sum += Number(customer[feature] || 0);
      });
      centroid[feature] = clusterCustomers.length > 0 
        ? Number((sum / clusterCustomers.length).toFixed(2)) 
        : 0;
    });
    
    // Generate characteristics
    const characteristics: string[] = [];
    if (centroid['age']) {
      if (centroid['age'] < 30) characteristics.push("Younger demographic");
      else if (centroid['age'] < 45) characteristics.push("Middle-aged demographic");
      else characteristics.push("Older demographic");
    }
    
    if (centroid['income']) {
      if (centroid['income'] < 60000) characteristics.push("Lower income bracket");
      else if (centroid['income'] < 90000) characteristics.push("Medium income bracket");
      else characteristics.push("Higher income bracket");
    }
    
    clusters.push({
      clusterId: i,
      customers: clusterCustomers,
      centroid,
      clusterName: clusterNames[i % clusterNames.length],
      characteristics
    });
  }
  
  // Create feature importance
  const featureImportance: Record<string, number> = {};
  numericFeatures.forEach((feature, index) => {
    featureImportance[feature] = Math.max(0.1, 0.9 - (index * 0.15));
  });
  
  return {
    clusters,
    featureImportance,
    accuracy: 0.85,
    rawData: data
  };
};

// Generate recommendations based on cluster analysis
export const getRecommendations = (result: ClassificationResult): string[] => {
  if (!result || !result.clusters || result.clusters.length === 0) {
    return ["No data available to generate recommendations."];
  }

  const recommendations: string[] = [];
  
  // Generate recommendations based on clusters
  result.clusters.forEach(cluster => {
    const { clusterName, characteristics } = cluster;
    
    if (characteristics.includes("High purchase frequency") || characteristics.includes("Frequent Buyers")) {
      recommendations.push(`Target "${clusterName}" with loyalty programs to maintain their high engagement.`);
    }
    
    if (characteristics.includes("Higher income bracket") || characteristics.includes("Premium Segment")) {
      recommendations.push(`Offer premium products to "${clusterName}" segment to increase their average order value.`);
    }
    
    if (characteristics.includes("Younger demographic")) {
      recommendations.push(`Use digital channels to engage with "${clusterName}" segment more effectively.`);
    }
  });
  
  // Add general recommendations
  recommendations.push("Consider personalizing marketing campaigns based on the identified customer segments.");
  recommendations.push("Review product offerings to ensure they meet the needs of each customer segment.");
  
  return recommendations;
};
