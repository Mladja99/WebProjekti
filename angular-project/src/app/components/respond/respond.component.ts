import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CarServiceService } from '../../services/car-service.service';
import { Vehicle } from '../../models/Vehicle';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-respond',
  templateUrl: './respond.component.html',
  styleUrls: ['./respond.component.css']
})
export class RespondComponent implements OnInit {

  @Input() vehicle:Vehicle;
  @Output() respond: EventEmitter<Vehicle> = new EventEmitter();

  constructor(
    private carService:CarServiceService, 
    private route: ActivatedRoute, 
    private _router:Router
  ) { }
  errorMessage:string = "";
  oldDesc:string = null;
  public localVehicle:Vehicle = null;
  ngOnInit(): void {
    this.localVehicle = new Vehicle();
    this.localVehicle.id = this.vehicle.id;
    this.localVehicle.manufacturer = this.vehicle.manufacturer;
    this.localVehicle.plateNumber = this.vehicle.plateNumber;
    this.localVehicle.status = this.vehicle.status;
    this.localVehicle.statusType = this.vehicle.statusType;
    this.localVehicle.description = this.vehicle.description;
    this.localVehicle.type = this.vehicle.type;
    this.localVehicle.userId = this.vehicle.userId;
  }

  onSubmit(f:NgForm):void{
    if(f.valid)
    {
      this.respond.emit(this.localVehicle);
    }
    else
    {
      this.errorMessage = "Data is not valid";
    }
  }
}
