export interface Account {
  id?: number;
  phone: string;
  type: string;
  status: string;
}

export interface Event {
  id?: number;
  name: string;
  startDate: string;
  expiryDate: string;
  image: string;
}

export interface ServiceCategory {
  id?: number;
  name: string;
  roomId: number;
}

export interface Product {
  id?: number;
  name: string;
  status: string;
  image: string;
  serviceCategoryId: number;
}

export interface Customer {
  id: number;
  accountId: number;
  address: string;
  dob: string;
  fullName: string;
  email: string;
  gender: boolean;
  image: string;
  phone: string;
}

export interface Employee {
  id?: number;
  accountId?: number;
  address: string;
  dob: string;
  fullName: string;
  email: string;
  gender: boolean;
  image: string;
  phone: string;
  role: string;
  status: string;
  wageId: number;
  // other fields specific to Employee
}

export interface Service {
  id: number;
  name: string;
  image: string;
  serviceCategoryId: number;
  status: string;
  duration: number;
}

export interface Appointment {
  id: number;
  dateTime: string;
  status: string;
  category: string;
  serviceOrTreatmentId: number;
  employeeId: number;
  customerId: number;
  branch: string;
  bedId: string;
  bonusId: string;
  serviceName?: string;
  employeeName?: string;
  customerName?: string;
  bedName?: string;
  expense?: number;
}

export interface IWage {
  id: number;
  hourlyRate: number;
  effectiveDate: string;
  role: string;
}

export interface IVoucher {
  id: number;
  discount: number;
  minimumOrder: number;
  maximumDiscount: number;
  expiryDate: string;
  point: number;
  image: string;
}

export interface IGift {
  id: number;
  name: string;
  point: number;
  image: string;
  status: boolean;
}
