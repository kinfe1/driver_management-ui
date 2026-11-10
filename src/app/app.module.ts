import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { LoadingInterceptor } from './services/loading.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DriverListComponent,
    DriverProfileComponent,
    DriverSettingsComponent,
    LoginComponent,
    AddDriverComponent,
    DocumentUploadComponent,
    DriverHomeComponent,
    MyDocumentsComponent,
    MyVehiclesComponent,
    VehicleAssignmentComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
