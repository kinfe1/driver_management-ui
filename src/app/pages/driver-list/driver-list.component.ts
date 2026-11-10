import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Driver } from '../../models/driver.model';
import { ApiDriverService } from '../../services/api-driver.service';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss']
})
export class DriverListComponent implements OnInit {
  drivers: Driver[] = [];
  filter = '';
  statuses = ['All',"ACTIVE",
    "SUSPENDED",
    "INACTIVE",
    "PENDING_APPROVAL"];
  selectedStatus = 'All';

  constructor(private driverService: ApiDriverService, private router: Router) {}

  ngOnInit(): void {
    this.driverService.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
    });
  }

  goToAddDriver(): void {
    this.router.navigate(['/add-driver']);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/ /g, '-');
  }

  getStatusDisplay(status: string): string {
    return status.toLowerCase().replace('_', ' ');
  }

  get filteredDrivers(): Driver[] {
    return this.drivers.filter(driver => {
      const matchesStatus = this.selectedStatus === 'All' || driver.status === this.selectedStatus;
      const matchesFilter = [driver.firstName, driver.lastName, driver.licenseNumber, driver.employeeId, driver.branch]
        .join(' ')
        .toLowerCase()
        .includes(this.filter.toLowerCase());
      return matchesStatus && matchesFilter;
    });
  }

  openProfile(driver: Driver) {
    console.log('Navigating to driver profile:', driver);
    this.router.navigate(['/driver', driver.id]);
  }
}
