import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VehicleItemComponent } from './components/vehicle-item/vehicle-item.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { EditVehicleComponent } from './components/edit-vehicle/edit-vehicle.component';
import { HomeComponent } from './components/home/home.component';
import { CreateVehicleComponent } from './components/create-vehicle/create-vehicle.component';
import { RespondComponent } from './components/respond/respond.component';
import { AuthModule } from './auth/auth.module';
import { HeaderComponent } from './components/header/header.component';
@NgModule({
  declarations: [
    AppComponent,
    VehicleItemComponent,
    VehiclesComponent,
    EditVehicleComponent,
    HomeComponent,
    CreateVehicleComponent,
    RespondComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
