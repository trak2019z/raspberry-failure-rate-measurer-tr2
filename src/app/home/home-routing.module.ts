import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdministrationComponent } from './administration/administration.component';
import { MeasurementComponent } from './measurement/measurement.component';
import { ReportComponent } from './report/report.component';
import { UserComponent } from './user/user.component';

// import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'administration', component: AdministrationComponent },
  { path: 'measurement', component: MeasurementComponent },
  { path: 'report', component: ReportComponent },
  { path: 'user', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  // providers: [AuthGuard]
})
export class HomeRoutingModule {}
