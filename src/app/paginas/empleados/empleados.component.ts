import { Component, OnInit } from '@angular/core';
import { Empleado, DocumentoPersonal } from '../../shared/model/empleado.model';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import{CommonModule} from '@angular/common';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss'],
  imports: [TableModule, FormsModule, DialogModule,DropdownModule,CommonModule]
})
export class EmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
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
  empleadoSeleccionado : Empleado | null | undefined;
  mostrarDialogo = false;

  ngOnInit(): void {
   this.limpiarEmpleadoSeleccionado();
   
    this.empleados = [
      {
        id: 1,
        primerNombre: 'Ana',
        segundoNombre: 'María',
        primerApellido: 'Pérez',
        segundoApellido: 'López',
        apellidoCasada: '',
        emails: ['ana.perez@email.com'],
        genero: 'F',
        estadoCivil: 'casado',
        documentos: [
          { tipo: 'dui', numero: '12345678-9' }
        ]
      }
    ];
  }


  limpiarEmpleadoSeleccionado() {
    this.empleadoSeleccionado = {id: 0,
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    apellidoCasada: '',
    emails: [''],
    genero: '',
    estadoCivil: '',
    documentos: [{ tipo: '', numero: '' }]
  }
}

  editarEmpleado(empleado: Empleado) {
    if (empleado) {
      this.empleadoSeleccionado = JSON.parse(JSON.stringify(empleado));
      // Validar que las propiedades esenciales existan
      if (!this.empleadoSeleccionado?.emails || !Array.isArray(this.empleadoSeleccionado?.emails)) {
        //this.empleadoSeleccionado.emails = [''];
      }
      if (!this.empleadoSeleccionado?.documentos || !Array.isArray(this.empleadoSeleccionado.documentos)) {
       // this.empleadoSeleccionado.documentos = [{ tipo: '', numero: '' }];
      }
      this.mostrarDialogo = true;
    }
  }

  guardarEmpleado() {
    if (this.empleadoSeleccionado) {
      const idx = this.empleados.findIndex(e => e.id === this.empleadoSeleccionado!.id);
      if (idx !== -1) {
        this.empleados[idx] = JSON.parse(JSON.stringify(this.empleadoSeleccionado));
      }
      this.mostrarDialogo = false;
      this.empleadoSeleccionado = null;
    }
  }

  cancelarEdicion() {
    this.mostrarDialogo = false;
    this.empleadoSeleccionado = null;
  }

  agregarEmail() {
    if (this.empleadoSeleccionado) {
     // this.empleadoSeleccionado.emails.push('');
    }
  }

  eliminarEmail(index: number) {
    if (this.empleadoSeleccionado) {
    //  this.empleadoSeleccionado.emails.splice(index, 1);
    }
  }

  agregarDocumento() {
    if (this.empleadoSeleccionado) {
   //   this.empleadoSeleccionado.documentos.push({ tipo: '', numero: '' });
    }
  }

  eliminarDocumento(index: number) {
    if (this.empleadoSeleccionado) {
     // this.empleadoSeleccionado.documentos.splice(index, 1);
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
}