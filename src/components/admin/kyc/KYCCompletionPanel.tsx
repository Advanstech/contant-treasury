'use client';

import React, { useState } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Shield, 
  FileText, 
  Briefcase, 
  DollarSign, 
  CreditCard, 
  Building,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Loader2,
  Eye,
  AlertCircle,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import adminApi from '@/lib/admin-api';

interface KYCCompletionPanelProps {
  userId: string;
  userData: any;
  onClose: () => void;
  onComplete: () => void;
}

interface KYCData {
  // Step 1: Personal Information
  title: string;
  firstName: string;
  lastName: string;
  maritalStatus: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  residentialStatus: string;
  mothersMaidenName: string;
  
  // Step 2: Contact Information
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  
  // Step 3: Identification
  ghanaCardNumber: string;
  ghanaCardFront: string;
  ghanaCardBack: string;
  passportNumber: string;
  passportPhoto: string;
  idExpiryDate: string;
  
  // Step 4: Tax Information
  tinNumber: string;
  tinCertificate: string;
  
  // Step 5: Employment Information
  occupation: string;
  employmentSector: string;
  employerName: string;
  employerAddress: string;
  jobTitle: string;
  employmentStatus: string;
  
  // Step 6: Financial Information
  annualIncome: string;
  sourceOfFunds: string;
  investmentObjective: string;
  riskTolerance: string;
  
  // Step 7: Bank Information
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankBranch: string;
  accountType: string;
  
  // Step 8: CSD Account
  csdAccountNumber: string;
  csdAccountType: string;
  nomineeName: string;
  nomineeRelationship: string;
  beneficiaryDeclaration: boolean;
}

const kycSteps = [
  { id: 1, name: 'Personal Info', icon: User },
  { id: 2, name: 'Contact Info', icon: MapPin },
  { id: 3, name: 'Identification', icon: Shield },
  { id: 4, name: 'Tax Info', icon: FileText },
  { id: 5, name: 'Employment', icon: Briefcase },
  { id: 6, name: 'Financial Info', icon: DollarSign },
  { id: 7, name: 'Bank Info', icon: CreditCard },
  { id: 8, name: 'CSD Account', icon: Building },
];

