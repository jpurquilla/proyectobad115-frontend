import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PlanillaService } from '../../shared/services/planilla.service';
import { PlanillaEmpleado } from '../../shared/model/planilla.model';
// Importar las librerías para PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-planilla',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TableModule, 
    DropdownModule, 
    ButtonModule, 
    CardModule,
    RadioButtonModule,
    PanelModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './planilla.component.html',
  styleUrls: ['./planilla.component.scss']
})
export class PlanillaComponent implements OnInit {
  planillaEmpleados: PlanillaEmpleado[] = [];
  periodoSeleccionado: 'mensual' | 'quincenal' = 'mensual';
  fechaCalculo: Date = new Date();
  totalPlanilla = {
    totalSalarios: 0,
    totalDeducciones: 0,
    totalNeto: 0,
    totalPatronal: 0, 
    totalCosto: 0
  };
  
  // Propiedades para la boleta de pago
  mostrarBoleta: boolean = false;
  empleadoSeleccionado: PlanillaEmpleado | null = null;
  nombreEmpresa: string = 'EMPRESA, S.A. DE C.V.';
  direccionEmpresa: string = 'San Salvador, El Salvador';
  periodoPago: string = '';
  
  // Propiedades para PDF
  generandoPDF: boolean = false;
  
  constructor(
    private planillaService: PlanillaService,
    private messageService: MessageService
  ) {}
  
  ngOnInit(): void {
    this.calcularPlanilla();
    this.planillaService.planilla$.subscribe(planilla => {
      this.planillaEmpleados = planilla;
      this.totalPlanilla = this.planillaService.getTotalPlanilla();
      this.actualizarPeriodoPago();
    });
  }
  
  calcularPlanilla(): void {
    this.planillaService.calcularPlanilla(this.periodoSeleccionado);
    this.actualizarPeriodoPago();
  }
  
  cambiarPeriodo(): void {
    this.calcularPlanilla();
  }
  
  actualizarPeriodoPago(): void {
    const fecha = this.fechaCalculo;
    const mes = fecha.toLocaleString('es-ES', { month: 'long' });
    const año = fecha.getFullYear();
    
    if (this.periodoSeleccionado === 'mensual') {
      this.periodoPago = `${mes} ${año}`;
    } else {
      // Para quincena determinamos si es primera o segunda
      const dia = fecha.getDate();
      const quincena = dia <= 15 ? 'Primera' : 'Segunda';
      this.periodoPago = `${quincena} quincena de ${mes} ${año}`;
    }
  }
  
  verBoleta(empleado: PlanillaEmpleado): void {
    this.empleadoSeleccionado = empleado;
    this.mostrarBoleta = true;
  }
  
  imprimirBoleta(): void {
    const contenidoOriginal = document.body.innerHTML;
    
    // Capturar solo el contenido del modal para imprimir
    const contenidoModal = document.getElementById('boleta-imprimir');
    
    if (contenidoModal) {
      const estilosPagina = `
        <style>
          body { font-family: Arial, sans-serif; }
          .header { text-align: center; margin-bottom: 20px; }
          .logo { max-height: 60px; }
          .titulo-boleta { font-size: 18px; font-weight: bold; margin: 10px 0; }
          .info-empresa { margin-bottom: 15px; }
          .info-empleado { margin-bottom: 15px; border: 1px solid #ddd; padding: 10px; }
          .tabla-resumen { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .tabla-resumen th, .tabla-resumen td { border: 1px solid #ddd; padding: 8px; }
          .tabla-resumen th { background-color: #f2f2f2; }
          .total { font-weight: bold; }
          .pie-pagina { margin-top: 30px; font-size: 12px; text-align: center; }
          .firma { margin-top: 50px; border-top: 1px solid #000; width: 200px; text-align: center; }
          @media print {
            button { display: none !important; }
          }
        </style>
      `;
      
      document.body.innerHTML = estilosPagina + contenidoModal.innerHTML;
      
      window.print();
      
      // Restaurar el contenido original
      document.body.innerHTML = contenidoOriginal;
      
      this.messageService.add({
        severity: 'success',
        summary: 'Boleta enviada a impresión',
        detail: 'La boleta de pago ha sido enviada a su impresora'
      });
    }
  }
  
