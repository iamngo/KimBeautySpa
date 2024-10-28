export interface Account {
    id: number;
    phone: string;
    type: string;
    status: string;
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
    id: number;
    accountId: number;
    address: string;
    dob: string;
    fullName: string;
    email: string;
    gender: boolean;
    image: string;
    phone: string;
    role: string,
    status: string,
    wageId: number
    // other fields specific to Employee
    
  }

  export interface Service {
    id: string;
    name: string;
    position: string;
    // other fields specific to Employee
  }
  