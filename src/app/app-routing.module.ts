import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { RolesGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'login',
    loadChildren: () =>
      import('./components/login/login.module').then((m) => m.LoginModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./components/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [RolesGuard],
    data: { role: ['Admin'], redirect: '/' },
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./components/register/register.module').then(
        (m) => m.RegisterModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'mailVerified',
    loadChildren: () =>
      import('./components/verification/verification.module').then(
        (m) => m.VerificationModule
      ),
  },
  {
    path: 'patient',
    loadChildren: () =>
      import('./components/patient/patient.module').then(
        (m) => m.PatientModule
      ),
    canActivate: [RolesGuard],
    data: { role: ['Patient'], redirect: '/' },
  },
  {
    path: 'specialist',
    loadChildren: () =>
      import('./components/specialist/specialist.module').then(
        (m) => m.SpecialistModule
      ),
    canActivate: [RolesGuard],
    data: { role: ['Specialist'], redirect: '/' },
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./components/home/home.module').then((m) => m.HomeModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
