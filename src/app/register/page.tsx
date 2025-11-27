'use client';

import * as React from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Shield, ArrowRight, CheckCircle2, Loader2, Building2, Users, Briefcase, User, Lock, Mail, Phone, Calendar, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PageTitle } from '@/components/ui/PageTitle';

type AccountType = 'INDIVIDUAL' | 'INSTITUTION' | 'CORPORATE' | 'CUSTODIAN';

interface FormData {
  // Step 1: Account Type
  accountType: AccountType;
  organizationName?: string;
  registrationNumber?: string;
  
  // Step 2: Personal/Contact Information
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  jobTitle?: string;
  department?: string;
  
  // Step 3: Account Security
  password: string;
  confirmPassword: string;
  securityQuestion?: string;
  securityAnswer?: string;
  
  // Step 4: Verification
  idType: string;
  idNumber?: string;
  dateOfBirth?: string;
  tinNumber?: string;
  bvnNumber?: string;
  
  // Agreement
  terms: boolean;
  privacy: boolean;
  riskDisclosure: boolean;
}

const accountTypeConfig = {
  INDIVIDUAL: {
    icon: User,
    title: 'Individual Investor',
    description: 'Personal investment account for individual Ghanaian residents',
    features: ['Personal trading account', 'Full market access', 'Mobile app access', '₵100 minimum investment'],
    color: 'blue'
  },
  INSTITUTION: {
    icon: Building2,
    title: 'Institutional Investor',
    description: 'For banks, insurance companies, asset managers, and pension funds',
    features: ['Institutional pricing', 'Dedicated relationship manager', 'API access', 'Custom reporting'],
    color: 'green'
  },
  CORPORATE: {
    icon: Briefcase,
    title: 'Corporate Entity',
    description: 'For companies, partnerships, and registered businesses',
    features: ['Corporate treasury management', 'Multiple user access', 'Bulk operations', 'Consolidated reporting'],
    color: 'purple'
  },
  CUSTODIAN: {
    icon: Users,
    title: 'Custodian/Primary Dealer',
    description: 'For licensed custodians and Bank of Ghana primary dealers',
    features: ['Client account management', 'Settlement automation', 'Compliance tools', 'Real-time APIs'],
    color: 'orange'
  }
};

