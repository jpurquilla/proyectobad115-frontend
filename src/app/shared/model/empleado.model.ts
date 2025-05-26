export interface DocumentoPersonal {
  tipo: string;
  numero: string;
}

export interface Empleado {
  id: number; // Changed from 'id?: number' or 'id: number | undefined'
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  apellidoCasada?: string;
  genero?: string;
  estadoCivil?: string;
  emails: string[];
  documentos: { tipo: string; numero: string }[];
  // New fields
  plaza?: string;
  puestoTrabajo?: string;
  salarioMensual?: number;
}