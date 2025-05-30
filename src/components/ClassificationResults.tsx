
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Save } from "lucide-react";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

interface ClusterResult {
  clusterId: number;
  customers: any[];
  centroid: Record<string, number>;
  clusterName: string;
  characteristics: string[];
}

interface ClassificationResultProps {
  result: {
    clusters: ClusterResult[];
    featureImportance: Record<string, number>;
    accuracy: number;
  };
  recommendations: string[];
  onSaveAnalysis: () => void;
}

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe",
  "#00C49F", "#FFBB28", "#FF8042", "#a4de6c"
];

const ClassificationResults = ({ result, recommendations, onSaveAnalysis }: ClassificationResultProps) => {
  const [activeTab, setActiveTab] = useState("clusters");

  const { clusters, featureImportance, accuracy } = result;

  // Prepare data for cluster size chart
  const clusterSizeData = clusters.map((cluster) => ({
    name: cluster.clusterName,
    value: cluster.customers.length
  }));

  // Prepare data for feature importance chart
  const featureImportanceData = Object.entries(featureImportance).map(
    ([feature, importance]) => ({
      feature,
      importance: importance * 100 // Convert to percentage
    })
  ).sort((a, b) => b.importance - a.importance);

  // Download result as JSON
  const handleDownload = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `customer-segments-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Analysis Results</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button onClick={onSaveAnalysis} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            <span>Save Analysis</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {Math.round(accuracy * 100)}%
                </span>
              </div>
              <Progress value={accuracy * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Segments Identified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clusters.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customers Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {clusters.reduce((sum, cluster) => sum + cluster.customers.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="clusters">Customer Segments</TabsTrigger>
          <TabsTrigger value="features">Feature Importance</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clusters" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Segment Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clusterSizeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {clusterSizeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} customers`, "Size"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Segment Averages</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={clusters.map((cluster) => ({
                        name: cluster.clusterName,
                        ...cluster.centroid,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {Object.keys(clusters[0]?.centroid || {}).map((key, index) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {clusters.map((cluster) => (
              <Card key={cluster.clusterId}>
                <CardHeader>
                  <CardTitle>{cluster.clusterName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Characteristics:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {cluster.characteristics.map((char, index) => (
                          <li key={index} className="text-muted-foreground">
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Average Values:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(cluster.centroid).map(([key, value]) => (
                          <div key={key} className="bg-secondary/30 p-3 rounded-md">
                            <div className="text-sm font-medium">{key}</div>
                            <div className="text-2xl font-bold">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">
                        Customers in this segment: {cluster.customers.length}
                      </h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Importance</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={featureImportanceData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} unit="%" />
                    <YAxis dataKey="feature" type="category" width={100} />
                    <Tooltip formatter={(value) => {
                      // Fix: Check if value is a number before calling toFixed()
                      const formattedValue = typeof value === 'number' ? `${value.toFixed(1)}%` : `${value}%`;
                      return [formattedValue, "Importance"];
                    }} />
                    <Legend />
                    <Bar dataKey="importance" fill="#8884d8" name="Importance" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">What does feature importance mean?</h3>
                <p className="text-muted-foreground">
                  Feature importance indicates how much each attribute contributed to the customer segmentation. 
                  Higher percentages mean the feature had a stronger influence on determining the customer segments. 
                  This insight can help you understand what factors most significantly differentiate your customer groups.
                </p>
                
                <div className="bg-secondary/30 p-4 rounded-md">
                  <h4 className="font-medium">Key insights:</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>
                      <span className="font-medium">{featureImportanceData[0]?.feature}</span> is the most 
                      influential factor in your customer segmentation.
                    </li>
                    {featureImportanceData.length > 1 && (
                      <li>
                        <span className="font-medium">{featureImportanceData[1]?.feature}</span> also 
                        plays a significant role in customer differentiation.
                      </li>
                    )}
                    {featureImportanceData.length > 2 && featureImportanceData[featureImportanceData.length - 1].importance < 20 && (
                      <li>
                        <span className="font-medium">{featureImportanceData[featureImportanceData.length - 1]?.feature}</span> has 
                        relatively low importance and might not be critical for segmentation.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-md">
                  <p className="italic text-muted-foreground">
                    These recommendations are generated based on the identified customer segments and their characteristics. 
                    They are intended to provide actionable insights for your business strategy.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <div 
                      key={index} 
                      className="bg-secondary/30 p-4 rounded-md border-l-4 border-primary"
                    >
                      <p>{recommendation}</p>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Review and validate</span> these segments with your team to ensure they align with your business understanding.
                    </li>
                    <li>
                      <span className="font-medium">Develop targeted strategies</span> for each customer segment based on their unique characteristics.
                    </li>
                    <li>
                      <span className="font-medium">Monitor performance</span> of initiatives tailored to each segment to measure effectiveness.
                    </li>
                    <li>
                      <span className="font-medium">Re-run the analysis</span> periodically to track how segments evolve over time.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassificationResults;
