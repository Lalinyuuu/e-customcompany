// Basic company information
export interface CompanyBasicInfo {
  customerCode: string;
  nameTh: string;
  nameEn: string;
  taxId: string;
  branch: string;
  companyPrefix?: string;
  companyGroupId?: string;
}

// Address information
export interface CompanyAddress {
  address: string;
  addressEn?: string;
  subDistrict: string;
  district: string;
  province: string;
  provinceCode?: string;
  zipCode: string;
}

// Contact information
export interface CompanyContact {
  phone: string;
  fax: string;
  email: string;
  dMailCorpId?: string;
}

// Company details and status
export interface CompanyDetails {
  buyerSellerStatus?: string;
  buyerTradeLevel?: string;
  exporterCode19Twis?: string;
  warehouseCode?: string;
  nswId?: string;
}

// Signing permissions
export interface CompanyPermissions {
  customerSignsElectronically?: boolean;
  isSignInvoice: boolean;
  isSignCustomsIn: boolean;
  isSignCustomsOut: boolean;
  isSignMovementControl?: boolean;
  isSignShortShip?: boolean;
  // Do not allow signing on behalf of
  isNotAllowSignInvoice?: boolean;
  isNotAllowSignCustomsOut?: boolean;
  isNotAllowSignCustomsIn?: boolean;
  isNotAllowSignMovementControl?: boolean;
  isNotAllowSignShortShip?: boolean;
}

// Usage rights
export interface CompanyUsageRights {
  usageType: 'GENERAL' | 'GOLD_CARD' | 'BROKER';
  goldCardNumber?: string;
  brokerNumber?: string;
  agentCustomerSequence?: string;
  taxRefundApplicantCode?: string;
  compensationRecipientRegNo?: string;
}

// Tax incentives and special registrations
export interface CompanyTaxInfo {
  bondedWarehouseProduction?: string;
  freeZoneOperator?: string;
  freeTradeZoneOperator?: string;
  exporterCode19Bis?: string;
  securityDepositNo?: string;
  bondNo?: string;
  depositNo?: string;
  payDepartmentFees?: boolean;
}

// Rubber registration
export interface CompanyRubberInfo {
  rubberTraderRegNo?: string;
  rubberExporterRegNo?: string;
  ltrRubberProducerRegNo?: string;
}

// Import permission
export interface CompanyImportPermission {
  importPermissionLoginName?: string;
  importPermissionPassword?: string;
  importPermissionConfirmPassword?: string;
}

// Report settings
export interface CompanyReportSettings {
  importReportForm?: string;
  exportReportForm?: string;
  exportReportFormAfterCustoms?: string;
  rbsMail?: string;
}

// Additional info
export interface CompanyAdditionalInfo {
  documentSenderNumber: string;
  boiRefNumber: string;
  aeoRefNumber: string;
}

export interface CompanyAudit {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Company
  extends
    CompanyBasicInfo,
    CompanyAddress,
    CompanyContact,
    CompanyDetails,
    CompanyPermissions,
    CompanyUsageRights,
    CompanyTaxInfo,
    CompanyRubberInfo,
    CompanyImportPermission,
    CompanyReportSettings,
    CompanyAdditionalInfo,
    CompanyAudit {
  id: string;
}

// Form data (without id)
export type CompanyFormData = Omit<Company, 'id'>;

// Create/Update DTOs
export type CreateCompanyDTO = CompanyFormData;
export type UpdateCompanyDTO = Partial<CompanyFormData> & { id: string };
