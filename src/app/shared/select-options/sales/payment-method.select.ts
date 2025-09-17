import { ISelectPrimeNG } from "@core/interface/select-primeng.interface";

export const paymentMethods: ISelectPrimeNG[] = [
  { label: 'Yape', value: 'YAPE', image: '/images/yape.svg' },
  { label: 'Efectivo', value: 'EFECTIVO', image: '/images/efectivo.svg' },
  { label: 'Transferencia Banca.', value: 'TRANSFERENCIA_BANCARIA', image: '/images/deposito.svg' },
  { label: 'Deposito Banca.', value: 'DEPOSITO_BANCARIO', image: '/images/deposito.svg' },
  { label: 'Tarjeta Credito/Debito', value: 'TARJETA_CRED_DEB', image: '/images/tarjeta.svg' },
];
