import { FileText, AlertCircle, CheckCircle, XCircle, Scale, Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-background to-card py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <FileText className="h-4 w-4" />
              Terms of Service
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Terms of Service
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
                Welcome to Constant Treasury. These Terms of Service ("Terms") govern your access to and use of our platform. 
                By creating an account or using our services, you agree to be bound by these Terms.
              </p>
            </div>

            {/* Acceptance */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold m-0">Acceptance of Terms</h2>
              </div>
              
              <div className="ml-15">
                <p className="text-muted-foreground mb-4">
                  By accessing or using Constant Treasury, you acknowledge that you have read, understood, and agree to be bound by these Terms 
                  and our Privacy Policy. If you do not agree, you must not use our platform.
                </p>
                <p className="text-muted-foreground">
                  These Terms constitute a legally binding agreement between you and Constant Capital Ghana, the operator of Constant Treasury.
                </p>
              </div>
            </div>

            {/* Eligibility */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold m-0">Eligibility</h2>
              </div>
              
              <div className="ml-15">
                <p className="text-muted-foreground mb-4">
                  To use Constant Treasury, you must:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into binding contracts</li>
                  <li>Not be prohibited from using our services under Ghanaian law</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                </ul>
              </div>
            </div>

            {/* Account Registration */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Account Registration and KYC</h2>
              <div className="ml-15">
                <p className="text-muted-foreground mb-4">
                  To invest through Constant Treasury, you must:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Complete our registration process with accurate information</li>
                  <li>Verify your identity through our KYC (Know Your Customer) process</li>
                  <li>Provide valid government-issued identification</li>
                  <li>Maintain up-to-date contact and financial information</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
                </p>
              </div>
            </div>

            {/* Services */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Our Services</h2>
              <div className="ml-15">
                <p className="text-muted-foreground mb-4">
                  Constant Treasury provides:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Access to Ghana government securities (Treasury Bills, Bonds, Notes)</li>
                  <li>Portfolio management and tracking tools</li>
                  <li>Transaction processing and settlement services</li>
                  <li>Market information and investment resources</li>
                  <li>Customer support and account management</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  We act as an intermediary between you and the Bank of Ghana. All securities are issued and backed by the Government of Ghana.
                </p>
              </div>
            </div>

            {/* Investment Risks */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold m-0">Investment Risks and Disclaimers</h2>
              </div>
              
              <div className="ml-15 bg-destructive/5 border border-destructive/20 rounded-lg p-6">
                <p className="text-muted-foreground mb-4">
                  <strong>Important:</strong> While government securities are considered low-risk investments, all investments carry some level of risk.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Past performance does not guarantee future results</li>
                  <li>Interest rates and yields may fluctuate</li>
                  <li>Early redemption may not be available for all securities</li>
                  <li>Currency exchange rates may affect returns for foreign investors</li>
                  <li>We do not provide investment advice or recommendations</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  You are solely responsible for your investment decisions. We recommend consulting with a financial advisor before investing.
                </p>
              </div>
            </div>

            {/* Fees and Charges */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Fees and Charges</h2>
              <div className="ml-15">
                <p className="text-muted-foreground mb-4">
                  Constant Treasury charges the following fees:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Transaction Fee:</strong> 0.5% on purchases (capped at GHS 50)</li>
                  <li><strong>Payment Gateway Fees:</strong> Standard fees apply for mobile money and card transactions</li>
                  <li><strong>No Account Fees:</strong> No opening, maintenance, or withdrawal fees</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  We reserve the right to modify our fee structure with 30 days' notice to users.
                </p>
              </div>
            </div>

            {/* Prohibited Activities */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold m-0">Prohibited Activities</h2>
              </div>
              
              <div className="ml-15">
                <p className="text-muted-foreground mb-4">
                  You may not:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Use the platform for illegal activities or money laundering</li>
                  <li>Provide false or misleading information</li>
                  <li>Share your account credentials with others</li>
                  <li>Attempt to circumvent security measures</li>
                  <li>Use automated systems to access the platform without authorization</li>
                  <li>Interfere with the operation of the platform</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content, trademarks, and intellectual property on Constant Treasury are owned by Constant Capital Ghana or our licensors. 
                You may not copy, modify, distribute, or create derivative works without our written permission.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Account Termination</h2>
              <div className="ml-15">
                <p className="text-muted-foreground mb-4">
                  We may suspend or terminate your account if:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>You violate these Terms</li>
                  <li>You provide false information</li>
                  <li>We suspect fraudulent or illegal activity</li>
                  <li>Required by law or regulatory authorities</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  You may close your account at any time by contacting customer support. Outstanding investments will be settled according to their terms.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold m-0">Limitation of Liability</h2>
              </div>
              
              <div className="ml-15">
                <p className="text-muted-foreground mb-4">
                  To the maximum extent permitted by law:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>We provide the platform "as is" without warranties of any kind</li>
                  <li>We are not liable for investment losses or market fluctuations</li>
                  <li>We are not responsible for third-party services or payment processors</li>
                  <li>Our total liability is limited to the fees you paid in the past 12 months</li>
                  <li>We are not liable for indirect, consequential, or punitive damages</li>
                </ul>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Governing Law and Disputes</h2>
              <p className="text-muted-foreground mb-4">
                These Terms are governed by the laws of Ghana. Any disputes will be resolved through:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Good faith negotiations between the parties</li>
                <li>Mediation, if negotiations fail</li>
                <li>Arbitration or the courts of Ghana, as a last resort</li>
              </ul>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Changes to These Terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms from time to time. Material changes will be communicated via email or platform notification. 
                Your continued use after changes constitutes acceptance of the updated Terms.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-muted/50 rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> <a href="mailto:legal@constanttreasury.com" className="text-primary hover:underline">legal@constanttreasury.com</a></p>
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
