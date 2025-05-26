import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Empleado } from '../model/empleado.model';

@Injectable({ providedIn: 'root' })
export class EmpleadosService {
  private empleadosMock: Empleado[] = [
    {
      id: 1,
      primerNombre: 'Juan',
      segundoNombre: 'Carlos',
      primerApellido: 'Rodríguez',
      segundoApellido: 'Gómez',
      genero: 'M',
      estadoCivil: 'casado',
      emails: ['juan.rodriguez@empresa.com', 'juanc.rodriguez@personal.com'],
      documentos: [
        { tipo: 'dui', numero: '12345678-9' },
        { tipo: 'nit', numero: '1234-567890-123-4' }
      ],
      // Add new fields
      plaza: 'Director',
      puestoTrabajo: 'Director de Operaciones',
      salarioMensual: 3500.00
    },
    {
      id: 2,
      primerNombre: 'María',
      segundoNombre: 'Elena',
      primerApellido: 'Martínez',
      segundoApellido: 'López',
      apellidoCasada: 'Rodríguez',
      genero: 'F',
      estadoCivil: 'casado',
      emails: ['maria.martinez@empresa.com'],
      documentos: [
        { tipo: 'dui', numero: '23456789-0' }
      ],
      // Add new fields
      plaza: 'asistente',
      puestoTrabajo: 'Asistente Administrativo',
      salarioMensual: 850.00
    },
    {
      id: 3,
      primerNombre: 'Roberto',
      segundoNombre: '',
      primerApellido: 'Díaz',
      segundoApellido: 'Herrera',
      genero: 'M',
      estadoCivil: 'soltero',
      emails: ['roberto.diaz@empresa.com'],
      documentos: [
        { tipo: 'dui', numero: '34567890-1' },
        { tipo: 'pasaporte', numero: 'A12345678' }
      ],
      // Add new fields
      plaza: 'JefeBodega',
      puestoTrabajo: 'Jefe de Almacén Central',
      salarioMensual: 1200.00
    },
    {
      id: 4,
      primerNombre: 'Ana',
      segundoNombre: 'Isabel',
      primerApellido: 'Pérez',
      segundoApellido: 'Castro',
      genero: 'F',
      estadoCivil: 'divorciado',
      emails: ['ana.perez@empresa.com', 'anabelperez@personal.com'],
      documentos: [
        { tipo: 'dui', numero: '45678901-2' }
      ],
      // Add new fields
      plaza: 'asistente',
      puestoTrabajo: 'Asistente de Gerencia',
      salarioMensual: 900.00
    },
    {
      id: 5,
      primerNombre: 'Carlos',
      segundoNombre: 'Alberto',
      primerApellido: 'Flores',
      segundoApellido: 'Mendoza',
      genero: 'M',
      estadoCivil: 'viudo',
      emails: ['carlos.flores@empresa.com'],
      documentos: [
        { tipo: 'dui', numero: '56789012-3' },
        { tipo: 'nit', numero: '5678-901234-567-8' }
      ],
      // Add new fields
      plaza: 'programador',
      puestoTrabajo: 'Programador Senior',
      salarioMensual: 1800.00
    }
  ];

  private empleadosSubject = new BehaviorSubject<Empleado[]>([]);
  empleados$ = this.empleadosSubject.asObservable();

  constructor() {
    // Initialize with mock data
    this.empleadosSubject.next([...this.empleadosMock]);
  }

  obtenerEmpleados(): void {
    // In a real application, this would be an HTTP call to a backend API
    // For now, we'll just refresh the data from our mock list
    this.empleadosSubject.next([...this.empleadosMock]);
  }

  getEmpleados(): Empleado[] {
    return this.empleadosSubject.value;
  }

  agregarOActualizarEmpleado(empleado: Empleado) {
    const empleados = [...this.empleadosSubject.value];
    const idx = empleados.findIndex(e => e.id === empleado.id);
    if (idx !== -1) {
      empleados[idx] = { ...empleado };
    } else {
      empleados.push({ ...empleado });
      // Also update our mock data to persist changes during the session
      this.empleadosMock = [...empleados];
    }
    this.empleadosSubject.next(empleados);
  }

  eliminarEmpleado(id: number) {
    const empleados = this.empleadosSubject.value.filter(e => e.id !== id);
    this.empleadosSubject.next(empleados);
    // Also update the mock data to persist changes
    this.empleadosMock = [...empleados];
  }

  agregarEmail(id: number, email: string) {
    const empleados = [...this.empleadosSubject.value];
    const idx = empleados.findIndex(e => e.id === id);
    if (idx !== -1 && email && email.trim() !== '') {
      if (!empleados[idx].emails) empleados[idx].emails = [];
      empleados[idx].emails.push(email.trim());
      this.empleadosSubject.next(empleados);
    }
  }

  eliminarEmail(id: number, emailIndex: number) {
    const empleados = [...this.empleadosSubject.value];
    const idx = empleados.findIndex(e => e.id === id);
    if (idx !== -1 && empleados[idx].emails && empleados[idx].emails.length > 1) {
      empleados[idx].emails.splice(emailIndex, 1);
      this.empleadosSubject.next(empleados);
    }
  }

  agregarDocumento(id: number, documento: { tipo: string, numero: string }) {
    const empleados = [...this.empleadosSubject.value];
    const idx = empleados.findIndex(e => e.id === id);
    if (
      idx !== -1 &&
      documento &&
      documento.tipo &&
      documento.numero &&
      documento.tipo.trim() !== '' &&
      documento.numero.trim() !== ''
    ) {
      if (!empleados[idx].documentos) empleados[idx].documentos = [];
      empleados[idx].documentos.push({
        tipo: documento.tipo.trim(),
        numero: documento.numero.trim()
      });
      this.empleadosSubject.next(empleados);
    }
  }

  eliminarDocumento(id: number, docIndex: number) {
    const empleados = [...this.empleadosSubject.value];
    const idx = empleados.findIndex(e => e.id === id);
    if (idx !== -1 && empleados[idx].documentos && empleados[idx].documentos.length > 1) {
      empleados[idx].documentos.splice(docIndex, 1);
      this.empleadosSubject.next(empleados);
    }
  }
}