import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeSpecialistComponent } from './home-specialist/home-specialist.component';

const routes: Routes = [{ path: '', component: HomeSpecialistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialistRoutingModule {}
