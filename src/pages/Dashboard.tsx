
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import DataPreview from "@/components/DataPreview";
import ClassificationResults from "@/components/ClassificationResults";
import AnalysisHistory from "@/components/AnalysisHistory";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { processCustomerData, getSegmentationRecommendations, CustomerData } from "@/services/apiService";
import { getRecommendations } from "@/utils/mlModels";

interface AnalysisRecord {
  id: string;
  date: string;
  fileName: string;
  segments: number;
  customers: number;
  data: any; // Required, not optional
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();
  const { user, saveAnalysis, getUserAnalyses, getAnalysisById } = useAuth();
  
  // Store the history in state so we can update it
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisRecord[]>([]);
  
  // Load analysis history when component mounts
  useEffect(() => {
    if (user) {
      const userAnalyses = getUserAnalyses();
      setAnalysisHistory(userAnalyses);
    }
  }, [user, getUserAnalyses]);

  // Handle file upload and process data
  const handleFileProcessed = (data: CustomerData[]) => {
    setCustomerData(data);
    setFileName(`customer_data_${new Date().toISOString().split('T')[0]}.csv`);
    toast({
      title: "Data loaded successfully",
      description: `${data.length} customer records have been processed.`,
    });
    // Move to the next step
    setActiveTab("preview");
  };

  // Start the classification analysis
  const handleStartAnalysis = async () => {
    try {
      setIsProcessing(true);
      toast({
        title: "Analysis started",
        description: "Processing customer data with ML algorithms...",
      });
      
      // API call to process data
      const result = await processCustomerData(customerData);
      setAnalysisResult(result);
      
      // Generate recommendations
      const recs = await getSegmentationRecommendations(result);
      setRecommendations(recs);
      
      toast({
        title: "Analysis complete",
        description: `Successfully identified ${result.clusters.length} distinct customer segments.`,
      });
      
      // Move to the results tab
      setActiveTab("results");
    } catch (error) {
      console.error('Backend connection error:', error);
      
      // Check if it's a connection error
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        toast({
          title: "Backend not available",
          description: "Using demo mode with mock data. Start the Python backend server for full functionality.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis failed",
          description: error instanceof Error ? error.message : "An error occurred during analysis.",
          variant: "destructive",
        });
      }
      
      // Use fallback to mock data
      console.log('Using fallback mock data for demo purposes');
      try {
        // Import dynamically to avoid bundling in production
        const { kMeansClustering, getRecommendations } = await import("@/utils/mlModels");
        const mockResult = kMeansClustering(customerData, 3);
        const mockRecs = getRecommendations(mockResult);
        
        setAnalysisResult(mockResult);
        setRecommendations(mockRecs);
        setActiveTab("results");
        
        toast({
          title: "Demo analysis complete",
          description: "Using mock clustering algorithm. Connect to backend for advanced ML features.",
        });
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        toast({
          title: "Analysis failed",
          description: "Unable to process data. Please check your data format and try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Save the current analysis to history
  const handleSaveAnalysis = () => {
    if (!analysisResult) return;
    
    const newRecord: AnalysisRecord = {
      id: `analysis_${Date.now()}`,
      date: new Date().toISOString(),
      fileName: fileName,
      segments: analysisResult.clusters.length,
      customers: customerData.length,
      data: analysisResult // Ensure this is always provided
    };
    
    // Save to Auth context which will persist to localStorage
    saveAnalysis(newRecord);
    
    // Update local state
    setAnalysisHistory(prev => [newRecord, ...prev]);
    
    toast({
      title: "Analysis saved",
      description: "You can access this analysis from your history.",
    });
  };

  // View a previous analysis
  const handleViewAnalysis = (id: string) => {
    // Fetch the saved analysis from storage
    const savedAnalysis = getAnalysisById(id);
    
    if (savedAnalysis) {
      // Load the saved analysis data
      setFileName(savedAnalysis.fileName);
      setCustomerData(savedAnalysis.data?.rawData || []);
      setAnalysisResult(savedAnalysis.data);
      
      // Use the imported getRecommendations function
      const recs = getRecommendations(savedAnalysis.data);
      setRecommendations(recs);
      
      toast({
        title: "Analysis loaded",
        description: `Loaded analysis from ${new Date(savedAnalysis.date).toLocaleDateString()}`,
      });
      
      // Switch to results tab to show the analysis
      setActiveTab("results");
    } else {
      toast({
        title: "Analysis not found",
        description: "Could not load the selected analysis.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container py-6">
          <h1 className="text-3xl font-bold mb-6">Customer Segmentation Dashboard</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="upload">Upload Data</TabsTrigger>
              <TabsTrigger value="preview" disabled={customerData.length === 0}>
                Preview & Analyze
              </TabsTrigger>
              <TabsTrigger value="results" disabled={!analysisResult}>
                Results
              </TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <FileUpload onFileProcessed={handleFileProcessed} />
                </div>
                <div className="space-y-6">
                  <div className="bg-secondary/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Supported File Formats</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">✓</span>
                        <div>
                          <span className="font-medium">CSV files</span>
                          <p className="text-sm text-muted-foreground">
                            Comma-separated values with header row
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">✓</span>
                        <div>
                          <span className="font-medium">Excel files (.xlsx, .xls)</span>
                          <p className="text-sm text-muted-foreground">
                            Microsoft Excel spreadsheets with header row
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-secondary/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Required Data Fields</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your data should contain customer information. The more fields you provide, the better the segmentation will be. Here are some recommended fields:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">•</span>
                        <div>
                          <span className="font-medium">Demographics</span>
                          <p className="text-sm text-muted-foreground">
                            Age, gender, location, income
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">•</span>
                        <div>
                          <span className="font-medium">Behavioral</span>
                          <p className="text-sm text-muted-foreground">
                            Purchase frequency, average order value, products viewed/purchased
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">•</span>
                        <div>
                          <span className="font-medium">Engagement</span>
                          <p className="text-sm text-muted-foreground">
                            Website visits, email opens, customer service interactions
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              {customerData.length > 0 && (
                <DataPreview 
                  data={customerData} 
                  onStartAnalysis={handleStartAnalysis} 
                />
              )}
            </TabsContent>
            
            <TabsContent value="results">
              {analysisResult && (
                <ClassificationResults 
                  result={analysisResult} 
                  recommendations={recommendations}
                  onSaveAnalysis={handleSaveAnalysis}
                />
              )}
            </TabsContent>
            
            <TabsContent value="history">
              <AnalysisHistory 
                history={analysisHistory}
                onViewAnalysis={handleViewAnalysis}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
