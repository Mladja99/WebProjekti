import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CarServiceService } from '../../services/car-service.service';
import { Vehicle } from '../../models/Vehicle';
import { Router } from '@angular/router';
@Component({
  selector: 'app-vehicle-item',
  templateUrl: './vehicle-item.component.html',
  styleUrls: ['./vehicle-item.component.css']
})
export class VehicleItemComponent implements OnInit {
  @Input() vehicle: Vehicle;
  @Output() deleteVehicle: EventEmitter<Vehicle> = new EventEmitter();
  constructor(private carService:CarServiceService, private _router:Router) { }

  ngOnInit(): void {
  }

  onEdit(id:string){
    // vehicle.description = 'Edited';
    // this.carService.editVehicle(vehicle).subscribe(veh => console.log(veh));
    this._router.navigate([`${"edit"}/${id}`]);
  }

  onDelete(veh){
    this.deleteVehicle.emit(veh);
    this.carService.deleteVehicle(veh).subscribe(x => console.log(x));
  }

  onRespond(id:string){
    this._router.navigate([`${"respond"}/${id}`]);
  }
}
