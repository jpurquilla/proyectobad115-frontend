export interface DocumentoPersonal {
  tipo: string;
  numero: string;
}

export interface Empleado {
  id?: number;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  apellidoCasada?: string;
  emails?: string[];
  genero?: string;
  estadoCivil?: string;
  documentos?: DocumentoPersonal[];
}