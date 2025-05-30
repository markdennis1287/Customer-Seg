import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Content */}
      <div className="container py-12 flex-1">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Last updated: May 10, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                At Customer Insight, we respect your privacy and are committed to protecting the personal data of our users. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
              </p>
              <p>
                By using our service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Information Collection</h2>
              <p className="mb-4">
                We collect several different types of information for various purposes to provide and improve our service to you:
              </p>
              <h3 className="text-xl font-medium mb-2">Personal Data</h3>
              <p className="mb-4">
                While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>Email address</li>
                <li>First name and last name</li>
                <li>Phone number</li>
                <li>Cookies and Usage Data</li>
              </ul>

              <h3 className="text-xl font-medium mb-2">Customer Data</h3>
              <p className="mb-4">
                Our service allows you to upload customer data for analysis. You maintain ownership of this data, and we process it only as instructed by you and in accordance with our Terms of Service.
              </p>

              <h3 className="text-xl font-medium mb-2">Usage Data</h3>
              <p>
                We may also collect information on how the service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Use of Data</h2>
              <p className="mb-4">Customer Insight uses the collected data for various purposes:</p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To analyze and improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent, and address technical issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="mb-4">
                The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Analytics</h2>
              <p className="mb-4">
                We may use third-party service providers to monitor and analyze the use of our service.
              </p>
              <h3 className="text-xl font-medium mb-2">Google Analytics</h3>
              <p>
                Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our service. This data may be shared with other Google services. Google may use the collected data to contextualize and personalize the ads of its own advertising network.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
              <p className="mb-4">
                You have the following data protection rights:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>The right to access, update or delete the information we have on you.</li>
                <li>The right of rectification - You have the right to have your information rectified if that information is inaccurate or incomplete.</li>
                <li>The right to object - You have the right to object to our processing of your Personal Data.</li>
                <li>The right of restriction - You have the right to request that we restrict the processing of your personal information.</li>
                <li>The right to data portability - You have the right to be provided with a copy of the information we have on you in a structured, machine-readable, and commonly used format.</li>
                <li>The right to withdraw consent - You also have the right to withdraw your consent at any time.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>
          </div>
        </div>
      </div>

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
              <Link to="/privacy" className="text-sm text-foreground hover:underline">
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

export default Privacy;
