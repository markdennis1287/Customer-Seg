
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProfileManagement from "@/components/ProfileManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const { user, updateUserSettings } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  const [themePreference, setThemePreference] = useState<"light" | "dark" | "system">(
    (user?.settings?.theme || theme || "system") as "light" | "dark" | "system"
  );
  // Fix the type errors by properly typing the state variables
  const [notifications, setNotifications] = useState<boolean>(user?.settings?.notifications || true);
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean>(user?.settings?.analyticsConsent || false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
  // Apply theme from settings when component loads
  useEffect(() => {
    if (user?.settings?.theme) {
      setTheme(user.settings.theme);
    }
  }, [user?.settings?.theme, setTheme]);
  
  const handleThemeChange = (value: string) => {
    const themeValue = value as "light" | "dark" | "system";
    setThemePreference(themeValue);
    setTheme(themeValue);
    updateUserSettings({ theme: themeValue });
  };
  
  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
    updateUserSettings({ notifications: checked });
  };
  
  const handleAnalyticsChange = (checked: boolean) => {
    setAnalyticsConsent(checked);
    updateUserSettings({ analyticsConsent: checked });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-4xl py-8">
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        
        <Tabs defaultValue="preferences" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="profile">Profile & Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <RadioGroup 
                    value={themePreference} 
                    onValueChange={handleThemeChange}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="cursor-pointer">Light</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="cursor-pointer">Dark</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="cursor-pointer">System Default</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Control how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Enable notifications</Label>
                  <Switch 
                    id="notifications" 
                    checked={notifications} 
                    onCheckedChange={handleNotificationsChange} 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>Manage your privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics">Allow anonymous usage data</Label>
                  <Switch 
                    id="analytics" 
                    checked={analyticsConsent} 
                    onCheckedChange={handleAnalyticsChange} 
                  />
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Usage Data</AlertTitle>
                  <AlertDescription>
                    When enabled, we collect anonymous usage data to help improve our services.
                    No personal information is collected.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <ProfileManagement />
          </TabsContent>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
