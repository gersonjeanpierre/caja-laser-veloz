export interface Customer {
  id?: string;
  typePerson?: string | null;
  typeClient?: string | null;
  phone?: string | null;
  fullName?: string;
  socialReason?: string | null;
  dni?: string | null;
  ruc?: string | null;
  ce?: string | null;
  email?: string | null;
  isActive?: boolean;
}