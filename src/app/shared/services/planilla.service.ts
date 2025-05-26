import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Empleado } from '../model/empleado.model';
import { PlanillaEmpleado } from '../model/planilla.model';
import { EmpleadosService } from './empleados.service';

@Injectable({
  providedIn: 'root'
})
export class PlanillaService {
  private planillaSubject = new BehaviorSubject<PlanillaEmpleado[]>([]);
  planilla$ = this.planillaSubject.asObservable();

  // Constantes de ley en El Salvador
  private readonly ISSS_TOPE = 1000.00; // Tope de cotización ISSS en El Salvador
  private readonly ISSS_PORCENTAJE = 0.03; // 3%
  private readonly ISSS_PATRONAL = 0.075; // 7.5%
  private readonly AFP_PORCENTAJE = 0.0725; // 7.25%
  private readonly AFP_PATRONAL = 0.0775; // 7.75%
  private readonly INSAFORV_PATRONAL = 0.05; // 5%

  constructor(private empleadosService: EmpleadosService) {}

  calcularPlanilla(periodoType: 'mensual' | 'quincenal' = 'mensual'): void {
    this.empleadosService.empleados$.subscribe(empleados => {
      const planilla = empleados.map(empleado => this.calcularPlanillaEmpleado(empleado, periodoType));
      this.planillaSubject.next(planilla);
    });
  }

  private calcularPlanillaEmpleado(empleado: Empleado, periodoType: 'mensual' | 'quincenal'): PlanillaEmpleado {
    const factor = periodoType === 'quincenal' ? 0.5 : 1;
    const salarioBase = empleado.salarioMensual || 0;
    const salarioPeriodo = salarioBase * factor;
    
    // Cálculo de deducciones
    let isss = Math.min(salarioBase, this.ISSS_TOPE) * this.ISSS_PORCENTAJE * factor;
    let afp = salarioPeriodo * this.AFP_PORCENTAJE;
    
    // Cálculo de renta (base anual para estimación mensual)
    let rentaCalculada = this.calcularRenta(salarioPeriodo, isss, afp);
    
    // Deducciones totales
    let totalDeducciones = isss + afp + rentaCalculada;
    let salarioNeto = salarioPeriodo - totalDeducciones;
    
    // Aportaciones patronales
    let isssPatronal = Math.min(salarioBase, this.ISSS_TOPE) * this.ISSS_PATRONAL * factor;
    let afpPatronal = salarioPeriodo * this.AFP_PATRONAL;
    let insaforvPatronal = salarioPeriodo * this.INSAFORV_PATRONAL;
    let totalPatronal = isssPatronal + afpPatronal + insaforvPatronal;
    
    // Costo total para la empresa
    let costoTotal = salarioPeriodo + totalPatronal;
    
    const nombreCompleto = `${empleado.primerNombre} ${empleado.segundoNombre || ''} ${empleado.primerApellido} ${empleado.segundoApellido || ''}`.trim();
    
    return {
      id: empleado.id as number,
      nombreCompleto,
      salarioMensual: salarioBase,
      salarioQuincenal: salarioBase * 0.5,
      isss,
      afp,
      renta: rentaCalculada,
      totalDeducciones,
      salarioNeto,
      isssPatronal,
      afpPatronal,
      insaforvPatronal,
      totalPatronal,
      costoTotal
    };
  }

  private calcularRenta(salarioPeriodo: number, isss: number, afp: number): number {
    // Base imponible: salario - ISSS - AFP
    const baseImponible = salarioPeriodo - isss - afp;
    
    // Cálculo simplificado según tabla de ISR de El Salvador
    // Para cálculo mensual (aproximado)
    if (baseImponible <= 472.00) {
      return 0;
    } else if (baseImponible <= 895.24) {
      return (baseImponible - 472.00) * 0.1 + 17.67;
    } else if (baseImponible <= 2038.10) {
      return (baseImponible - 895.24) * 0.2 + 60.00;
    } else {
      return (baseImponible - 2038.10) * 0.3 + 288.57;
    }
  }

  getTotalPlanilla(): { totalSalarios: number, totalDeducciones: number, totalNeto: number, totalPatronal: number, totalCosto: number } {
    const planilla = this.planillaSubject.getValue();
    return {
      totalSalarios: planilla.reduce((sum, emp) => sum + emp.salarioMensual, 0),
      totalDeducciones: planilla.reduce((sum, emp) => sum + emp.totalDeducciones, 0),
      totalNeto: planilla.reduce((sum, emp) => sum + emp.salarioNeto, 0),
      totalPatronal: planilla.reduce((sum, emp) => sum + emp.totalPatronal, 0),
      totalCosto: planilla.reduce((sum, emp) => sum + emp.costoTotal, 0)
    };
  }
}