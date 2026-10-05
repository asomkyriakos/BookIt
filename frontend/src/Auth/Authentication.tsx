export type Role = "ADMIN" | "ORGANIZER" | "USER";

export interface CurrentUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address:string;
  role: Role;
  status:string;
}

export interface WithCurrentUser {
  currentUser: CurrentUser | null | undefined;
}
