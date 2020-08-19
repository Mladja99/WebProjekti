import { Component, OnInit } from '@angular/core';
import { CarServiceService } from '../../services/car-service.service';
import { Vehicle } from '../../models/Vehicle';
import { IdGenerator } from '../../models/IdGenerator'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-vehicle',
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.css']
})
export class CreateVehicleComponent implements OnInit {

  constructor(private carService:CarServiceService, private route: ActivatedRoute, private _router:Router) { }
  vehicle:Vehicle = null;
  ngOnInit(): void {
    this.vehicle = new Vehicle();
  }

  async CreateVehicle()
  {
    var gen:IdGenerator = new IdGenerator();
    if(this.vehicle.manufacturer != null && this.vehicle.type != null)
    {
      this.carService.getNextGeneratorId().subscribe(res => {
        gen = res;
        this.vehicle.id=gen.vehicleId;
        gen.vehicleId = +gen.vehicleId + 1;
        this.vehicle.status = "Waiting for user to check data";
        this.vehicle.statusType = 0;
        this.carService.createVehicle(this.vehicle).subscribe(res => console.log("rezultat", res));
        this.carService.incrementGeneratorId(gen).subscribe(res => console.log(res));
        this._router.navigate([`${"vehicles"}`]);
      });
    }
  }
}
