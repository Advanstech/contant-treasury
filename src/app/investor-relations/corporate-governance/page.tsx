'use client';

import { useState } from 'react';
import { 
  Users, 
  Shield, 
  FileText, 
  Download, 
  Mail,
  Building2,
  Award,
  Scale,
  Eye,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
  BookOpen,
  CheckCircle,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated-card';

interface BoardMember {
  id: string;
  name: string;
  position: string;
  type: 'EXECUTIVE' | 'NON_EXECUTIVE' | 'INDEPENDENT';
  bio: string;
  experience: string;
  education: string;
  committees: string[];
  since: string;
  image?: string;
}

interface Committee {
  id: string;
  name: string;
  description: string;
  chair: string;
  members: string[];
  responsibilities: string[];
  meetingFrequency: string;
}

interface Policy {
  id: string;
  title: string;
  category: 'GOVERNANCE' | 'ETHICS' | 'RISK' | 'COMPLIANCE' | 'SUSTAINABILITY';
  description: string;
  lastUpdated: string;
  downloadUrl: string;
  fileSize: string;
}

export default function CorporateGovernancePage() {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [expandedCommittee, setExpandedCommittee] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'board' | 'committees' | 'policies'>('board');

  const boardMembers: BoardMember[] = [
    {
      id: '1',
      name: 'Dr. Kwame Osei-Tutu',
      position: 'Chairman',
      type: 'INDEPENDENT',
      bio: 'Dr. Osei-Tutu is a seasoned banking professional with over 25 years of experience in financial services and corporate governance.',
      experience: 'Former Governor of Bank of Ghana, Senior Executive at Standard Chartered Ghana, Board Member of multiple financial institutions',
      education: 'PhD in Economics, University of Ghana; MBA, Harvard Business School',
      committees: ['Audit Committee', 'Risk Management Committee'],
      since: '2020'
    },
    {
      id: '2',
      name: 'Nana Ama Mensah',
      position: 'Chief Executive Officer',
      type: 'EXECUTIVE',
      bio: 'Nana Mensah is a fintech pioneer with extensive experience in digital transformation and financial technology innovation.',
      experience: 'Former CTO at Ecobank Ghana, Head of Digital Banking at Barclays Africa, Founder of multiple fintech startups',
      education: 'MSc Computer Science, MIT; BSc Computer Science, KNUST',
      committees: ['Technology Committee', 'Innovation Committee'],
      since: '2021'
    },
    {
      id: '3',
      name: 'Mr. Yaw Boateng',
      position: 'Independent Director',
      type: 'INDEPENDENT',
      bio: 'Mr. Boateng is a legal expert specializing in financial regulations and corporate law.',
      experience: 'Partner at Bentsi-Enchill, Letsa & Ankomah, Former Legal Advisor to SEC Ghana',
      education: 'LLB, University of Ghana; BL, Ghana School of Law',
      committees: ['Audit Committee', 'Compliance Committee'],
      since: '2020'
    },
    {
      id: '4',
      name: 'Dr. Abena Akoto',
      position: 'Non-Executive Director',
      type: 'NON_EXECUTIVE',
      bio: 'Dr. Akoto is a renowned economist and financial market expert with deep knowledge of Ghana\'s treasury markets.',
      experience: 'Chief Economist at Bank of Ghana, Senior Advisor to Ministry of Finance, World Bank Consultant',
      education: 'PhD in Economics, London School of Economics; MA Economics, University of Ghana',
      committees: ['Risk Management Committee', 'Investment Committee'],
      since: '2022'
    },
    {
      id: '5',
      name: 'Mr. Kofi Annan',
      position: 'Independent Director',
      type: 'INDEPENDENT',
      bio: 'Mr. Annan brings extensive experience in risk management and corporate governance.',
      experience: 'Former Chief Risk Officer at Ghana Commercial Bank, Risk Consultant for Central Bank of West African States',
      education: 'MBA, University of Ghana; BSc Accounting, University of Cape Coast',
      committees: ['Risk Management Committee', 'Audit Committee'],
      since: '2021'
    },
    {
      id: '6',
      name: 'Dr. Efua Asantewaa',
      position: 'Non-Executive Director',
      type: 'NON_EXECUTIVE',
      bio: 'Dr. Asantewaa is a technology and digital transformation expert with focus on financial technology.',
      experience: 'CTO at MTN Ghana, Digital Transformation Consultant for African Development Bank',
      education: 'PhD Information Systems, University of Pretoria; MSc Computer Science, KNUST',
      committees: ['Technology Committee', 'Innovation Committee'],
      since: '2023'
    }
  ];

  const committees: Committee[] = [
    {
      id: '1',
      name: 'Audit Committee',
      description: 'Oversight of financial reporting, internal controls, and external audit processes',
      chair: 'Mr. Yaw Boateng',
      members: ['Dr. Kwame Osei-Tutu', 'Mr. Kofi Annan', 'Dr. Efua Asantewaa'],
      responsibilities: [
        'Review financial statements and reports',
        'Monitor internal control systems',
        'Oversee external audit processes',
        'Ensure compliance with accounting standards',
        'Review risk management frameworks'
      ],
      meetingFrequency: 'Quarterly'
    },
    {
      id: '2',
      name: 'Risk Management Committee',
      description: 'Identification, assessment, and mitigation of strategic and operational risks',
      chair: 'Dr. Abena Akoto',
      members: ['Dr. Kwame Osei-Tutu', 'Mr. Kofi Annan', 'Nana Ama Mensah'],
      responsibilities: [
        'Develop risk management policies',
        'Monitor market and credit risks',
        'Review cybersecurity measures',
        'Assess regulatory compliance risks',
        'Oversee business continuity planning'
      ],
      meetingFrequency: 'Bi-monthly'
    },
    {
      id: '3',
      name: 'Technology & Innovation Committee',
      description: 'Guidance on technology strategy, digital innovation, and platform development',
      chair: 'Nana Ama Mensah',
      members: ['Dr. Efua Asantewaa', 'Dr. Kwame Osei-Tutu'],
      responsibilities: [
        'Review technology roadmap',
        'Assess digital innovation initiatives',
        'Monitor cybersecurity posture',
        'Evaluate emerging technologies',
        'Oversee platform scalability'
      ],
      meetingFrequency: 'Monthly'
    },
    {
      id: '4',
      name: 'Compliance & Ethics Committee',
      description: 'Ensuring adherence to regulatory requirements and ethical business practices',
      chair: 'Mr. Yaw Boateng',
      members: ['Dr. Kwame Osei-Tutu', 'Dr. Abena Akoto'],
      responsibilities: [
        'Monitor regulatory compliance',
        'Review ethical policies and procedures',
        'Oversee anti-money laundering measures',
        'Ensure investor protection standards',
        'Review corporate governance practices'
      ],
      meetingFrequency: 'Quarterly'
    }
  ];

  const policies: Policy[] = [
    {
      id: '1',
      title: 'Code of Corporate Governance',
      category: 'GOVERNANCE',
      description: 'Comprehensive framework for corporate governance practices and board responsibilities',
      lastUpdated: '2025-10-15',
      downloadUrl: '#',
      fileSize: '2.4 MB'
    },
    {
      id: '2',
      title: 'Code of Ethics and Business Conduct',
      category: 'ETHICS',
      description: 'Guidelines for ethical behavior and business practices across the organization',
      lastUpdated: '2025-09-30',
      downloadUrl: '#',
      fileSize: '1.8 MB'
    },
    {
      id: '3',
      title: 'Risk Management Framework',
      category: 'RISK',
      description: 'Comprehensive approach to identifying, assessing, and mitigating various risks',
      lastUpdated: '2025-11-01',
      downloadUrl: '#',
      fileSize: '3.2 MB'
    },
    {
      id: '4',
      title: 'Compliance and Regulatory Policy',
      category: 'COMPLIANCE',
      description: 'Procedures for ensuring compliance with BoG, SEC, and other regulatory requirements',
      lastUpdated: '2025-10-20',
      downloadUrl: '#',
      fileSize: '2.1 MB'
    },
    {
      id: '5',
      title: 'Sustainability and ESG Policy',
      category: 'SUSTAINABILITY',
      description: 'Commitment to environmental, social, and governance best practices',
      lastUpdated: '2025-08-15',
      downloadUrl: '#',
      fileSize: '1.5 MB'
    },
    {
      id: '6',
      title: 'Whistleblower Protection Policy',
      category: 'ETHICS',
      description: 'Framework for reporting misconduct and protecting whistleblowers',
      lastUpdated: '2025-07-10',
      downloadUrl: '#',
      fileSize: '0.8 MB'
    }
  ];

  const getMemberTypeColor = (type: string) => {
    switch (type) {
      case 'EXECUTIVE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'NON_EXECUTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'INDEPENDENT': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPolicyCategoryColor = (category: string) => {
    switch (category) {
      case 'GOVERNANCE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ETHICS': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'RISK': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'COMPLIANCE': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'SUSTAINABILITY': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = (policy: Policy) => {
    console.log('Downloading policy:', policy.title);
  };

  const governanceMetrics = {
    boardIndependence: '75%',
    committeeMeetings: '24',
    policiesUpdated: '6',
    complianceScore: '98%'
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
                Corporate Governance
              </h1>
              <p className="text-muted-foreground">
                Learn about our leadership team, board structure, and governance policies
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AnimatedButton variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Download Governance Report
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      {/* Governance Overview */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnimatedCard className="p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Board Independence</p>
                <p className="text-2xl font-bold text-foreground">{governanceMetrics.boardIndependence}</p>
                <p className="text-sm text-green-600">Above industry average</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={100}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Committee Meetings</p>
                <p className="text-2xl font-bold text-foreground">{governanceMetrics.committeeMeetings}</p>
                <p className="text-sm text-muted-foreground">This year</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={200}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Policies Updated</p>
                <p className="text-2xl font-bold text-foreground">{governanceMetrics.policiesUpdated}</p>
                <p className="text-sm text-muted-foreground">Recent updates</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6 border border-border" delay={300}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold text-foreground">{governanceMetrics.complianceScore}</p>
                <p className="text-sm text-green-600">Excellent rating</p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="border-b border-border">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('board')}
              className={`pb-4 px-1 border-b-2 transition-colors ${
                activeTab === 'board'
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Board of Directors
              </div>
            </button>
            <button
              onClick={() => setActiveTab('committees')}
              className={`pb-4 px-1 border-b-2 transition-colors ${
                activeTab === 'committees'
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Committees
              </div>
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`pb-4 px-1 border-b-2 transition-colors ${
                activeTab === 'policies'
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Policies & Documents
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Board of Directors */}
      {activeTab === 'board' && (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Board of Directors</h2>
            <p className="text-muted-foreground">
              Our diverse board brings together expertise from banking, technology, law, and economics to guide Constant Treasury's strategic direction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {boardMembers.map((member, index) => (
              <AnimatedCard 
                key={member.id}
                className="p-6 border border-border hover:shadow-lg transition-shadow"
                delay={index * 100}
              >
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white flex-shrink-0">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {member.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMemberTypeColor(member.type)}`}>
                        {member.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-primary font-medium mb-3">{member.position}</p>
                    <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                    
                    <div className="mb-3">
                      <p className="text-xs font-medium text-foreground mb-1">Experience:</p>
                      <p className="text-xs text-muted-foreground">{member.experience}</p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs font-medium text-foreground mb-1">Education:</p>
                      <p className="text-xs text-muted-foreground">{member.education}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-foreground mb-1">Committees:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.committees.map((committee, idx) => (
                            <span key={idx} className="px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                              {committee}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Since {member.since}
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      )}

      {/* Committees */}
      {activeTab === 'committees' && (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Board Committees</h2>
            <p className="text-muted-foreground">
              Our board committees provide focused oversight in key areas including audit, risk management, technology, and compliance.
            </p>
          </div>

          <div className="space-y-6">
            {committees.map((committee, index) => (
              <AnimatedCard 
                key={committee.id}
                className="border border-border overflow-hidden"
                delay={index * 100}
              >
                <div 
                  className="p-6 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setExpandedCommittee(expandedCommittee === committee.id ? null : committee.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {committee.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {committee.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{committee.chair}</p>
                        <p className="text-xs text-muted-foreground">Chair</p>
                      </div>
                      {expandedCommittee === committee.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedCommittee === committee.id && (
                  <div className="px-6 pb-6 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Members</h4>
                        <div className="space-y-2">
                          {committee.members.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-foreground">{member}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Key Responsibilities</h4>
                        <div className="space-y-2">
                          {committee.responsibilities.map((responsibility, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <div className="h-1 w-1 bg-primary rounded-full mt-2" />
                              <span className="text-muted-foreground">{responsibility}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Meeting Frequency: <span className="font-medium text-foreground">{committee.meetingFrequency}</span>
                        </span>
                        <AnimatedButton variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Charter
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                )}
              </AnimatedCard>
            ))}
          </div>
        </div>
      )}

      {/* Policies */}
      {activeTab === 'policies' && (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Governance Policies</h2>
            <p className="text-muted-foreground">
              Our comprehensive governance policies ensure transparency, accountability, and adherence to regulatory requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy, index) => (
              <AnimatedCard 
                key={policy.id}
                className="p-6 border border-border hover:shadow-lg transition-shadow"
                delay={index * 100}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPolicyCategoryColor(policy.category)}`}>
                    {policy.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {policy.fileSize}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {policy.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {policy.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Updated: {formatDate(policy.lastUpdated)}
                  </span>
                  <AnimatedButton variant="outline" onClick={() => handleDownload(policy)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Policy
                  </AnimatedButton>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <AnimatedCard className="p-8 border border-border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Corporate Governance Inquiries
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                For questions about our corporate governance practices, board composition, or policies, 
                please contact our Corporate Secretary.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-sm text-muted-foreground mb-2">governance@constanttreasury.com</p>
                <p className="text-xs text-muted-foreground">Corporate Secretary</p>
              </div>
              
              <div className="text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Registered Office</h3>
                <p className="text-sm text-muted-foreground mb-2">Accra, Ghana</p>
                <p className="text-xs text-muted-foreground">Head Office</p>
              </div>
              
              <div className="text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                <p className="text-sm text-muted-foreground mb-2">+233 30 123 4567</p>
                <p className="text-xs text-muted-foreground">Business Hours: 8AM - 5PM</p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