  // Método para descargar la boleta como PDF
  descargarBoleta(): void {
    this.generandoPDF = true;
    
    // Notificar al usuario que se está generando el PDF
    this.messageService.add({
      severity: 'info',
      summary: 'Generando PDF',
      detail: 'Por favor espere mientras se genera el documento'
    });
    
    // Definir el contenido a convertir a PDF
    const elemento = document.getElementById('boleta-imprimir');
    
    if (elemento) {
      setTimeout(() => {
        // Opciones para mejor calidad
        const opciones = {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0
        };
        
        // Convertir el HTML a canvas
        html2canvas(elemento, opciones).then(canvas => {
          // Configurar el PDF
          const imgWidth = 208; // Ancho en mm (A4)
          const pageHeight = 295; // Alto en mm (A4)
          const imgHeight = canvas.height * imgWidth / canvas.width;
          const heightLeft = imgHeight;
          
          // Inicializar el PDF
          const pdf = new jsPDF('p', 'mm', 'a4');
          
          // Añadir la imagen al PDF
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          
          // Generar nombre del archivo
          const nombreArchivo = `Boleta_${this.empleadoSeleccionado?.id}_${this.periodoPago.replace(/ /g, '_')}.pdf`;
          
          // Guardar el PDF
          pdf.save(nombreArchivo);
          
          this.generandoPDF = false;
          
          // Notificar al usuario que el PDF ha sido generado
          this.messageService.add({
            severity: 'success',
            summary: 'PDF Generado',
            detail: `El archivo "${nombreArchivo}" ha sido descargado`
          });
        }).catch(error => {
          console.error('Error al generar el PDF:', error);
          this.generandoPDF = false;
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo generar el PDF. Inténtelo de nuevo más tarde.'
          });
        });
      }, 500); // Dar tiempo para que el DOM se actualice completamente
    } else {
      this.generandoPDF = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontró el contenido para generar el PDF'
      });
    }
  }
  
  // Método para generar PDF de todas las boletas
  generarPDFTodasBoletas(): void {
    this.generandoPDF = true;
    
    this.messageService.add({
      severity: 'info',
      summary: 'Generando PDF',
      detail: 'Generando PDF con todas las boletas. Este proceso puede tardar unos momentos.'
    });
    
    // Crear un nuevo PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const promises: Promise<void>[] = [];
    let currentPage = 1;
    
    // Por cada empleado, generar una página
    this.planillaEmpleados.forEach((empleado, index) => {
      // Seleccionar el empleado actual para mostrar sus datos
      const originalEmpleado = this.empleadoSeleccionado;
      this.empleadoSeleccionado = empleado;
      
      // Dar tiempo para que el cambio se refleje en el DOM
      promises.push(new Promise<void>((resolve) => {
        setTimeout(() => {
          // Clonar el contenido de la boleta para no afectar la vista
          const boletaOriginal = document.getElementById('boleta-imprimir');
          
          if (boletaOriginal) {
            const clon = boletaOriginal.cloneNode(true) as HTMLElement;
            clon.style.display = 'block';
            clon.style.position = 'absolute';
            clon.style.left = '-9999px';
            document.body.appendChild(clon);
            
            // Convertir a canvas
            html2canvas(clon, {
              scale: 2,
              useCORS: true,
              allowTaint: true
            }).then(canvas => {
              // Configurar dimensiones
              const imgWidth = 208;
              const imgHeight = canvas.height * imgWidth / canvas.width;
              
              // Añadir nueva página si no es la primera
              if (index > 0) {
                pdf.addPage();
                currentPage++;
              }
              
              // Añadir imagen al PDF
              const imgData = canvas.toDataURL('image/png');
              pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
              
              // Eliminar el clon del DOM
              document.body.removeChild(clon);
              resolve();
            });
          } else {
            resolve();
          }
        }, 100);
      }));
    });
    
    // Una vez todas las páginas han sido procesadas
    Promise.all(promises).then(() => {
      // Restaurar el empleado seleccionado original
      this.empleadoSeleccionado = this.planillaEmpleados[0];
      
      // Generar nombre del archivo
      const nombreArchivo = `Boletas_${this.periodoPago.replace(/ /g, '_')}.pdf`;
      
      // Guardar el PDF
      pdf.save(nombreArchivo);
      
      this.generandoPDF = false;
      
      this.messageService.add({
        severity: 'success',
        summary: 'PDF Generado',
        detail: `Se ha generado el archivo "${nombreArchivo}" con ${this.planillaEmpleados.length} boletas`
      });
    }).catch(error => {
      console.error('Error al generar el PDF masivo:', error);
      this.generandoPDF = false;
      
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al generar el PDF con todas las boletas'
      });
    });
  }
}