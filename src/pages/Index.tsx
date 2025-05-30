
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-primary">Customer Insight</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link to={user ? "/dashboard" : "/auth"} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {user ? "Dashboard" : "Login"}
            </Link>
            {!user && (
              <Button asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-secondary via-background to-secondary/30">
        <div className="container max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Discover Hidden Patterns in Your Customer Data
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Our AI-powered customer segmentation tool helps you classify customers based on behavior, demographics, and more. Upload your data and get actionable insights instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base">
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Go to Dashboard" : "Get Started for Free"}
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-background">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-secondary/30 rounded-lg p-6 shadow-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Upload Data</h3>
              <p className="text-muted-foreground">
                Simply upload your customer data in CSV or Excel format. Our system accepts various data structures.
              </p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-6 shadow-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Analyze</h3>
              <p className="text-muted-foreground">
                Our machine learning algorithms identify patterns and group customers based on multiple attributes.
              </p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-6 shadow-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Get Insights</h3>
              <p className="text-muted-foreground">
                Review visual reports, customer segments, and actionable recommendations tailored for your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Understand Your Customers Better?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join businesses that are leveraging machine learning to make data-driven decisions.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-base">
            <Link to={user ? "/dashboard" : "/auth"}>
              {user ? "Go to Dashboard" : "Start Free Analysis"}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Customer Insight. All rights reserved.
            </p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
