export interface Stand {
  id?: string;
  internalId: number;
  socialReason: string;
  ruc: string;
  name: string;
  address: string;
  phone: string;
  phoneExtra?: string | null;
  yape: string;
  yapeExtra?: string | null;
  bcpCta: string;
  bcpCtaExtra?: string | null;
  bcpCci: string;
  bcpCciExtra?: string | null;
  email: string;
  isActive?: boolean;
  galleryId?: string;
}