export interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  createdAt: Date;
}

export interface Key {
  id: string;
  barcode: string;
  name: string;
  description: string;
  location?: string;
  isAvailable: boolean;
  createdAt: Date;
}

export interface KeyAssignment {
  id: string;
  keyId: string;
  userId: string;
  assignedAt: Date;
  returnedAt?: Date;
  notes?: string;
}

export interface AdminAuth {
  isAuthenticated: boolean;
  login: string;
}
