import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditVehicleComponent } from './components/edit-vehicle/edit-vehicle.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component'
import { HomeComponent } from './components/home/home.component';
import { CreateVehicleComponent } from './components/create-vehicle/create-vehicle.component'
const routes: Routes = [
  //umesto AppComponent ubaci kasnije nesto za pocetnu stranu da ne prikazuje duplo a u app napravi template
  { path: '', component: HomeComponent},
  { path: 'edit/:id', component: EditVehicleComponent},
  { path: 'create', component: CreateVehicleComponent},
  { path: 'vehicles', component: VehiclesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
