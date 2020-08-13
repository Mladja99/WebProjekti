import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/Vehicle';
import { CarServiceService } from '../../services/car-service.service'
@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[];
  constructor(private carServiceService : CarServiceService) { }

  ngOnInit(): void {
    this.carServiceService.getVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
    });
  }

}
