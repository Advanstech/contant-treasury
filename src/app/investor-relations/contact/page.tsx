'use client';

import { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  Users,
  Building2,
  FileText,
  Calendar,
  MessageSquare,
  CheckCircle,
  ExternalLink,
  Globe,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  bio: string;
  expertise: string[];
  image?: string;
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  inquiryType: string;
}

export default function ContactIRPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Nana Yaa Osei',
      position: 'Head of Investor Relations',
      department: 'Investor Relations',
      email: 'nana.osei@constanttreasury.com',
      phone: '+233 30 123 4567',
      bio: 'Nana leads our investor relations team with over 12 years of experience in financial communications and stakeholder management.',
      expertise: ['Financial Communications', 'Stakeholder Relations', 'Regulatory Reporting', 'Corporate Strategy']
    },
    {
      id: '2',
      name: 'Kwame Asante',
      position: 'Senior IR Manager',
      department: 'Investor Relations',
      email: 'kwame.asante@constanttreasury.com',
      phone: '+233 30 123 4568',
      bio: 'Kwame specializes in institutional investor relations and manages relationships with our key institutional partners.',
      expertise: ['Institutional Relations', 'Portfolio Management', 'Market Analysis', 'Investor Education']
    },
    {
      id: '3',
      name: 'Akua Mensah',
      position: 'Financial Communications Manager',
      department: 'Investor Relations',
      email: 'akua.mensah@constanttreasury.com',
      phone: '+233 30 123 4569',
      bio: 'Akua manages all financial communications, press releases, and media relations for Constant Treasury.',
      expertise: ['Media Relations', 'Press Communications', 'Content Strategy', 'Public Relations']
    },
    {
      id: '4',
      name: 'Joseph Annan',
      position: 'Regulatory Affairs Manager',
      department: 'Compliance',
      email: 'joseph.annan@constanttreasury.com',
      phone: '+233 30 123 4570',
      bio: 'Joseph ensures compliance with all regulatory requirements and manages relationships with BoG, SEC, and GSE.',
      expertise: ['Regulatory Compliance', 'Policy Management', 'Government Relations', 'Risk Assessment']
    },
    {
      id: '5',
      name: 'Ama Boateng',
      position: 'Corporate Secretary',
      department: 'Legal & Governance',
      email: 'ama.boateng@constanttreasury.com',
      phone: '+233 30 123 4571',
      bio: 'Ama serves as Corporate Secretary, overseeing board communications and corporate governance matters.',
      expertise: ['Corporate Governance', 'Board Relations', 'Legal Compliance', 'Shareholder Services']
    },
    {
      id: '6',
      name: 'David Osei',
      position: 'Investor Education Lead',
      department: 'Investor Relations',
      email: 'david.osei@constanttreasury.com',
      phone: '+233 30 123 4572',
      bio: 'David develops and delivers educational content to help investors understand treasury markets and our platform.',
      expertise: ['Investor Education', 'Content Development', 'Training Programs', 'Market Analysis']
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const officeLocations = [
    {
      name: 'Head Office - Accra',
      address: 'Constant Treasury House, 5th Floor, Airport City, Accra, Ghana',
      phone: '+233 30 123 4567',
      email: 'info@constanttreasury.com',
      hours: 'Monday - Friday: 8:00 AM - 5:00 PM GMT'
    },
    {
      name: 'Kumasi Regional Office',
      address: 'Adum Business District, Kumasi, Ghana',
      phone: '+233 50 123 4567',
      email: 'kumasi@constanttreasury.com',
      hours: 'Monday - Friday: 8:30 AM - 4:30 PM GMT'
    },
    {
      name: 'Takoradi Branch',
      address: 'Sekondi-Takoradi, Western Region, Ghana',
      phone: '+233 50 123 4568',
      email: 'takoradi@constanttreasury.com',
      hours: 'Monday - Friday: 9:00 AM - 4:00 PM GMT'
    }
  ];

  const contactStats = {
    teamMembers: teamMembers.length,
    offices: officeLocations.length,
    responseTime: '24 hours',
    languages: 'English, Twi, Ga'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/investor-relations" className="text-primary hover:text-primary/80 text-sm mb-2 inline-block">
                ← Back to Investor Relations
              </Link>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Contact Investor Relations
              </h1>
              <p className="text-muted-foreground">
                Get in touch with our investor relations team for inquiries and support
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AnimatedButton variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IR Team Members</p>
                <p className="text-2xl font-bold text-foreground">{contactStats.teamMembers}</p>
                <p className="text-sm text-muted-foreground">Available to help</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Office Locations</p>
                <p className="text-2xl font-bold text-foreground">{contactStats.offices}</p>
                <p className="text-sm text-muted-foreground">Across Ghana</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold text-foreground">{contactStats.responseTime}</p>
                <p className="text-sm text-green-600">Average response</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={300}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Languages</p>
                <p className="text-2xl font-bold text-foreground">{contactStats.languages}</p>
                <p className="text-sm text-muted-foreground">Support available</p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Contact Form & Team */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <AnimatedCard className="p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
            
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    Message sent successfully!
                  </p>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Inquiry Type *
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="general">General Inquiry</option>
                  <option value="financial">Financial Information</option>
                  <option value="regulatory">Regulatory Matters</option>
                  <option value="media">Media & Press</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="technical">Technical Support</option>
                  <option value="complaint">Complaints & Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Brief subject of your inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Please provide detailed information about your inquiry..."
                />
              </div>

              <AnimatedButton 
                type="submit" 
                variant="primary" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </AnimatedButton>
            </form>
          </AnimatedCard>

          {/* Quick Contact Info */}
          <div className="space-y-6">
            <AnimatedCard className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">+233 30 123 4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">ir@constanttreasury.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available Mon-Fri, 8AM-5PM</p>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6 border border-border" delay={100}>
              <h3 className="text-lg font-semibold text-foreground mb-4">Office Hours</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Monday - Friday</span>
                  <span className="text-sm text-muted-foreground">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Saturday</span>
                  <span className="text-sm text-muted-foreground">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Sunday</span>
                  <span className="text-sm text-muted-foreground">Closed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Public Holidays</span>
                  <span className="text-sm text-muted-foreground">Closed</span>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6 border border-border" delay={200}>
              <h3 className="text-lg font-semibold text-foreground mb-4">Other Departments</h3>
              <div className="space-y-3">
                <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Customer Support</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Media Relations</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Career Inquiries</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>

      {/* IR Team */}
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Investor Relations Team</h2>
            <p className="text-muted-foreground">
              Meet our dedicated investor relations professionals ready to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <AnimatedCard 
                key={member.id}
                className="p-6 border border-border hover:shadow-lg transition-shadow"
                delay={index * 100}
              >
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white flex-shrink-0">
                    <Users className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-2">{member.position}</p>
                    <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <a href={`mailto:${member.email}`} className="text-primary hover:text-primary/80">
                          {member.email}
                        </a>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <a href={`tel:${member.phone}`} className="text-primary hover:text-primary/80">
                            {member.phone}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-foreground mb-2">Expertise:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Office Locations</h2>
          <p className="text-muted-foreground">
            Visit us at any of our office locations across Ghana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {officeLocations.map((office, index) => (
            <AnimatedCard 
              key={index}
              className="p-6 border border-border hover:shadow-lg transition-shadow"
              delay={index * 100}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {office.name}
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm text-muted-foreground">{office.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${office.phone}`} className="text-sm text-primary hover:text-primary/80">
                    {office.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${office.email}`} className="text-sm text-primary hover:text-primary/80">
                    {office.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{office.hours}</span>
                </div>
              </div>
              <AnimatedButton variant="outline" size="sm" className="w-full mt-4">
                Get Directions
              </AnimatedButton>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
}
