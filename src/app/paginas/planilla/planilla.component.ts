import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { PlanillaService } from '../../shared/services/planilla.service';
import { PlanillaEmpleado } from '../../shared/model/planilla.model';

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
    PanelModule
  ],
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
  
  constructor(private planillaService: PlanillaService) {}
  
  ngOnInit(): void {
    this.calcularPlanilla();
    this.planillaService.planilla$.subscribe(planilla => {
      this.planillaEmpleados = planilla;
      this.totalPlanilla = this.planillaService.getTotalPlanilla();
    });
  }
  
  calcularPlanilla(): void {
    this.planillaService.calcularPlanilla(this.periodoSeleccionado);
  }
  
  cambiarPeriodo(): void {
    this.calcularPlanilla();
  }
}