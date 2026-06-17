import { Routes } from '@angular/router';
import { LoginComponent } from './components/Login/login.component';
import { RegistroComponent } from './components/Registro/registro.component';
import { TrabajadorListaComponent } from './components/Trabajador-Lista/trabajador-lista.component';
import { TrabajadorFormComponent } from './components/Trabajador-Form/trabajador-form.component';
import { TrabajadorDetalleComponent } from './components/Trabajador-Detalle/trabajador-detalle.component';
import { TareaListaComponent } from './components/Tarea-Lista/tarea-lista.component';
import { TareaFormComponent } from './components/Tarea-Form/tarea-form.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'trabajadores', component: TrabajadorListaComponent, canActivate: [AuthGuard] },
  { path: 'trabajadores/nuevo', component: TrabajadorFormComponent, canActivate: [AdminGuard] },
  { path: 'trabajadores/editar/:id', component: TrabajadorFormComponent, canActivate: [AdminGuard] },
  { path: 'trabajadores/detalle/:id', component: TrabajadorDetalleComponent, canActivate: [AuthGuard] },
  { path: 'tareas', component: TareaListaComponent, canActivate: [AuthGuard] },
  { path: 'tareas/nuevo', component: TareaFormComponent, canActivate: [AdminGuard] },
  { path: 'tareas/editar/:id', component: TareaFormComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/login' }
];