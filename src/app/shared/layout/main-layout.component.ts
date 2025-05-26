import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [RouterModule, PanelMenuModule]
})
export class LayoutComponent {
  menuItems: MenuItem[] = [];
  ngOnInit(): void {
    this.menuItems = [
              {label: 'Inicio', icon: 'pi pi-home', routerLink: ['/main']},
              {label: 'Empleados', icon: 'pi pi-users', routerLink: ['/main/empleados']},
              {label: 'Planillas', icon: 'pi pi-briefcase',routerLink: ['/main/planillas']},
              {label: 'Reportes', icon: 'pi pi-chart-bar'}
          ];
   
  }
  
}