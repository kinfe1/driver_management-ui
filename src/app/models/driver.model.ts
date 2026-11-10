export interface DriverDocument {
  id?: string;
  driverId?: string;
  driverName?: string;

  documentType: string;

  issueDate?: string;
  expiryDate?: string;

  status: string;

  originalFileName?: string;
  storedFileName?: string;
  fileName?: string;
  fileUrl?: string;
  contentType?: string;
  fileSize?: number;

  remarks?: string;
  rejectionReason?: string;

  createdAt?: string;
  updatedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface DriverAssignment {
  plate: string;
  type: string;
  model: string;
  assignedAt: string;
  status: string;
}

export interface Driver {
  id?: string;

  firstName: string;
  middleName?: string;
  lastName: string;

  gender?: string;
  dateOfBirth?: string;
  nationality?: string;

  phone: string;
  secondaryPhone?: string;
  email: string;
  address?: string;

  employeeId: string;
  branch: string;
  driverType: string;

  licenseNumber: string;
  licenseExpiry: string;

  status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL' | 'INACTIVE';

  photoUrl?: string;

  // Profile page fields (future features)
  assignedVehicle?: string;
  assignedVehicleModel?: string;

  documents?: DriverDocument[];
  assignmentHistory?: DriverAssignment[];

  profileCompleteness?: number;
}
