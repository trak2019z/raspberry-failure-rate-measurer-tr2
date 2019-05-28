import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdministrationComponent } from './administration/administration.component';
import { MeasurementComponent } from './measurement/measurement.component';
import { ReportComponent } from './report/report.component';
import { UserComponent } from './user/user.component';
import { AngularMaterialModule } from '../angular-material.module';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    AdministrationComponent,
    MeasurementComponent,
    ReportComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    HomeRoutingModule
  ]
})

export class HomeModule {}
