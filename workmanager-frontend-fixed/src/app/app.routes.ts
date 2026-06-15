import { Routes } from '@angular/router';
import { LoginComponent } from './components/Login/login.component';
import { RegistroComponent } from './components/Registro/registro.component';
import { TrabajadorListaComponent } from './components/Trabajador-Lista/trabajador-lista.component';
import { TrabajadorFormComponent } from './components/Trabajador-Form/trabajador-form.component';
import { TrabajadorDetalleComponent } from './components/Trabajador-Detalle/trabajador-detalle.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'trabajadores', component: TrabajadorListaComponent },
  { path: 'trabajadores/nuevo', component: TrabajadorFormComponent },
  { path: 'trabajadores/editar/:id', component: TrabajadorFormComponent },
  { path: 'trabajadores/detalle/:id', component: TrabajadorDetalleComponent },
  { path: '**', redirectTo: '/login' }
];