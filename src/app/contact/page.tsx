'use client';

import * as React from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HeadphonesIcon } from 'lucide-react';
import { PageTitle, SectionTitle, CardTitle } from '@/components/ui/PageTitle';

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission
  };

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone Support',
      description: 'Mon-Fri from 8am to 6pm',
      contact: '+233 302 500 300',
      action: 'Call us'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Support',
      description: 'We\'ll respond within 24 hours',
      contact: 'support@ghanatreasurydirect.gov.gh',
      action: 'Email us'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Live Chat',
      description: 'Available 24/7',
      contact: 'Start a conversation',
      action: 'Chat now'
    },
    {
      icon: <HeadphonesIcon className="h-6 w-6" />,
      title: 'WhatsApp',
      description: 'Quick responses',
      contact: '+233 50 123 4567',
      action: 'Message us'
    }
  ];

  const offices = [
    {
      city: 'Accra',
      address: '6 Tanbu Link, Legon, Accra',
      phone: '+233 302 500 300',
      email: 'accra@ghanatreasurydirect.gov.gh',
      hours: 'Mon-Fri: 8:00 AM - 6:00 PM'
    },
    {
      city: 'Kumasi',
      address: 'Adum, Kumasi',
      phone: '+233 322 022 000',
      email: 'kumasi@ghanatreasurydirect.gov.gh',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
    },
    {
      city: 'Takoradi',
      address: 'Market Circle, Takoradi',
      phone: '+233 312 022 000',
      email: 'takoradi@ghanatreasurydirect.gov.gh',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
    }
  ];

  const faqs = [
    {
      question: 'How do I open an account?',
      answer: 'Click "Open Account" and complete the 3-step registration process with your Ghana Card or valid ID.'
    },
    {
      question: 'What is the minimum investment?',
      answer: 'You can start investing with as little as ₵100 in Treasury Bills.'
    },
    {
      question: 'How long does verification take?',
      answer: 'Account verification typically takes 24-48 hours after submitting your documents.'
    },
    {
      question: 'Are my investments safe?',
      answer: 'Yes, all securities are backed by the Government of Ghana and regulated by the SEC.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-background to-card py-12 sm:py-16 md:py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <PageTitle className="mb-6 text-center" subtitle="Have questions? We're here to help. Reach out to our support team anytime.">
              Get in Touch
            </PageTitle>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="rounded-xl border border-border bg-card p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 sm:mb-4">
                  {method.icon}
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">{method.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{method.description}</p>
                <p className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 break-words">{method.contact}</p>
                <button className="text-xs sm:text-sm font-semibold text-primary hover:underline">
                  {method.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Send us a Message</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="John Mensah"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="account">Account Issues</option>
                    <option value="investment">Investment Questions</option>
                    <option value="technical">Technical Support</option>
                    <option value="general">General Inquiry</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Tell us how we can help..."
                    rows={5}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 group"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Office Locations */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Offices</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                Visit us at any of our locations across Ghana.
              </p>

              <div className="space-y-4 sm:space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="rounded-xl border border-border bg-card p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{office.city}</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm">{office.address}</div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm">{office.phone}</div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm">{office.email}</div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm">{office.hours}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Frequently Asked Questions</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="rounded-xl border border-border bg-card p-4 sm:p-6">
                  <h3 className="font-bold text-base sm:text-lg mb-2">{faq.question}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for?
              </p>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30">
                <MessageCircle className="h-5 w-5" />
                Chat with Support
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