export default function RegisterPage() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const organizationNameRef = React.useRef<HTMLInputElement>(null);
  const [formData, setFormData] = React.useState<FormData>({
    // Step 1: Account Type
    accountType: 'INDIVIDUAL',
    organizationName: '',
    registrationNumber: '',
    
    // Step 2: Personal/Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    
    // Step 3: Account Security
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    
    // Step 4: Verification
    idType: 'ghana-card',
    idNumber: '',
    dateOfBirth: '',
    tinNumber: '',
    bvnNumber: '',
    
    // Agreement
    terms: false,
    privacy: false,
    riskDisclosure: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 4) {
      // Validate current step before proceeding
      if (!validateCurrentStep()) {
        return;
      }
      setStep(step + 1);
    } else {
      // Final step - submit registration
      if (!validateFinalStep()) {
        return;
      }
      
      setLoading(true);
      try {
        await register({
          email: formData.email,
          password: formData.password,
          accountType: formData.accountType,
          // Personal information (for individuals)
          firstName: formData.firstName,
          lastName: formData.lastName,
          // Organization information (for non-individuals)
          organizationName: formData.organizationName,
          registrationNumber: formData.registrationNumber,
          jobTitle: formData.jobTitle,
          department: formData.department,
          // Contact information
          phone: formData.phone,
          // Verification information
          dateOfBirth: formData.dateOfBirth,
          // Verification information
          ghanaCardNumber: formData.idNumber,
          tinNumber: formData.tinNumber,
          bvnNumber: formData.bvnNumber,
        });
        // Success! User will be redirected by AuthContext
      } catch (error) {
        console.error('Registration failed:', error);
        // Error toast will be shown by AuthContext
      } finally {
        setLoading(false);
      }
    }
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        if (!formData.accountType) {
          alert('Please select an account type');
          return false;
        }
        // Organization fields are now optional
        return true;
      
      case 2:
        if (!formData.email || !formData.phone) {
          alert('Please fill in all required contact information');
          return false;
        }
        if (formData.accountType === 'INDIVIDUAL' && (!formData.firstName || !formData.lastName)) {
          alert('Please provide your full name');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.password || !formData.confirmPassword) {
          alert('Please create and confirm your password');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match!');
          return false;
        }
        if (formData.password.length < 8) {
          alert('Password must be at least 8 characters long');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const validateFinalStep = () => {
    if (!formData.terms || !formData.privacy || !formData.riskDisclosure) {
      alert('Please accept all required agreements');
      return false;
    }
    
    if (formData.accountType === 'INDIVIDUAL' && !formData.idNumber) {
      alert('Please complete all verification fields');
      return false;
    }
    
    return true;
  };

  const handleAccountTypeSelect = (accountType: AccountType) => {
    setFormData({ ...formData, accountType });
    
    // Auto-advance for individual, auto-focus for organizations
    if (accountType === 'INDIVIDUAL') {
      // Auto-advance to Step 2 after a short delay
      setTimeout(() => {
        setStep(2);
      }, 300);
    } else {
      // Focus on organization name input after a short delay to allow DOM update
      setTimeout(() => {
        organizationNameRef.current?.focus();
      }, 100);
    }
  };

  const benefits = [
    'Start investing with as little as ₵100',
    'Access to T-Bills and Government Bonds',
    'Real-time portfolio tracking',
    'Competitive yields up to 24.5% p.a.',
    'Secure, government-backed investments',
    '24/7 customer support'
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Left Side - Form */}
          <div className="flex-1 flex items-center py-12">
            <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <PageTitle subtitle="Start investing in government securities today">
              Create Your Account
            </PageTitle>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((s) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                    </div>
                    <div className="text-xs mt-2 font-medium text-center">
                      {s === 1 ? 'Account Type' : s === 2 ? 'Information' : s === 3 ? 'Security' : 'Verification'}
                    </div>
                  </div>
                  {s < 4 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-colors ${
                      step > s ? 'bg-primary' : 'bg-muted'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Account Type Selection */}
            {step === 1 && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Select Your Account Type</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose the account type that best describes your entity. This will determine the features and verification requirements.
                  </p>
                </div>

                <div className="space-y-3">
                  {Object.entries(accountTypeConfig).map(([type, config]) => {
                    const Icon = config.icon;
                    const isSelected = formData.accountType === type;
                    
                    return (
                      <div
                        key={type}
                        onClick={() => handleAccountTypeSelect(type as AccountType)}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-accent/50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1 text-foreground">{config.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{config.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {config.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Organization fields - moved closer to account type selection */}
                {formData.accountType !== 'INDIVIDUAL' && (
                  <div className="space-y-4 mt-6">
                    <div>
                      <label htmlFor="organizationName" className="block text-sm font-semibold mb-2 text-foreground">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        id="organizationName"
                        ref={organizationNameRef}
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter registered organization name"
                      />
                    </div>

                    <div>
                      <label htmlFor="registrationNumber" className="block text-sm font-semibold mb-2 text-foreground">
                        Registration Number / TIN
                      </label>
                      <input
                        type="text"
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Company Registration Number or TIN"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {formData.accountType === 'INDIVIDUAL' ? 'Personal Information' : 'Contact Details'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Provide the primary contact information for this account.
                  </p>
                </div>

                {formData.accountType === 'INDIVIDUAL' && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold mb-2 text-foreground">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold mb-2 text-foreground">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Mensah"
                        required
                      />
                    </div>
                  </div>
                )}

                {formData.accountType !== 'INDIVIDUAL' && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-semibold mb-2 text-foreground">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Chief Investment Officer"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="department" className="block text-sm font-semibold mb-2 text-foreground">
                        Department
                      </label>
                      <input
                        type="text"
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Treasury"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 text-foreground">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-10 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder={formData.accountType === 'INDIVIDUAL' ? 'john.mensah@example.com' : 'contact@company.com'}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-foreground">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-10 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="+233 XX XXX XXXX"
                      required
                    />
                  </div>
                </div>

                {formData.accountType !== 'INDIVIDUAL' && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-primary mb-1">Institutional Onboarding</p>
                        <p className="text-muted-foreground">
                          After registration, our institutional team will contact you within 24 hours to complete the onboarding process and provide dedicated account setup assistance.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 3: Account Security */}
            {step === 3 && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Create Your Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up strong security credentials to protect your account.
                  </p>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-semibold mb-2 text-foreground">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`h-1 w-1 rounded-full ${
                        formData.password.length >= 8 ? 'bg-green-500' : 'bg-muted'
                      }`}></div>
                      <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`h-1 w-1 rounded-full ${
                        /[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-muted'
                      }`}></div>
                      <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-muted-foreground'}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`h-1 w-1 rounded-full ${
                        /[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-muted'
                      }`}></div>
                      <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-muted-foreground'}>
                        One lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`h-1 w-1 rounded-full ${
                        /[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-muted'
                      }`}></div>
                      <span className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-muted-foreground'}>
                        One number
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`h-1 w-1 rounded-full ${
                        /[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-muted'
                      }`}></div>
                      <span className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : 'text-muted-foreground'}>
                        One special character
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-foreground">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Re-enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <p className={`text-xs mt-2 ${
                      formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                    </p>
                  )}
                </div>

                {(formData.accountType === 'INSTITUTION' || formData.accountType === 'CUSTODIAN') && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="securityQuestion" className="block text-sm font-semibold mb-2 text-foreground">
                        Security Question
                      </label>
                      <select
                        id="securityQuestion"
                        value={formData.securityQuestion}
                        onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      >
                        <option value="">Select a security question</option>
                        <option value="mother-maiden">What is your mother's maiden name?</option>
                        <option value="first-school">What was the name of your first school?</option>
                        <option value="first-pet">What was the name of your first pet?</option>
                        <option value="birth-city">In what city were you born?</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="securityAnswer" className="block text-sm font-semibold mb-2 text-foreground">
                        Security Answer
                      </label>
                      <input
                        type="text"
                        id="securityAnswer"
                        value={formData.securityAnswer}
                        onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter your security answer"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 4: Verification & Agreements */}
            {step === 4 && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Verification & Agreements</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete verification and accept the terms to create your account.
                  </p>
                </div>

                {formData.accountType === 'INDIVIDUAL' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="idType" className="block text-sm font-semibold mb-2 text-foreground">
                        ID Type *
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <select
                          id="idType"
                          value={formData.idType}
                          onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                          className="w-full px-10 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                          required
                        >
                          <option value="ghana-card">Ghana Card</option>
                          <option value="passport">Passport</option>
                          <option value="drivers-license">Driver's License</option>
                          <option value="voters-id">Voter's ID</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="idNumber" className="block text-sm font-semibold mb-2 text-foreground">
                        ID Number *
                      </label>
                      <input
                        type="text"
                        id="idNumber"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="GHA-XXXXXXXXX-X"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-semibold mb-2 text-foreground">
                        Date of Birth (Optional)
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                          type="date"
                          id="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full px-10 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="tinNumber" className="block text-sm font-semibold mb-2 text-foreground">
                        TIN Number (Optional)
                      </label>
                      <input
                        type="text"
                        id="tinNumber"
                        value={formData.tinNumber}
                        onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Tax Identification Number"
                      />
                    </div>

                    <div>
                      <label htmlFor="bvnNumber" className="block text-sm font-semibold mb-2 text-foreground">
                        BVN Number (Optional)
                      </label>
                      <input
                        type="text"
                        id="bvnNumber"
                        value={formData.bvnNumber}
                        onChange={(e) => setFormData({ ...formData, bvnNumber: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Bank Verification Number"
                      />
                    </div>
                  </div>
                )}

                {formData.accountType !== 'INDIVIDUAL' && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-primary mb-1">Document Upload Required</p>
                        <p className="text-muted-foreground mb-2">
                          After registration, you'll need to upload the following documents:
                        </p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Certificate of Incorporation</li>
                          <li>• Company TIN Certificate</li>
                          <li>• Board Resolution authorizing account opening</li>
                          <li>• Directors' ID documents</li>
                          <li>• Signatory ID documents</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-foreground">Required Agreements</h4>
                  
                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.terms}
                      onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                      required
                    />
                    <span className="text-sm text-muted-foreground">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary font-semibold hover:underline">
                        Terms of Service
                      </Link>
                      {' '}and understand this governs my use of Constant Treasury
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.privacy}
                      onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                      required
                    />
                    <span className="text-sm text-muted-foreground">
                      I acknowledge the{' '}
                      <Link href="/privacy" className="text-primary font-semibold hover:underline">
                        Privacy Policy
                      </Link>
                      {' '}and consent to the processing of my personal data
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.riskDisclosure}
                      onChange={(e) => setFormData({ ...formData, riskDisclosure: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                      required
                    />
                    <span className="text-sm text-muted-foreground">
                      I acknowledge the{' '}
                      <Link href="/risk-disclosure" className="text-primary font-semibold hover:underline">
                        Risk Disclosure Statement
                      </Link>
                      {' '}and understand that government securities carry investment risks
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 border-2 border-border text-foreground font-semibold py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    {step === 4 ? 'Create Account' : 'Continue'}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
            </div>

            {/* Right Side - Benefits */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-card to-primary/5 items-center justify-center p-12 border-l border-border">
        <div className="max-w-lg">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6">
              <Shield className="h-4 w-4" />
              Trusted by 160,000+ Investors
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Start Building Wealth Today
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Join thousands of Ghanaians investing in secure, government-backed securities with competitive returns.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm font-medium">{benefit}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-border bg-card/50 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-bold">SEC Regulated</div>
                <div className="text-sm text-muted-foreground">Licensed & Compliant</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Constant Treasury is powered by Constant Capital Ghana, a Securities and Exchange Commission licensed broker-dealer.
            </p>
          </div>
        </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
