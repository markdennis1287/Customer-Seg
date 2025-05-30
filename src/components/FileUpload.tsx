import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { CustomerData } from "@/services/apiService";

interface FileUploadProps {
  onFileProcessed: (data: CustomerData[]) => void;
}

const FileUpload = ({ onFileProcessed }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV or Excel file to upload.",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'csv' && fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file (.csv, .xlsx, .xls).",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 50);
      
      // Process the file with real parsing
      const data = await processFile(file);
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been processed with ${data.length} records.`,
      });
      
      // Pass processed data to parent component
      onFileProcessed(data);
      
      // Reset the form
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during file upload.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };
  
  const processFile = async (file: File): Promise<CustomerData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error("Failed to read file data"));
            return;
          }
          
          let parsedData: any[] = [];
          
          if (typeof data === 'string') {
            // CSV file
            const lines = data.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            
            parsedData = lines.slice(1).map((line, index) => {
              if (!line.trim()) return null; // Skip empty lines
              
              const values = line.split(',').map(v => v.trim());
              const row: Record<string, any> = { id: index + 1 };
              
              headers.forEach((header, i) => {
                if (i < values.length) {
                  // Try to convert numeric values
                  const value = values[i];
                  const num = Number(value);
                  row[header] = isNaN(num) ? value : num;
                }
              });
              
              return row;
            }).filter(Boolean) as any[];
          } else {
            // Excel file
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Convert to JSON with headers
            const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const headers = rawData[0] as string[];
            
            parsedData = rawData.slice(1).map((row: any, index) => {
              const dataRow: Record<string, any> = { id: index + 1 };
              
              headers.forEach((header, i) => {
                if (i < row.length) {
                  dataRow[header] = row[i];
                }
              });
              
              return dataRow;
            });
          }
          
          resolve(parsedData);
        } catch (error) {
          reject(new Error(`Error parsing file: ${error instanceof Error ? error.message : String(error)}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      
      // Read the file based on type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'csv') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Customer Data</CardTitle>
        <CardDescription>
          Upload your customer data file in CSV or Excel format.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors ${
              file ? "border-primary/70 bg-primary/5" : "border-muted"
            }`}
            onClick={handleButtonClick}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {file ? file.name : "Drag and drop your file here or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports CSV, XLS, and XLSX files
                </p>
              </div>
            </div>
            <Input 
              id="file-upload"
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".csv,.xls,.xlsx" 
              onChange={handleFileChange}
            />
          </div>
          
          {file && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="file-name" className="text-muted-foreground">Selected file</Label>
                <span className="text-sm">{file.name}</span>
              </div>
              
              {uploading && (
                <div className="space-y-2">
                  <Label htmlFor="upload-progress" className="text-muted-foreground">Upload progress</Label>
                  <Progress value={progress} className="h-2 w-full" />
                </div>
              )}
            </div>
          )}
          
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading} 
            className="w-full"
          >
            {uploading ? "Processing..." : "Upload and Process"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
