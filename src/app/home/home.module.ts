import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardCardsComponent } from '../components/dashboard-cards/dashboard-cards.component';
import { DashboardChartsComponent } from '../components/dashboard-charts/dashboard-charts.component';
import { AdministrationComponent } from './administration/administration.component';
import { MeasurementComponent } from './measurement/measurement.component';
import { ReportComponent } from './report/report.component';
import { UserComponent } from './user/user.component';
import { AngularMaterialModule } from '../angular-material.module';
import { HomeRoutingModule } from './home-routing.module';
import { PageHeaderComponent } from '../components/page-header/page-header.component';
import { AnalysisChartComponent } from '../components/analysis-chart/analysis-charts.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardCardsComponent,
    DashboardChartsComponent,
    AdministrationComponent,
    MeasurementComponent,
    AnalysisChartComponent,
    ReportComponent,
    UserComponent,
    PageHeaderComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    HomeRoutingModule
  ]
})

export class HomeModule {}
