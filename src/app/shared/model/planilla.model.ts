export interface PlanillaEmpleado {
  id: number;
  nombreCompleto: string;
  salarioMensual: number;
  salarioQuincenal: number;
  
  // Deducciones de ley (parte del empleado)
  isss: number;         // 3% del salario hasta un tope
  afp: number;          // 7.25% del salario
  renta: number;        // Según tabla de Hacienda
  totalDeducciones: number;
  salarioNeto: number;
  
  // Aportaciones patronales
  isssPatronal: number; // 7.5% del salario hasta un tope
  afpPatronal: number;  // 7.75% del salario
  insaforvPatronal: number; // 5% del salario
  totalPatronal: number;
  
  // Costo total para la empresa
  costoTotal: number;
}