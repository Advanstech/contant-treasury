'use client';

import { HeadphonesIcon, Mail, Phone, MessageCircle, Clock, CheckCircle, Users, HelpCircle, Book, FileText, Send } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Support() {
  const supportChannels = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      contact: '+233 30 123 4567',
      hours: 'Mon-Fri: 8AM-6PM GMT',
      availability: 'Available Now'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Support',
      description: 'Send us your questions and we\'ll respond promptly',
      contact: 'support@constanttreasury.com',
      hours: '24/7 Response',
      availability: 'Within 24 Hours'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Live Chat',
      description: 'Get instant help from our support agents',
      contact: 'Chat with us online',
      hours: 'Mon-Fri: 8AM-8PM GMT',
      availability: 'Available Now'
    },
    {
      icon: <HelpCircle className="h-6 w-6" />,
      title: 'Help Center',
      description: 'Find answers to common questions',
      contact: 'Browse our knowledge base',
      hours: '24/7 Access',
      availability: 'Always Available'
    }
  ];

  const services = [
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Account Setup',
      description: 'Get help with registration, KYC verification, and account configuration'
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: 'Investment Guidance',
      description: 'Learn about different treasury securities and investment strategies'
    },
    {
      icon: <Book className="h-5 w-5" />,
      title: 'Platform Training',
      description: 'Step-by-step guidance on using all platform features'
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: 'Transaction Support',
      description: 'Assistance with investments, withdrawals, and portfolio management'
    }
  ];

  const faqs = [
    {
      question: 'How do I open an investment account?',
      answer: 'Opening an account is simple! Click "Register" on our homepage, fill in your details, complete KYC verification, and you\'ll be ready to invest in minutes.'
    },
    {
      question: 'What documents do I need for KYC verification?',
      answer: 'You\'ll need a valid government-issued ID (Ghana Card, Passport, or Driver\'s License), proof of address (utility bill or bank statement), and a recent photograph.'
    },
    {
      question: 'How quickly can I start investing after registration?',
      answer: 'Once your KYC is approved (usually within 24 hours), you can start investing immediately. The entire process typically takes less than 48 hours.'
    },
    {
      question: 'Can I invest from outside Ghana?',
      answer: 'Yes! We welcome diaspora investors. You can invest from anywhere in the world using our secure online platform.'
    },
    {
      question: 'How do I withdraw my returns?',
      answer: 'You can withdraw your returns to your registered bank account or mobile money wallet. Withdrawals are typically processed within 1-2 business days.'
    },
    {
      question: 'What are the fees for investing?',
      answer: 'We charge a small transparent fee on transactions. There are no hidden charges, and our rates are competitive compared to traditional investment options.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm mb-6">
              <HeadphonesIcon className="h-4 w-4 text-primary" />
              <span className="font-medium">24/7 Support for All Your Investment Needs</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              We're Here to <span className="text-primary">Help</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our dedicated support team is ready to assist you with every step of your investment journey. 
              Get expert guidance whenever you need it.
            </p>

            <Button size="lg" className="group" asChild>
              <Link href="/register">
                Get Started Now
                <Send className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the support channel that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4">
                    {channel.icon}
                  </div>
                  <CardTitle className="text-lg">{channel.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{channel.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-semibold">{channel.contact}</div>
                    <div className="text-sm text-muted-foreground">{channel.hours}</div>
                    <div className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                      <CheckCircle className="h-3 w-3" />
                      {channel.availability}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How We Can Help
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive support services for all your investment needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground text-sm">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions about Constant Treasury.
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Send Us a Message
              </h2>
              <p className="text-lg text-muted-foreground">
                Have a specific question? Fill out the form below and we\'ll get back to you soon.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>General Inquiry</option>
                      <option>Account Support</option>
                      <option>Investment Questions</option>
                      <option>Technical Issues</option>
                      <option>Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea 
                      rows={5}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <Button size="lg" className="w-full group">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Quick Response Times</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              We pride ourselves on providing timely support to all our investors.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24 Hours</div>
                <div className="text-sm text-muted-foreground">Email Response</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">2 Minutes</div>
                <div className="text-sm text-muted-foreground">Live Chat Wait</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">30 Seconds</div>
                <div className="text-sm text-muted-foreground">Phone Answer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Investing?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Our support team is here to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="group" asChild>
              <Link href="/register">
                Create Account
                <Send className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="tel:+233301234567">
                <Phone className="mr-2 h-5 w-5" />
                Call Us Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
