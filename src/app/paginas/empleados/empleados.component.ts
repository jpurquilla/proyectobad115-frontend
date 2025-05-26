import { Component, OnInit } from '@angular/core';
import { Empleado } from '../../shared/model/empleado.model';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { EmpleadosService } from '../../shared/services/empleados.service';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api'; // Import these services
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Import this module
import { ToastModule } from 'primeng/toast'; // For notifications

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss'],
  imports: [
    TableModule, 
    FormsModule, 
    DialogModule, 
    DropdownModule, 
    CommonModule,
    InputText,
    ButtonModule,
    ConfirmDialogModule, // Add this
    ToastModule // Add this
  ],
  providers: [ConfirmationService, MessageService] // Add these providers
})
export class EmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadoSeleccionado: Empleado = this.getEmpleadoVacio();
  mostrarDialogo = false;
  generos = [
    { label: 'Femenino', value: 'F' },
    { label: 'Masculino', value: 'M' }
  ];
  estadosCiviles = [
    { label: 'Soltero/a', value: 'soltero' },
    { label: 'Casado/a', value: 'casado' },
    { label: 'Divorciado/a', value: 'divorciado' },
    { label: 'Viudo/a', value: 'viudo' }
  ];
  tiposDocumento = [
    { label: 'DUI', value: 'dui' },
    { label: 'NIT', value: 'nit' },
    { label: 'Pasaporte', value: 'pasaporte' }
  ];

  // Add this new property
  plazas = [
    { label: 'Asistente', value: 'asistente' }, 
    { label: 'Director', value: 'Director' }, 
    { label: 'Jefe Bodega', value: 'JefeBodega' },
    { label: 'Progamador', value: 'programador' },
    
  ];
  
  constructor(
    private empleadosService: EmpleadosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.empleadosService.empleados$.subscribe(emps => this.empleados = emps);
    // Add this line to load employees immediately
    this.empleadosService.obtenerEmpleados();
  }

  // This ensures empleadoSeleccionado always has properly initialized collections
  getEmpleadoVacio(): Empleado {
    return {
      id: 0,
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      apellidoCasada: '',
      emails: [''],
      genero: undefined,
      estadoCivil: undefined,
      documentos: [], // Initialize as empty array
      plaza: undefined,
      puestoTrabajo: '',
      salarioMensual: 0
    };
  }

  limpiarEmpleadoSeleccionado() {
    this.empleadoSeleccionado = this.getEmpleadoVacio();
  }

  editarEmpleado(empleado: Empleado) {
    // Create a deep copy to avoid modifying the original object directly
    this.empleadoSeleccionado = {
      ...empleado,
      emails: [...(empleado.emails || [''])],
      documentos: [...(empleado.documentos || [])]
    };
    
    // Ensure we have at least one document
    if ((this.empleadoSeleccionado.documentos?.length ?? 0) === 0) {
      this.empleadoSeleccionado.documentos = this.empleadoSeleccionado.documentos || [];
      this.empleadoSeleccionado.documentos.push({tipo: '', numero: ''});
    }
    
    this.mostrarDialogo = true;
  }

  nuevoEmpleado() {
    this.limpiarEmpleadoSeleccionado();
    // Generar nuevo ID solo visualmente, el servicio puede validar duplicados si es necesario
    this.empleadoSeleccionado!.id = this.generarNuevoId();
    this.mostrarDialogo = true;
  }

  generarNuevoId(): number {
    return this.empleados.length
      ? Math.max(...this.empleados.map(e => e.id).filter((id): id is number => typeof id === 'number')) + 1
      : 1;
  }

  guardarEmpleado() {
    if (this.empleadoSeleccionado) {
      this.empleadosService.agregarOActualizarEmpleado(this.empleadoSeleccionado);
      this.mostrarDialogo = false;
      this.empleadoSeleccionado = this.getEmpleadoVacio();
    }
  }

  cancelarEdicion() {
    this.mostrarDialogo = false;
    this.empleadoSeleccionado = this.getEmpleadoVacio();
  }

  agregarEmail(nuevoEmail: string) {
    if (
      this.empleadoSeleccionado &&
      typeof this.empleadoSeleccionado.id === 'number' &&
      nuevoEmail &&
      nuevoEmail.trim() !== ''
    ) {
      this.empleadosService.agregarEmail(this.empleadoSeleccionado.id, nuevoEmail);
    }
  }

  eliminarEmail(index: number) {
    if (this.empleadoSeleccionado && typeof this.empleadoSeleccionado.id === 'number') {
      this.empleadosService.eliminarEmail(this.empleadoSeleccionado.id, index);
    }
  }

  agregarDocumento(empleadoId: number, tipo: string, numero: string) {
    if (!this.empleadoSeleccionado.documentos) {
      this.empleadoSeleccionado.documentos = [];
    }
    this.empleadoSeleccionado.documentos.push({tipo, numero});
  }

  eliminarDocumento(empleadoId: number, indice: number) {
    if (this.empleadoSeleccionado.documentos && this.empleadoSeleccionado.documentos.length > 1) {
      this.empleadoSeleccionado.documentos.splice(indice, 1);
    }
  }

  getGeneroLabel(valor: string): string {
    const genero = this.generos.find(g => g.value === valor);
    return genero ? genero.label : '';
  }

  getEstadoCivilLabel(valor: string): string {
    const estado = this.estadosCiviles.find(e => e.value === valor);
    return estado ? estado.label : '';
  }

  getTipoDocumentoLabel(valor: string): string {
    const tipo = this.tiposDocumento.find(t => t.value === valor);
    return tipo ? tipo.label : '';
  }

  // Add this method to get the label for a plaza value
  getPlazaLabel(value: string | undefined): string {
    if (!value) return '';
    const plaza = this.plazas.find(p => p.value === value);
    return plaza ? plaza.label : value;
  }

  confirmarEliminar(empleado: Empleado) {
    // Make sure we have a valid ID before attempting to delete
    if (typeof empleado.id !== 'number') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de empleado no válido'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar a ${empleado.primerNombre} ${empleado.primerApellido}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarEmpleado(empleado.id as number); // Type assertion
      }
    });
  }

  eliminarEmpleado(id: number) {
    this.empleadosService.eliminarEmpleado(id);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Empleado eliminado correctamente'
    });
  }
}