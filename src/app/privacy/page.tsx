import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-background to-card py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Shield className="h-4 w-4" />
              Privacy Policy
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your Privacy Matters
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Last updated: November 11, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Constant Treasury, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold m-0">Information We Collect</h2>
              </div>
              
              <div className="space-y-6 ml-15">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                  <p className="text-muted-foreground">
                    When you register for an account, we collect:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Full name and contact information (email, phone number)</li>
                    <li>Date of birth and address</li>
                    <li>Government-issued identification (Ghana Card, TIN, BVN)</li>
                    <li>Financial information for transactions</li>
                    <li>Employment information (for corporate accounts)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Usage Information</h3>
                  <p className="text-muted-foreground">
                    We automatically collect information about how you use our platform:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Log data (access times, pages viewed, actions taken)</li>
                    <li>Transaction history and investment preferences</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold m-0">How We Use Your Information</h2>
              </div>
              
              <div className="ml-15">
                <p className="text-muted-foreground mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Create and manage your account</li>
                  <li>Process your investment transactions</li>
                  <li>Verify your identity and comply with KYC/AML regulations</li>
                  <li>Send you transaction confirmations and account updates</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Detect and prevent fraud and security threats</li>
                  <li>Comply with legal obligations and regulatory requirements</li>
                </ul>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold m-0">Information Sharing</h2>
              </div>
              
              <div className="ml-15">
                <p className="text-muted-foreground mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Regulatory Authorities:</strong> Securities and Exchange Commission (SEC), Bank of Ghana (BoG)</li>
                  <li><strong>Service Providers:</strong> Payment processors, KYC verification services, cloud hosting providers</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  We do not sell your personal information to third parties for marketing purposes.
                </p>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold m-0">Data Security</h2>
              </div>
              
              <div className="ml-15">
                <p className="text-muted-foreground mb-4">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>256-bit SSL/TLS encryption for data transmission</li>
                  <li>Encrypted storage of sensitive data</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Multi-factor authentication options</li>
                  <li>Access controls and monitoring systems</li>
                  <li>Employee training on data protection</li>
                </ul>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold m-0">Your Rights</h2>
              </div>
              
              <div className="ml-15">
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Access and review your personal information</li>
                  <li>Request corrections to inaccurate data</li>
                  <li>Request deletion of your account (subject to legal requirements)</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Export your data in a portable format</li>
                  <li>Lodge a complaint with the Data Protection Commission</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  To exercise these rights, contact us at <a href="mailto:privacy@constanttreasury.com" className="text-primary hover:underline">privacy@constanttreasury.com</a>
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Cookies and Tracking</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar technologies to enhance your experience. You can control cookie preferences through your browser settings. 
                Note that disabling cookies may affect platform functionality.
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. 
                Transaction records are maintained for a minimum of 7 years as required by Ghanaian financial regulations.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through a notice on our platform. 
                Your continued use of Constant Treasury after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-muted/50 rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> <a href="mailto:privacy@constanttreasury.com" className="text-primary hover:underline">privacy@constanttreasury.com</a></p>
                <p><strong>Phone:</strong> +233 (0) 30 123 4567</p>
                <p><strong>Address:</strong> Constant Capital Ghana, Accra, Ghana</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
