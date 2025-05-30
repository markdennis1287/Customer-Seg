import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartBar, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface AnalysisRecord {
  id: string;
  date: string;
  fileName: string;
  segments: number;
  customers: number;
  data: any; // Updated to match Dashboard.tsx and AuthContext expectations
}

interface AnalysisHistoryProps {
  history?: AnalysisRecord[];
  onViewAnalysis: (id: string) => void;
}

const AnalysisHistory = ({ history: propHistory, onViewAnalysis }: AnalysisHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { getUserAnalyses } = useAuth();
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  
  // Load analyses from Auth context whenever component mounts or propHistory changes
  useEffect(() => {
    if (propHistory) {
      setHistory(propHistory);
    } else {
      const userAnalyses = getUserAnalyses();
      console.log("Loaded user analyses:", userAnalyses);
      setHistory(userAnalyses);
    }
  }, [propHistory, getUserAnalyses]);
  
  const filteredHistory = history.filter(
    record => record.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Analysis History</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by file name..."
            className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">No analysis history yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchTerm ? "No results found. Try a different search term." : "Upload a customer data file and run an analysis to see your history here."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((record) => (
              <div 
                key={record.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <ChartBar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{record.fileName}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(record.date)}</span>
                      <span>•</span>
                      <Badge variant="outline">{record.segments} segments</Badge>
                      <Badge variant="outline">{record.customers} customers</Badge>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewAnalysis(record.id)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisHistory;
