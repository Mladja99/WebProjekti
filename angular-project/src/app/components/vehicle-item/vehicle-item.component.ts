import { Component, OnInit, Input } from '@angular/core';
import { CarServiceService } from '../../services/car-service.service';
import { Vehicle } from '../../models/Vehicle';
@Component({
  selector: 'app-vehicle-item',
  templateUrl: './vehicle-item.component.html',
  styleUrls: ['./vehicle-item.component.css']
})
export class VehicleItemComponent implements OnInit {
  @Input() vehicle: Vehicle;

  constructor(private carService:CarServiceService) { }

  ngOnInit(): void {
  }

  onToggle(){

  }

  onDelte(){
    console.log('deleted');
  }
}
