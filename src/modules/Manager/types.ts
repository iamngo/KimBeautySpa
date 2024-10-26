export interface Account {
    id: number;
    phone: string;
    type: string;
    status: string;
  }
  
  export interface Customer {
    id: string;
    name: string;
    email: string;
    // other fields specific to Customer
  }
  
  export interface Employee {
    id: string;
    name: string;
    position: string;
    // other fields specific to Employee
  }
  