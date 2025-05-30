
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const LearnMore = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="container py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About Customer Insight</h1>
          
          <div className="prose prose-slate max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Our AI-Powered Analytics Platform</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Customer Insight uses state-of-the-art machine learning algorithms to analyze your customer data
                and provide actionable business intelligence that helps you make informed decisions.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="bg-secondary/30 rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-3">Advanced Segmentation</h3>
                  <p>
                    Our platform uses multiple clustering algorithms to identify natural groupings in your customer base.
                    This allows you to understand different customer types and tailor your strategies accordingly.
                  </p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-3">Predictive Analytics</h3>
                  <p>
                    Utilizing historical data patterns, our system can predict future customer behaviors,
                    helping you anticipate needs and optimize your marketing efforts.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
              <p className="mb-6">
                Our platform makes advanced analytics accessible to businesses of all sizes.
                Here's our simple three-step process:
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Data Upload</h3>
                    <p className="text-muted-foreground">
                      Simply upload your customer data in CSV or Excel format. Our system automatically
                      detects and maps your data fields, making setup quick and easy.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Intelligent Analysis</h3>
                    <p className="text-muted-foreground">
                      Our AI algorithms process your data using multiple analytical methods,
                      including k-means clustering, hierarchical clustering, and RFM analysis,
                      to identify meaningful patterns.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Actionable Insights</h3>
                    <p className="text-muted-foreground">
                      Receive comprehensive, visual reports with clear segment classifications
                      and targeted recommendations for each customer group. Export insights
                      for use in your marketing campaigns and business strategies.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">Benefits for Your Business</h2>
              <ul className="space-y-4">
                <li className="flex gap-2">
                  <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">✓</div>
                  <div>
                    <span className="font-medium">Increased Customer Retention</span>
                    <p className="text-sm text-muted-foreground">
                      Identify at-risk customers before they leave and implement targeted retention strategies.
                    </p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">✓</div>
                  <div>
                    <span className="font-medium">Higher Conversion Rates</span>
                    <p className="text-sm text-muted-foreground">
                      Optimize your marketing messages based on customer segment preferences.
                    </p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">✓</div>
                  <div>
                    <span className="font-medium">Efficient Resource Allocation</span>
                    <p className="text-sm text-muted-foreground">
                      Focus your resources on the most valuable customer segments for maximum ROI.
                    </p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">✓</div>
                  <div>
                    <span className="font-medium">Data-Driven Decision Making</span>
                    <p className="text-sm text-muted-foreground">
                      Replace guesswork with solid data insights for all business decisions.
                    </p>
                  </div>
                </li>
              </ul>
            </section>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link to="/auth">Get Started Today</Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="text-base">
                <Link to="/contact">Contact Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Customer Insight. All rights reserved.
            </p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearnMore;
