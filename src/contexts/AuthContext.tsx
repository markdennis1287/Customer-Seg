
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  settings?: UserSettings;
}

interface UserSettings {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  analyticsConsent: boolean;
}

// New interface for analysis history
interface AnalysisRecord {
  id: string;
  date: string;
  fileName: string;
  segments: number;
  customers: number;
  userId: string;  // Associate with user
  data: any;       // Store the analysis data
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateUserProfile: (profile: Partial<{ name: string, profileImage: string }>) => Promise<void>;
  updateUserEmail: (newEmail: string, password: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  saveAnalysis: (analysis: Omit<AnalysisRecord, "userId">) => void;
  getUserAnalyses: () => AnalysisRecord[];
  getAnalysisById: (id: string) => AnalysisRecord | undefined;
}

// In-memory "database" to simulate user storage
const USERS_STORAGE_KEY = "customer_insight_users";
const USER_KEY = "customer_insight_user";
const ANALYSES_STORAGE_KEY = "customer_insight_analyses";

// Helper function to get stored users
const getStoredUsers = (): Record<string, { 
  email: string; 
  name: string; 
  password: string; 
  profileImage?: string;
  settings?: UserSettings 
}> => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  return storedUsers ? JSON.parse(storedUsers) : {};
};

// Helper function to get stored analyses
const getStoredAnalyses = (): AnalysisRecord[] => {
  const storedAnalyses = localStorage.getItem(ANALYSES_STORAGE_KEY);
  return storedAnalyses ? JSON.parse(storedAnalyses) : [];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function with better validation
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Check if user exists in our "database"
      const users = getStoredUsers();
      const userRecord = Object.values(users).find(user => user.email === email);
      
      if (!userRecord) {
        toast({
          title: "Account not found",
          description: "No account exists with this email. Please check your email or register.",
          variant: "destructive",
          duration: 5000,
        });
        throw new Error("Account not found");
      }

      // Validate password (simple check for demo purposes)
      if (userRecord.password !== password) {
        toast({
          title: "Invalid credentials",
          description: "The password you entered is incorrect.",
          variant: "destructive",
          duration: 5000,
        });
        throw new Error("Invalid password");
      }

      // Create user object
      const loggedInUser = {
        id: email.replace(/[^a-zA-Z0-9]/g, '_'),
        email,
        name: userRecord.name,
        profileImage: userRecord.profileImage,
        settings: userRecord.settings || {
          theme: "system",
          notifications: true,
          analyticsConsent: false
        }
      };

      // Store user in localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      
      toast({
        title: "Welcome back!",
        description: `You've successfully logged in as ${userRecord.name}.`,
        duration: 3000,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!name || !email || !password) {
        throw new Error("Name, email and password are required");
      }

      // Check if user already exists
      const users = getStoredUsers();
      if (Object.values(users).some(user => user.email === email)) {
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Try logging in instead.",
          variant: "destructive",
          duration: 5000,
        });
        throw new Error("Email already in use");
      }

      // Default user settings
      const defaultSettings: UserSettings = {
        theme: "system",
        notifications: true,
        analyticsConsent: false
      };

      // Store new user in our "database"
      users[email] = { email, name, password, settings: defaultSettings };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      // Create user object
      const newUser = {
        id: email.replace(/[^a-zA-Z0-9]/g, '_'),
        email,
        name,
        settings: defaultSettings
      };

      // Store user in localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
        duration: 3000,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
      duration: 3000,
    });
  };

  // Function to update user settings
  const updateUserSettings = (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    // Update user settings
    const updatedUser = {
      ...user,
      settings: {
        ...user.settings,
        ...newSettings
      }
    };

    // Update localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    // Update users "database"
    const users = getStoredUsers();
    if (users[user.email]) {
      users[user.email] = {
        ...users[user.email],
        settings: updatedUser.settings
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    // Update state
    setUser(updatedUser);
    
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved.",
      duration: 3000,
    });
  };

  // New function to update user profile
  const updateUserProfile = async (
    profile: Partial<{ name: string, profileImage: string }>
  ) => {
    if (!user) throw new Error("User not authenticated");

    // Update user profile
    const updatedUser = {
      ...user,
      ...profile
    };

    // Update localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    // Update users "database"
    const users = getStoredUsers();
    if (users[user.email]) {
      users[user.email] = {
        ...users[user.email],
        ...profile
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    // Update state
    setUser(updatedUser);

    return Promise.resolve();
  };

  // New function to update user email
  const updateUserEmail = async (newEmail: string, password: string) => {
    if (!user) throw new Error("User not authenticated");
    
    // Verify password
    const users = getStoredUsers();
    if (users[user.email]?.password !== password) {
      throw new Error("Current password is incorrect");
    }
    
    // Check if new email is already in use
    if (users[newEmail]) {
      throw new Error("Email is already in use");
    }
    
    // Create a copy of the user data
    const userData = { ...users[user.email] };
    
    // Delete the old record
    delete users[user.email];
    
    // Create a new record with the updated email
    users[newEmail] = userData;
    
    // Update the user's ID
    const updatedUser = {
      ...user,
      id: newEmail.replace(/[^a-zA-Z0-9]/g, '_'),
      email: newEmail
    };
    
    // Update localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    // Update analyses to match the new user ID
    const analyses = getStoredAnalyses();
    const updatedAnalyses = analyses.map(analysis => 
      analysis.userId === user.id ? { ...analysis, userId: updatedUser.id } : analysis
    );
    localStorage.setItem(ANALYSES_STORAGE_KEY, JSON.stringify(updatedAnalyses));
    
    // Update state
    setUser(updatedUser);
    
    return Promise.resolve();
  };

  // New function to update user password
  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error("User not authenticated");
    
    // Verify current password
    const users = getStoredUsers();
    if (users[user.email]?.password !== currentPassword) {
      throw new Error("Current password is incorrect");
    }
    
    // Update the password
    users[user.email].password = newPassword;
    
    // Save to localStorage
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    return Promise.resolve();
  };

  // Function to save an analysis
  const saveAnalysis = (analysis: Omit<AnalysisRecord, "userId">) => {
    if (!user) return;
    
    // Get existing analyses
    const analyses = getStoredAnalyses();
    
    // Add the new analysis with user ID
    const newAnalysis = {
      ...analysis,
      userId: user.id
    };
    
    // Check if analysis with this ID already exists
    const existingIndex = analyses.findIndex(a => a.id === analysis.id);
    
    if (existingIndex >= 0) {
      // Update existing analysis
      analyses[existingIndex] = newAnalysis;
    } else {
      // Add new analysis
      analyses.push(newAnalysis);
    }
    
    // Save to localStorage
    localStorage.setItem(ANALYSES_STORAGE_KEY, JSON.stringify(analyses));
    
    toast({
      title: "Analysis saved",
      description: "Your analysis has been saved to your history.",
      duration: 3000,
    });
  };

  // Function to get user's analyses
  const getUserAnalyses = () => {
    if (!user) return [];
    
    const analyses = getStoredAnalyses();
    return analyses.filter(analysis => analysis.userId === user.id);
  };

  // Function to get a specific analysis by ID
  const getAnalysisById = (id: string) => {
    const analyses = getStoredAnalyses();
    return analyses.find(analysis => analysis.id === id);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      error,
      updateUserSettings,
      updateUserProfile,
      updateUserEmail,
      updateUserPassword,
      saveAnalysis,
      getUserAnalyses,
      getAnalysisById
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
