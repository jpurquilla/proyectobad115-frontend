export interface Documento {
  tipo: string;
  numero: string;
}

export interface Empleado {
  id: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  apellidoCasada: string;
  emails: string[];
  genero: string | null;
  estadoCivil: string | null;
  documentos: Documento[];
}