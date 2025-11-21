'use client';

import * as React from 'react';
import { Search, ChevronDown, MessageCircle, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const categories = [
    {
      name: 'Getting Started',
      faqs: [
        {
          question: 'What is Constant Treasury?',
          answer: 'Constant Treasury is Ghana\'s premier digital platform for government securities trading and investment. We provide secure access to Treasury Bills, Bonds, and other government-backed securities, making it easy for Ghanaians and the diaspora to invest and build wealth.'
        },
        {
          question: 'How do I open an account?',
          answer: 'Opening an account is simple: Click "Open Account" in the top right corner, choose your account type (Individual, Joint, or Corporate), provide your personal information, create a secure password, and verify your identity with your Ghana Card or valid ID. Account verification typically takes 24-48 hours.'
        },
        {
          question: 'What documents do I need to register?',
          answer: 'For Individual accounts: Ghana Card or valid government-issued ID, proof of address (utility bill or bank statement), and a passport photo. For Corporate accounts: Certificate of Incorporation, TIN certificate, directors\' IDs, and company resolution authorizing securities trading.'
        },
        {
          question: 'Is my information secure?',
          answer: 'Yes, absolutely. We use bank-level 256-bit SSL encryption, two-factor authentication (2FA), and comply with SEC Ghana regulations. Your personal and financial data is protected with industry-leading security measures.'
        },
        {
          question: 'Can diaspora Ghanaians invest?',
          answer: 'Yes! Constant Treasury is designed for both local and diaspora investors. You can open an account and invest from anywhere in the world. We support international payment methods and provide full access to Ghana\'s government securities market.'
        }
      ]
    },
    {
      name: 'Investments & Securities',
      faqs: [
        {
          question: 'What is the minimum investment amount?',
          answer: 'You can start investing with as little as ₵100 in Treasury Bills. Different securities have different minimum amounts: 91-Day T-Bills (₵100), 182-Day T-Bills (₵100), 364-Day T-Bills (₵100), and Government Bonds typically start at ₵1,000.'
        },
        {
          question: 'What types of securities can I invest in?',
          answer: 'We offer: Treasury Bills (91-day, 182-day, 364-day), Government Bonds (2-year, 5-year, 10-year, 15-year), and Savings Bonds. Each security type has different yields, tenors, and risk profiles to match your investment goals.'
        },
        {
          question: 'How do I earn returns on my investments?',
          answer: 'Treasury Bills are sold at a discount and mature at face value - the difference is your return. Bonds pay periodic interest (coupon payments) semi-annually or annually, plus return your principal at maturity. All returns are credited directly to your account.'
        },
        {
          question: 'Are my investments guaranteed?',
          answer: 'Yes. All securities on Constant Treasury are backed by the Government of Ghana and regulated by the Securities and Exchange Commission (SEC). Government securities are considered the safest investment class in Ghana.'
        },
        {
          question: 'Can I sell my securities before maturity?',
          answer: 'Yes, through the secondary market. While Treasury Bills and Bonds have fixed maturity dates, you can sell them on the Ghana Stock Exchange (GSE) secondary market before maturity, subject to market conditions and liquidity.'
        },
        {
          question: 'What are the current interest rates?',
          answer: 'Interest rates vary based on security type and market conditions. Current rates: 91-Day T-Bills (~24-26%), 182-Day T-Bills (~25-27%), 364-Day T-Bills (~26-28%), and Government Bonds (22-25% depending on tenor). Check the Securities page for real-time rates.'
        }
      ]
    },
    {
      name: 'Account & Transactions',
      faqs: [
        {
          question: 'How long does account verification take?',
          answer: 'Standard verification takes 24-48 hours after submitting all required documents. You\'ll receive an email notification once your account is verified and ready to trade. Express verification (within 4 hours) is available for premium accounts.'
        },
        {
          question: 'How do I fund my account?',
          answer: 'You can fund your account via: Mobile Money (MTN, Vodafone, AirtelTigo), Bank Transfer (all major Ghanaian banks), Debit/Credit Card, or International Wire Transfer for diaspora investors. Funds typically reflect within 5-30 minutes.'
        },
        {
          question: 'Are there any fees?',
          answer: 'Constant Treasury charges no account opening fees, no monthly maintenance fees, and no withdrawal fees. Transaction fees: 0.5% on purchases (capped at ₵50), and standard payment gateway fees apply for mobile money and card transactions.'
        },
        {
          question: 'How do I withdraw my funds?',
          answer: 'Withdrawals are processed to your linked bank account or mobile money wallet. Go to Portfolio → Withdraw, enter the amount, and confirm. Withdrawals are processed within 24 hours on business days.'
        },
        {
          question: 'Can I have multiple portfolios?',
          answer: 'Yes. You can create separate portfolios for different investment goals (e.g., retirement, education, emergency fund). Each portfolio can hold different securities and be managed independently within your account.'
        },
        {
          question: 'What happens when my investment matures?',
          answer: 'At maturity, your principal plus interest is automatically credited to your Constant Treasury account. You\'ll receive an email notification and can choose to: withdraw the funds, reinvest in the same security, or invest in a different security.'
        }
      ]
    },
    {
      name: 'Trading & Orders',
      faqs: [
        {
          question: 'How do I place an order?',
          answer: 'Navigate to Securities → Browse available securities → Select the security you want → Enter investment amount → Review details → Confirm purchase. Your order will be processed immediately if funds are available.'
        },
        {
          question: 'What is the auction process?',
          answer: 'Treasury Bills and some Bonds are issued through competitive auctions held by the Bank of Ghana (BoG). You can place bids through Constant Treasury before the auction deadline. Successful bids are allocated based on yield and amount.'
        },
        {
          question: 'Can I cancel an order?',
          answer: 'Orders can be cancelled before they are executed. For auction bids, you can cancel up to 2 hours before the auction closes. Once an order is executed or an auction is settled, it cannot be cancelled.'
        },
        {
          question: 'What is the settlement period?',
          answer: 'Treasury Bills: T+1 (settlement 1 business day after purchase). Government Bonds: T+2 or T+3 depending on the bond type. You\'ll receive a settlement confirmation email once the transaction is complete.'
        },
        {
          question: 'How do I track my investments?',
          answer: 'Your Portfolio dashboard shows: current holdings, performance charts, maturity dates, expected returns, transaction history, and real-time portfolio value. You can also download detailed statements and reports.'
        }
      ]
    },
    {
      name: 'Security & Compliance',
      faqs: [
        {
          question: 'Is Constant Treasury regulated?',
          answer: 'Yes. We are licensed and regulated by the Securities and Exchange Commission (SEC) of Ghana. We also work closely with the Bank of Ghana (BoG) and the Ghana Stock Exchange (GSE) to ensure full compliance with all financial regulations.'
        },
        {
          question: 'How is my money protected?',
          answer: 'Your funds are held in segregated trust accounts with licensed custodian banks, separate from company operating accounts. All securities are registered in your name with the Central Securities Depository (CSD). We do not use client funds for company operations.'
        },
        {
          question: 'What is two-factor authentication (2FA)?',
          answer: '2FA adds an extra layer of security by requiring a verification code (sent via SMS or email) in addition to your password when logging in. We highly recommend enabling 2FA in your account settings for maximum security.'
        },
        {
          question: 'What should I do if I suspect fraud?',
          answer: 'Immediately: Change your password, enable 2FA, contact our security team at security@constantcap.com.gh or call +233 302 500 300. We have 24/7 fraud monitoring and will investigate any suspicious activity.'
        },
        {
          question: 'Are my transactions audited?',
          answer: 'Yes. All transactions are audited in real-time and recorded on blockchain for transparency. We undergo annual external audits by certified auditors and submit regular reports to SEC Ghana.'
        }
      ]
    },
    {
      name: 'Technical Support',
      faqs: [
        {
          question: 'What browsers are supported?',
          answer: 'Constant Treasury works best on: Google Chrome (recommended), Mozilla Firefox, Safari, and Microsoft Edge. We recommend using the latest version of your browser for optimal performance and security.'
        },
        {
          question: 'Is there a mobile app?',
          answer: 'Yes! Our mobile app is available for iOS (App Store) and Android (Google Play). Download "Constant Treasury" to trade on the go, receive push notifications, and access your portfolio anywhere.'
        },
        {
          question: 'I forgot my password. What do I do?',
          answer: 'Click "Forgot Password" on the login page, enter your registered email address, and follow the password reset instructions sent to your email. For security, reset links expire after 1 hour.'
        },
        {
          question: 'Why can\'t I log in?',
          answer: 'Common reasons: incorrect email/password, account not yet verified, account locked due to multiple failed login attempts, or browser cache issues. Try clearing your browser cache or use the "Forgot Password" option. Contact support if issues persist.'
        },
        {
          question: 'How do I update my personal information?',
          answer: 'Go to Settings → Profile → Edit Information. You can update your phone number, address, and email. For security reasons, changing your Ghana Card/ID number requires identity verification by our support team.'
        },
        {
          question: 'What is Ako, the chatbot?',
          answer: 'Ako (meaning "Talking Parrot" in Ghanaian) is our AI-powered assistant that helps you: answer questions, execute trades, check portfolio performance, get market insights, and navigate the platform. Click the chat icon to start a conversation with Ako!'
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-background to-primary/5 py-12 sm:py-16 md:py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Find answers to common questions about investing in government securities with Constant Treasury
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredCategories.length > 0 ? (
              <div className="space-y-8 sm:space-y-12">
                {filteredCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary">
                      {category.name}
                    </h2>
                    <div className="space-y-3 sm:space-y-4">
                      {category.faqs.map((faq, faqIndex) => {
                        const globalIndex = categoryIndex * 100 + faqIndex;
                        const isOpen = openIndex === globalIndex;
                        
                        return (
                          <div
                            key={faqIndex}
                            className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-md"
                          >
                            <button
                              onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                              className="w-full flex items-start justify-between gap-4 p-4 sm:p-6 text-left transition-colors hover:bg-accent/50"
                            >
                              <span className="font-bold text-base sm:text-lg flex-1">
                                {faq.question}
                              </span>
                              <ChevronDown
                                className={`h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 transition-transform ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            {isOpen && (
                              <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  No results found for "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-primary font-semibold hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12">
              Our support team is here to help you 24/7
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Link
                href="/contact"
                className="group rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all hover:border-primary/50"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Chat with Ako</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant answers from our AI assistant
                </p>
              </Link>

              <a
                href="mailto:support@constantcap.com.gh"
                className="group rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all hover:border-primary/50"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground">
                  support@constantcap.com.gh
                </p>
              </a>

              <a
                href="tel:+233302500300"
                className="group rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all hover:border-primary/50"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground">
                  +233 302 500 300
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
