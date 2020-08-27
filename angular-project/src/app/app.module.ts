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
import { CookieService } from 'ngx-cookie-service';
import { StoreModule } from '@ngrx/store'
import { VehicleReducer } from './reducers/vehicle.reducer';
import { EffectsModule } from '@ngrx/effects';
import { VehicleEffects } from './effects/vehicle.effects';
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
    AuthModule,
    StoreModule.forRoot({vehicle: VehicleReducer}),
    EffectsModule.forRoot([VehicleEffects])
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
