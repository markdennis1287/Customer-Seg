
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChartBar, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataPreviewProps {
  data: any[];
  onStartAnalysis: () => void;
}

const DataPreview = ({ data, onStartAnalysis }: DataPreviewProps) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  
  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];
  
  const displayData = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };
  
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  
  // Basic statistics for the data summary
  const getDataSummary = () => {
    if (!data.length) return {};
    
    const numericFields = headers.filter(header => {
      return !isNaN(Number(data[0][header])) && header !== 'id';
    });
    
    const summary: Record<string, { min: number; max: number; avg: number }> = {};
    
    numericFields.forEach(field => {
      const values = data.map(row => Number(row[field]));
      const sum = values.reduce((a, b) => a + b, 0);
      
      summary[field] = {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: parseFloat((sum / values.length).toFixed(2))
      };
    });
    
    return summary;
  };
  
  const dataSummary = getDataSummary();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Data Preview</span>
            <Button 
              onClick={onStartAnalysis} 
              className="flex items-center gap-2"
            >
              <ChartBar className="h-4 w-4" />
              <span>Start Analysis</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header) => (
                    <TableHead key={header} className="font-medium">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((row, index) => (
                  <TableRow key={index}>
                    {headers.map((header) => (
                      <TableCell key={`${index}-${header}`}>
                        {row[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span>Data Summary</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    This is a summary of the numeric values in your dataset showing minimum, maximum, and average values.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(dataSummary).map(([field, stats]) => (
              <Card key={field}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">{field}</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <dl className="grid grid-cols-2 gap-1 text-sm">
                    <dt className="text-muted-foreground">Min:</dt>
                    <dd className="font-medium text-right">{stats.min}</dd>
                    <dt className="text-muted-foreground">Max:</dt>
                    <dd className="font-medium text-right">{stats.max}</dd>
                    <dt className="text-muted-foreground">Average:</dt>
                    <dd className="font-medium text-right">{stats.avg}</dd>
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPreview;
