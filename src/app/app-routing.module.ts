
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

import { GuestGuard } from './guards/guest.guard';
import { AddDriverComponent } from './pages/add-driver/add-driver.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentUploadComponent } from './pages/document-upload/document-upload.component';
import { DriverHomeComponent } from './pages/driver-home/driver-home.component';
import { DriverListComponent } from './pages/driver-list/driver-list.component';
import { DriverProfileComponent } from './pages/driver-profile/driver-profile.component';
import { DriverSettingsComponent } from './pages/driver-settings/driver-settings.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { MyDocumentsComponent } from './pages/my-documents/my-documents.component';
import { MyVehiclesComponent } from './pages/my-vehicles/my-vehicles.component';
import { VehicleAssignmentComponent } from './pages/vehicle-assignment/vehicle-assignment.component';

const routes: Routes = [
  // Public pages
  { 
    path: '', 
    component: LandingComponent,
    canActivate: [GuestGuard]
  },
  { path: 'login', component: LoginComponent },

  // Driver pages
  {
    path: 'driver-home',
    component: DriverHomeComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Driver'] }
  },
  {
    path: 'my-profile',
    component: DriverProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Driver'] }
  },
  {
    path: 'my-documents',
    component: MyDocumentsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Driver'] }
  },
  {
    path: 'my-vehicles',
    component: MyVehiclesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Driver'] }
  },
  {
    path: 'driver-settings',
    component: DriverSettingsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Driver'] }
  },

  // Admin pages
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'drivers',
    component: DriverListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'driver/:id',
    component: DriverProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'add-driver',
    component: AddDriverComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'documents',
    component: DocumentUploadComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'vehicle-assignment',
    component: VehicleAssignmentComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },

  // Unknown URLs
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
