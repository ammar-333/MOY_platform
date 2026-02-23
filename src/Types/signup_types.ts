export interface registerData {
  commissioner_Name: string;
  commissioner_NID: string;
  commissioner_PhonNum: string;
  commissioner_Mail: string;
  commissioner_nationality: string;
  institutions_Name: string;
  institutions_Type: string;
  institutions_NID: number;
  institutions_Address: string;
  institutions_PhonNum: string;
  institutions_Email: string;
  applicant: string;
  delegation: string;
  password: string;
}

export interface RegisterForm {
  delegateName: string;
  delegateNationalId: string;
  delegatePhone: string;
  delegateEmail: string;
  delegateNationality: string;
  orgNationalName: string;
  companySector?: string;
  orgNationalId: number;
  orgAddress: string;
  orgPhone: string;
  orgEmail: string;
  password: string;
  delegateRole: string;
  file?: File;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  token: string;
}
