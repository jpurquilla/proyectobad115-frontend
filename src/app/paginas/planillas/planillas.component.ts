import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-planillas',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './planillas.component.html',
  styleUrls: ['./planillas.component.scss']
})
export class PlanillasComponent {
  planillas = [
    { id: 1, nombre: 'Planilla Enero', estado: 'Procesada' },
    { id: 2, nombre: 'Planilla Febrero', estado: 'Pendiente' }
  ];
}