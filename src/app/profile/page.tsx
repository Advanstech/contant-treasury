'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Building, Briefcase, Shield, Save, Edit2, CheckCircle, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, isAuthenticated, loading, updateProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'kyc'>('personal');

  // Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Ghana');

  // Organization Information (for corporate accounts)
  const [organizationName, setOrganizationName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');

  // KYC Information
  const [ghanaCardNumber, setGhanaCardNumber] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [bvnNumber, setBvnNumber] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Sync active tab with URL query (?tab=personal|kyc)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'kyc' || tab === 'personal') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      // Personal Information
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
      setDateOfBirth(user.dateOfBirth || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setPostalCode(user.postalCode || '');
      setCountry(user.country || 'Ghana');

      // Organization Information
      setOrganizationName(user.organizationName || '');
      setRegistrationNumber(user.registrationNumber || '');
      setJobTitle(user.jobTitle || '');
      setDepartment(user.department || '');

      // KYC Information
      setGhanaCardNumber(user.ghanaCardNumber || '');
      setTinNumber(user.tinNumber || '');
      setBvnNumber(user.bvnNumber || '');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);

    try {
      const profileData: any = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        dateOfBirth: dateOfBirth || null,
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      };

      // Add organization fields if corporate account
      if (user?.accountType === 'CORPORATE' || user?.accountType === 'INSTITUTION') {
        profileData.organizationName = organizationName.trim();
        profileData.registrationNumber = registrationNumber.trim();
        profileData.jobTitle = jobTitle.trim();
        profileData.department = department.trim();
      }

      // Add KYC fields (only if provided)
      if (ghanaCardNumber.trim()) profileData.ghanaCardNumber = ghanaCardNumber.trim();
      if (tinNumber.trim()) profileData.tinNumber = tinNumber.trim();
      if (bvnNumber.trim()) profileData.bvnNumber = bvnNumber.trim();

      await updateProfile(profileData);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      firstName,
      lastName,
      phone,
      dateOfBirth,
      address,
      city,
      country,
    ];

    if (user?.accountType === 'CORPORATE' || user?.accountType === 'INSTITUTION') {
      fields.push(organizationName, registrationNumber);
    }

    const completed = fields.filter(f => f && f.toString().trim()).length;
    return Math.round((completed / fields.length) * 100);
  };

  const calculateKYCCompletion = () => {
    if (!user) return 0;
    
    const kycFields = [
      ghanaCardNumber,
      tinNumber,
      (user as any).occupation,
      (user as any).employmentSector,
      (user as any).annualIncome,
      (user as any).sourceOfFunds,
      (user as any).bankName,
      (user as any).accountNumber,
      (user as any).accountType,
    ];
    
    const completed = kycFields.filter(f => f && f.toString().trim()).length;
    return Math.round((completed / kycFields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const profileCompletion = calculateProfileCompletion();
  const isIndividual = user.accountType === 'INDIVIDUAL';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and KYC details</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Completion */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">Profile Completion</h3>
                <p className="text-sm text-muted-foreground">
                  {profileCompletion}% complete
                </p>
              </div>
              {profileCompletion === 100 ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <AlertCircle className="h-8 w-8 text-orange-500" />
              )}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            {profileCompletion < 100 && (
              <p className="text-xs text-muted-foreground mt-2">
                Complete your profile to unlock all features and improve your account security
              </p>
            )}
          </div>
        </div>

        {/* Verification Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`bg-card border rounded-lg p-4 ${user.isEmailVerified ? 'border-green-500/50' : 'border-border'}`}>
            <div className="flex items-center gap-3">
              <Mail className={`h-5 w-5 ${user.isEmailVerified ? 'text-green-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-muted-foreground">
                  {user.isEmailVerified ? 'Verified' : 'Not verified'}
                </p>
              </div>
            </div>
          </div>

          <div className={`bg-card border rounded-lg p-4 ${user.isPhoneVerified ? 'border-green-500/50' : 'border-border'}`}>
            <div className="flex items-center gap-3">
              <Phone className={`h-5 w-5 ${user.isPhoneVerified ? 'text-green-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-xs text-muted-foreground">
                  {user.isPhoneVerified ? 'Verified' : 'Not verified'}
                </p>
              </div>
            </div>
          </div>

          <div className={`bg-card border rounded-lg p-4 ${user.isKycVerified ? 'border-green-500/50' : 'border-border'}`}>
            <div className="flex items-center gap-3">
              <Shield className={`h-5 w-5 ${user.isKycVerified ? 'text-green-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-medium">KYC</p>
                <p className="text-xs text-muted-foreground">
                  {user.isKycVerified ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'personal'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'kyc'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            KYC & Verification
          </button>
        </div>

        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="space-y-6">
              
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      placeholder="Enter last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2 bg-muted border border-border rounded-lg opacity-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      disabled={!isEditing}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Account Type</label>
                    <input
                      type="text"
                      value={user.accountType}
                      disabled
                      className="w-full px-4 py-2 bg-muted border border-border rounded-lg opacity-50 cursor-not-allowed capitalize"
                    />
                  </div>
                </div>
              </div>

              {/* Organization Information (for Corporate/Institution) */}
              {!isIndividual && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Organization Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Organization Name *</label>
                      <input
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        placeholder="Company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Registration Number</label>
                      <input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        placeholder="Company registration number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Job Title</label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        placeholder="Your position"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Department</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        placeholder="Your department"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address *</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      placeholder="House number and street name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        placeholder="Postal code"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Country *</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* KYC Tab - Full 8-Step Wizard */}
        {activeTab === 'kyc' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="space-y-6">
              {/* KYC Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Complete Your KYC Verification
                </h2>
                <p className="text-muted-foreground">
                  Complete all 8 steps to unlock full trading capabilities and ensure regulatory compliance
                </p>
              </div>

              {/* Quick Access Button */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-border rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Ready to Complete Your KYC?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Follow our comprehensive 8-step verification process to complete your account setup
                </p>
                <a
                  href="/profile/kyc"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Shield className="h-5 w-5" />
                  Start KYC Verification
                </a>
              </div>

              {/* Current KYC Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`bg-card border rounded-lg p-4 ${user.isKycVerified ? 'border-green-500/50' : 'border-border'}`}>
                  <div className="flex items-center gap-3">
                    <Shield className={`h-5 w-5 ${user.isKycVerified ? 'text-green-500' : 'text-orange-500'}`} />
                    <div>
                      <p className="text-sm font-medium">KYC Status</p>
                      <p className="text-xs text-muted-foreground">
                        {user.isKycVerified ? 'Verified' : 'Not Started'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`bg-card border rounded-lg p-4 ${(user as any).csdAccountNumber ? 'border-green-500/50' : 'border-border'}`}>
                  <div className="flex items-center gap-3">
                    <Building className={`h-5 w-5 ${(user as any).csdAccountNumber ? 'text-green-500' : 'text-orange-500'}`} />
                    <div>
                      <p className="text-sm font-medium">CSD Account</p>
                      <p className="text-xs text-muted-foreground">
                        {(user as any).csdAccountNumber ? 'Active' : 'Not Created'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8-Step Overview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Verification Steps</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 1, name: 'Personal Info', icon: User, status: 'pending' },
                    { id: 2, name: 'Contact Info', icon: MapPin, status: 'pending' },
                    { id: 3, name: 'Identification', icon: Shield, status: 'pending' },
                    { id: 4, name: 'Tax Info', icon: FileText, status: 'pending' },
                    { id: 5, name: 'Employment', icon: Briefcase, status: 'pending' },
                    { id: 6, name: 'Financial Info', icon: CreditCard, status: 'pending' },
                    { id: 7, name: 'Bank Info', icon: CreditCard, status: 'pending' },
                    { id: 8, name: 'CSD Account', icon: Building, status: 'pending' },
                  ].map((step) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.id}
                        className="flex flex-col items-center p-3 bg-muted/50 border border-border rounded-lg"
                      >
                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mb-2">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="text-xs font-medium text-center">{step.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-500 mb-1">Why Complete KYC?</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Access to all Treasury auction opportunities</li>
                      <li>• Higher bidding limits and priority allocation</li>
                      <li>• Compliance with Ghana SEC and BoG regulations</li>
                      <li>• Enhanced security and fraud protection</li>
                      <li>• Faster transaction processing</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="text-center pt-6 border-t border-border">
                <a
                  href="/profile/kyc"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Start Complete KYC Process
                  <ArrowRight className="h-5 w-5" />
                </a>
                <p className="text-xs text-muted-foreground mt-2">
                  This will open our comprehensive 8-step verification wizard
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                // Reset to original values
                if (user) {
                  setFirstName(user.firstName || '');
                  setLastName(user.lastName || '');
                  setPhone(user.phone || '');
                  setDateOfBirth(user.dateOfBirth || '');
                  setAddress(user.address || '');
                  setCity(user.city || '');
                  setPostalCode(user.postalCode || '');
                  setCountry(user.country || 'Ghana');
                  setOrganizationName(user.organizationName || '');
                  setRegistrationNumber(user.registrationNumber || '');
                  setJobTitle(user.jobTitle || '');
                  setDepartment(user.department || '');
                  setGhanaCardNumber(user.ghanaCardNumber || '');
                  setTinNumber(user.tinNumber || '');
                  setBvnNumber(user.bvnNumber || '');
                }
              }}
              disabled={isSaving}
              className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