export default function KYCCompletionPanel({ userId, userData, onClose, onComplete }: KYCCompletionPanelProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  
  const [kycData, setKycData] = useState<KYCData>({
    // Initialize with existing user data
    title: userData?.title || '',
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    maritalStatus: userData?.maritalStatus || '',
    dateOfBirth: userData?.dateOfBirth || '',
    placeOfBirth: userData?.placeOfBirth || '',
    nationality: userData?.nationality || 'GHANAIAN',
    residentialStatus: userData?.residentialStatus || 'RESIDENT',
    mothersMaidenName: userData?.mothersMaidenName || '',
    
    phone: userData?.phone || '',
    email: userData?.email || '',
    address: userData?.address || '',
    city: userData?.city || '',
    region: userData?.region || '',
    postalCode: userData?.postalCode || '',
    
    ghanaCardNumber: userData?.ghanaCardNumber || '',
    ghanaCardFront: userData?.ghanaCardFront || '',
    ghanaCardBack: userData?.ghanaCardBack || '',
    passportNumber: userData?.passportNumber || '',
    passportPhoto: userData?.passportPhoto || '',
    idExpiryDate: userData?.idExpiryDate || '',
    
    tinNumber: userData?.tinNumber || '',
    tinCertificate: userData?.tinCertificate || '',
    
    occupation: userData?.occupation || '',
    employmentSector: userData?.employmentSector || '',
    employerName: userData?.employerName || '',
    employerAddress: userData?.employerAddress || '',
    jobTitle: userData?.jobTitle || '',
    employmentStatus: userData?.employmentStatus || '',
    
    annualIncome: userData?.annualIncome || '',
    sourceOfFunds: userData?.sourceOfFunds || '',
    investmentObjective: userData?.investmentObjective || '',
    riskTolerance: userData?.riskTolerance || '',
    
    bankName: userData?.bankName || '',
    accountName: userData?.accountName || '',
    accountNumber: userData?.accountNumber || '',
    bankBranch: userData?.bankBranch || '',
    accountType: userData?.accountType || '',
    
    csdAccountNumber: userData?.csdAccountNumber || '',
    csdAccountType: userData?.csdAccountType || 'INDIVIDUAL',
    nomineeName: userData?.nomineeName || '',
    nomineeRelationship: userData?.nomineeRelationship || '',
    beneficiaryDeclaration: userData?.beneficiaryDeclaration || false,
  });

  const calculateProgress = () => {
    const totalFields = Object.keys(kycData).length;
    const filledFields = Object.values(kycData).filter(value => 
      value !== '' && value !== null && value !== false
    ).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const handleFileUpload = async (file: File, fieldName: string) => {
    const uploadKey = `${userId}-${fieldName}`;
    setUploadingFiles(prev => new Set(prev).add(uploadKey));
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('documentType', fieldName);
      
      const response = await adminApi.kyc.uploadDocument(userId, formData);
      
      setUploadedFiles(prev => ({
        ...prev,
        [fieldName]: response.fileUrl
      }));
      
      setKycData(prev => ({
        ...prev,
        [fieldName]: response.fileUrl
      }));
      
      toast.success('Document uploaded successfully');
    } catch (error: any) {
      toast.error('Failed to upload document', {
        description: error.response?.data?.message
      });
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(uploadKey);
        return newSet;
      });
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return kycData.firstName && kycData.lastName && kycData.dateOfBirth && kycData.nationality;
      case 2:
        return kycData.phone && kycData.email && kycData.address && kycData.city;
      case 3:
        return kycData.ghanaCardNumber && uploadedFiles.ghanaCardFront && uploadedFiles.ghanaCardBack;
      case 4:
        return kycData.tinNumber && uploadedFiles.tinCertificate;
      case 5:
        return kycData.occupation && kycData.employmentSector && kycData.employmentStatus;
      case 6:
        return kycData.annualIncome && kycData.sourceOfFunds && kycData.riskTolerance;
      case 7:
        return kycData.bankName && kycData.accountName && kycData.accountNumber;
      case 8:
        return kycData.csdAccountNumber && kycData.beneficiaryDeclaration;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      toast.error('Please complete all required fields');
      return;
    }
    
    // Auto-save current step
    await saveCurrentStep();
    
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      await submitKYC();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveCurrentStep = async () => {
    try {
      await adminApi.kyc.update(userId, kycData);
      toast.success('Progress saved');
    } catch (error: any) {
      console.error('Auto-save failed:', error);
    }
  };

  const submitKYC = async () => {
    try {
      setLoading(true);
      await adminApi.kyc.completeKYC(userId, {
        ...kycData,
        documents: uploadedFiles
      });
      
      toast.success('KYC completed successfully!', {
        description: 'User can now access full trading capabilities.'
      });
      
      onComplete();
      onClose();
    } catch (error: any) {
      toast.error('Failed to complete KYC', {
        description: error.response?.data?.message
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Title</label>
                <select
                  value={kycData.title}
                  onChange={(e) => setKycData({ ...kycData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Marital Status</label>
                <select
                  value={kycData.maritalStatus}
                  onChange={(e) => setKycData({ ...kycData, maritalStatus: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Status</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">First Name</label>
                <input
                  type="text"
                  value={kycData.firstName}
                  onChange={(e) => setKycData({ ...kycData, firstName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Last Name</label>
                <input
                  type="text"
                  value={kycData.lastName}
                  onChange={(e) => setKycData({ ...kycData, lastName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Mensah"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Date of Birth</label>
                <input
                  type="date"
                  value={kycData.dateOfBirth}
                  onChange={(e) => setKycData({ ...kycData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Place of Birth</label>
                <input
                  type="text"
                  value={kycData.placeOfBirth}
                  onChange={(e) => setKycData({ ...kycData, placeOfBirth: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Accra, Ghana"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Nationality</label>
                <select
                  value={kycData.nationality}
                  onChange={(e) => setKycData({ ...kycData, nationality: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="GHANAIAN">Ghanaian</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Residential Status</label>
                <select
                  value={kycData.residentialStatus}
                  onChange={(e) => setKycData({ ...kycData, residentialStatus: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="RESIDENT">Resident</option>
                  <option value="NON_RESIDENT">Non-Resident</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Mother's Maiden Name</label>
              <input
                type="text"
                value={kycData.mothersMaidenName}
                onChange={(e) => setKycData({ ...kycData, mothersMaidenName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Security question answer"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Contact Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Phone Number</label>
                <input
                  type="tel"
                  value={kycData.phone}
                  onChange={(e) => setKycData({ ...kycData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email Address</label>
                <input
                  type="email"
                  value={kycData.email}
                  onChange={(e) => setKycData({ ...kycData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="john.mensah@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Residential Address</label>
              <input
                type="text"
                value={kycData.address}
                onChange={(e) => setKycData({ ...kycData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="House Number, Street Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">City</label>
                <input
                  type="text"
                  value={kycData.city}
                  onChange={(e) => setKycData({ ...kycData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Accra"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Region</label>
                <select
                  value={kycData.region}
                  onChange={(e) => setKycData({ ...kycData, region: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Region</option>
                  <option value="GREATER_ACCRA">Greater Accra</option>
                  <option value="ASHANTI">Ashanti</option>
                  <option value="WESTERN">Western</option>
                  <option value="EASTERN">Eastern</option>
                  <option value="CENTRAL">Central</option>
                  <option value="VOLTA">Volta</option>
                  <option value="BRONG_AHAFO">Brong Ahafo</option>
                  <option value="NORTHERN">Northern</option>
                  <option value="UPPER_EAST">Upper East</option>
                  <option value="UPPER_WEST">Upper West</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Postal Code</label>
              <input
                type="text"
                value={kycData.postalCode}
                onChange={(e) => setKycData({ ...kycData, postalCode: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="GP-XXX"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Identification Documents</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Ghana Card Number</label>
              <input
                type="text"
                value={kycData.ghanaCardNumber}
                onChange={(e) => setKycData({ ...kycData, ghanaCardNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="GHA-XXXXXXXXX-X"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">ID Expiry Date</label>
              <input
                type="date"
                value={kycData.idExpiryDate}
                onChange={(e) => setKycData({ ...kycData, idExpiryDate: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Ghana Card (Front)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  {uploadedFiles.ghanaCardFront || kycData.ghanaCardFront ? (
                    <div className="relative">
                      <img 
                        src={uploadedFiles.ghanaCardFront || kycData.ghanaCardFront} 
                        alt="Ghana Card Front" 
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        onClick={() => {
                          setUploadedFiles(prev => ({ ...prev, ghanaCardFront: '' }));
                          setKycData(prev => ({ ...prev, ghanaCardFront: '' }));
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Upload front of Ghana Card</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'ghanaCardFront')}
                        className="hidden"
                        id="adminGhanaCardFront"
                      />
                      <label
                        htmlFor="adminGhanaCardFront"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90"
                      >
                        {uploadingFiles.has(`${userId}-ghanaCardFront`) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Choose File
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Ghana Card (Back)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  {uploadedFiles.ghanaCardBack || kycData.ghanaCardBack ? (
                    <div className="relative">
                      <img 
                        src={uploadedFiles.ghanaCardBack || kycData.ghanaCardBack} 
                        alt="Ghana Card Back" 
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        onClick={() => {
                          setUploadedFiles(prev => ({ ...prev, ghanaCardBack: '' }));
                          setKycData(prev => ({ ...prev, ghanaCardBack: '' }));
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Upload back of Ghana Card</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'ghanaCardBack')}
                        className="hidden"
                        id="adminGhanaCardBack"
                      />
                      <label
                        htmlFor="adminGhanaCardBack"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90"
                      >
                        {uploadingFiles.has(`${userId}-ghanaCardBack`) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Choose File
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Tax Information</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">TIN Number</label>
              <input
                type="text"
                value={kycData.tinNumber}
                onChange={(e) => setKycData({ ...kycData, tinNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="P0000000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">TIN Certificate</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                {uploadedFiles.tinCertificate || kycData.tinCertificate ? (
                  <div className="relative">
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-sm text-foreground">TIN Certificate Uploaded</span>
                      </div>
                      <button
                        onClick={() => {
                          setUploadedFiles(prev => ({ ...prev, tinCertificate: '' }));
                          setKycData(prev => ({ ...prev, tinCertificate: '' }));
                        }}
                        className="p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Upload TIN Certificate</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'tinCertificate')}
                      className="hidden"
                      id="adminTinCertificate"
                    />
                    <label
                      htmlFor="adminTinCertificate"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90"
                    >
                      {uploadingFiles.has(`${userId}-tinCertificate`) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Choose File
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Employment Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Occupation</label>
                <input
                  type="text"
                  value={kycData.occupation}
                  onChange={(e) => setKycData({ ...kycData, occupation: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Employment Status</label>
                <select
                  value={kycData.employmentStatus}
                  onChange={(e) => setKycData({ ...kycData, employmentStatus: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Status</option>
                  <option value="EMPLOYED">Employed</option>
                  <option value="SELF_EMPLOYED">Self Employed</option>
                  <option value="BUSINESS_OWNER">Business Owner</option>
                  <option value="RETIRED">Retired</option>
                  <option value="STUDENT">Student</option>
                  <option value="UNEMPLOYED">Unemployed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Employment Sector</label>
              <select
                value={kycData.employmentSector}
                onChange={(e) => setKycData({ ...kycData, employmentSector: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Sector</option>
                <option value="BANKING_FINANCE">Banking & Finance</option>
                <option value="TECHNOLOGY">Technology</option>
                <option value="HEALTHCARE">Healthcare</option>
                <option value="EDUCATION">Education</option>
                <option value="GOVERNMENT">Government</option>
                <option value="MANUFACTURING">Manufacturing</option>
                <option value="TELECOMMUNICATIONS">Telecommunications</option>
                <option value="OIL_GAS">Oil & Gas</option>
                <option value="AGRICULTURE">Agriculture</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Job Title</label>
                <input
                  type="text"
                  value={kycData.jobTitle}
                  onChange={(e) => setKycData({ ...kycData, jobTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Senior Developer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Employer Name</label>
                <input
                  type="text"
                  value={kycData.employerName}
                  onChange={(e) => setKycData({ ...kycData, employerName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Company Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Employer Address</label>
              <input
                type="text"
                value={kycData.employerAddress}
                onChange={(e) => setKycData({ ...kycData, employerAddress: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Company Address"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Financial Information</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Annual Income Range</label>
              <select
                value={kycData.annualIncome}
                onChange={(e) => setKycData({ ...kycData, annualIncome: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Income Range</option>
                <option value="BELOW_10K">Below ₵10,000</option>
                <option value="10K_25K">₵10,000 - ₵25,000</option>
                <option value="25K_50K">₵25,000 - ₵50,000</option>
                <option value="50K_100K">₵50,000 - ₵100,000</option>
                <option value="100K_250K">₵100,000 - ₵250,000</option>
                <option value="250K_500K">₵250,000 - ₵500,000</option>
                <option value="ABOVE_500K">Above ₵500,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Source of Funds</label>
              <select
                value={kycData.sourceOfFunds}
                onChange={(e) => setKycData({ ...kycData, sourceOfFunds: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Source</option>
                <option value="SALARY">Salary/Income</option>
                <option value="BUSINESS">Business Income</option>
                <option value="INVESTMENT">Investment Returns</option>
                <option value="INHERITANCE">Inheritance</option>
                <option value="SAVINGS">Personal Savings</option>
                <option value="GIFT">Gift/Donation</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Investment Objective</label>
              <select
                value={kycData.investmentObjective}
                onChange={(e) => setKycData({ ...kycData, investmentObjective: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Objective</option>
                <option value="CAPITAL_PRESERVATION">Capital Preservation</option>
                <option value="INCOME_GENERATION">Income Generation</option>
                <option value="CAPITAL_GROWTH">Capital Growth</option>
                <option value="BALANCED">Balanced</option>
                <option value="SPECULATION">Speculation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Risk Tolerance</label>
              <select
                value={kycData.riskTolerance}
                onChange={(e) => setKycData({ ...kycData, riskTolerance: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Risk Level</option>
                <option value="CONSERVATIVE">Conservative - Low risk, low returns</option>
                <option value="MODERATE">Moderate - Balanced risk and returns</option>
                <option value="AGGRESSIVE">Aggressive - High risk, high returns</option>
              </select>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Bank Information</h3>
            <p className="text-sm text-muted-foreground">
              For dividend, interest and maturity disposal instructions
            </p>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Bank Name</label>
              <select
                value={kycData.bankName}
                onChange={(e) => setKycData({ ...kycData, bankName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Bank</option>
                <option value="GCB_BANK">GCB Bank</option>
                <option value="ECOBANK">Ecobank Ghana</option>
                <option value="STANDARD_CHARTERED">Standard Chartered</option>
                <option value="BARCLAYS">Barclays Bank</option>
                <option value="ZENITH">Zenith Bank</option>
                <option value="GTBANK">GTBank</option>
                <option value="UBA">UBA Ghana</option>
                <option value="FIDELITY">Fidelity Bank</option>
                <option value="CAL_BANK">CalBank</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Account Name</label>
                <input
                  type="text"
                  value={kycData.accountName}
                  onChange={(e) => setKycData({ ...kycData, accountName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Mensah"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Account Number</label>
                <input
                  type="text"
                  value={kycData.accountNumber}
                  onChange={(e) => setKycData({ ...kycData, accountNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="1234567890"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Bank Branch</label>
                <input
                  type="text"
                  value={kycData.bankBranch}
                  onChange={(e) => setKycData({ ...kycData, bankBranch: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Accra Main Branch"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Account Type</label>
                <select
                  value={kycData.accountType}
                  onChange={(e) => setKycData({ ...kycData, accountType: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Type</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="CURRENT">Current</option>
                  <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">CSD Account Information</h3>
            <p className="text-sm text-muted-foreground">
              Ghana Central Securities Depository account details
            </p>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">CSD Account Number</label>
              <input
                type="text"
                value={kycData.csdAccountNumber}
                onChange={(e) => setKycData({ ...kycData, csdAccountNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="CSD-XXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">CSD Account Type</label>
              <select
                value={kycData.csdAccountType}
                onChange={(e) => setKycData({ ...kycData, csdAccountType: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="INDIVIDUAL">Individual</option>
                <option value="JOINT">Joint</option>
                <option value="CORPORATE">Corporate</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Nominee Name</label>
                <input
                  type="text"
                  value={kycData.nomineeName}
                  onChange={(e) => setKycData({ ...kycData, nomineeName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nominee full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Nominee Relationship</label>
                <input
                  type="text"
                  value={kycData.nomineeRelationship}
                  onChange={(e) => setKycData({ ...kycData, nomineeRelationship: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Spouse, Child, etc."
                />
              </div>
            </div>

            <div className="border border-border rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={kycData.beneficiaryDeclaration}
                  onChange={(e) => setKycData({ ...kycData, beneficiaryDeclaration: e.target.checked })}
                  className="mt-1"
                />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Beneficiary Declaration</p>
                  <p className="text-muted-foreground">
                    I declare that the information provided is true and correct. I understand that 
                    any false information may result in the rejection of this application.
                  </p>
                </div>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex">
      {/* Overlay */}
      <div className="flex-1" onClick={onClose} />
      
      {/* Slide-over Panel */}
      <div className="w-full max-w-4xl bg-background border-l border-border overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Complete KYC for {userData?.firstName} {userData?.lastName}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-semibold text-primary">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between">
            {kycSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = calculateProgress() >= (step.id * 12.5);
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-muted text-muted-foreground'
                      }`}
                      title={step.name}
                    >
                      {isCompleted && !isActive ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </button>
                    <div className="text-xs mt-1 font-medium text-center max-w-16">
                      {step.name}
                    </div>
                  </div>
                  {index < kycSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 transition-colors ${
                      isCompleted ? 'bg-green-500' : 'bg-muted'
                    }`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="sticky bottom-0 bg-background border-t border-border p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={saveCurrentStep}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Progress
              </button>
              
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of 8
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : currentStep === 8 ? (
                'Complete KYC'
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
