import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { LayoutComponent } from './shared/layout/main-layout.component';
import { EmpleadosComponent } from './paginas/empleados/empleados.component';

export const routes: Routes = [
    { path: '', component: LoginComponent }, // Ruta inicial
    { path: 'main', component: LayoutComponent, children: [
        { path: 'empleados', component: EmpleadosComponent }
    ] },
    { path: '**', redirectTo: '' } 
];
