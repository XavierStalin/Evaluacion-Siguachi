export interface AuditRecord {
  id_interno: string;
  nombre_reporte: string;
  fecha_auditoria: string;
}

export interface User {
  id: { value: string };
  name: { first: string; last: string };
  dob: { date: string };
  picture: { medium: string };
  email?: string;
  phone?: string;
  cell?: string;
  location?: any;
}
