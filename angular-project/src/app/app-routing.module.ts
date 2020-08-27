import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditVehicleComponent } from './components/edit-vehicle/edit-vehicle.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component'
import { HomeComponent } from './components/home/home.component';
import { CreateVehicleComponent } from './components/create-vehicle/create-vehicle.component';
import { RespondComponent } from './components/respond/respond.component';
import { HeaderComponent } from './components/header/header.component';
import { UserEditComponent } from './components/user-edit/user-edit.component'
const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'edit/:id', component: EditVehicleComponent},
  { path: 'respond/:id', component: RespondComponent},
  { path: 'create', component: CreateVehicleComponent},
  { path: 'vehicles', component: VehiclesComponent},
  { path: 'header', component: HeaderComponent},
  { path: 'editUser', component: UserEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
