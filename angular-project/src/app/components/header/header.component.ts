import { Component, OnInit } from '@angular/core';
import { CarServiceService } from '../../services/car-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public carService:CarServiceService, private _router:Router) { }

  ngOnInit(): void {
  }

  logout()
  {
    this.carService.logout();
    this._router.navigate([`${""}`]);
  }

}
/* ovo je sa tutorijala
import { Component, OnInit } from "@angular/core";
import { NgProgress } from "@ngx-progressbar/core";
import { ProgressBarService } from "../../services/progress-bar.service";
import { AuthService } from "../../services/auth.service";
import { AlertService } from "ngx-alerts";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  constructor(
    private progress: NgProgress,
    public progressBar: ProgressBarService,
    public authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.progressBar.progressRef = this.progress.ref("progressBar");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.authService.currentUser = null;
    this.authService.decodedToken = null;
    this.alertService.success("Logged Out");
  }
}
*/