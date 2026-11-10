import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver } from '../../models/driver.model';
import { ApiDriverService } from '../../services/api-driver.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.scss']
})
export class DriverProfileComponent implements OnInit {
  driver?: Driver;
  showEditModal = false;
  editDriver: any = {};

  genders = ['Male', 'Female'];

  editPhotoFile?: File;
  editPhotoPreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private driverService: ApiDriverService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Admin viewing a specific driver
      this.loadDriver(id);
    } else {
      // Logged-in driver viewing their own profile
      this.loadMyProfile();
    }
  }

  private loadMyProfile(): void {
    this.driverService.getDriverProfile().subscribe({
      next: (driver) => {
        this.loadDriverDetails(driver!);
      },
      error: (error) => {
        console.error('Failed to load driver profile:', error);
        alert(error?.error?.message || 'Failed to load your profile');
      }
    });
  }

  private loadDriver(id: string): void {
    this.driverService.getDriverById(id).subscribe({
      next: (driver) => {
        this.loadDriverDetails(driver!);
      },
      error: (error) => {
        console.error('Failed to load driver:', error);
        alert(error?.error?.message || 'Failed to load driver');
      }
    });
  }

  private loadDriverDetails(driver: Driver): void {
    this.driver = driver;

    const driverId = driver.id;

    if (!driverId) {
      return;
    }

    this.driverService.getVehicleAssignmentsByDriver(driverId).subscribe({
      next: (assignments) => {
        if (!this.driver) {
          return;
        }

        this.driver.assignmentHistory = assignments;

        const activeVehicle = assignments.find(
          a => a.status === 'Assigned'
        );

        if (activeVehicle) {
          this.driver.assignedVehicle = activeVehicle.plate;
          this.driver.assignedVehicleModel = activeVehicle.model;
        }
      },
      error: (error) => {
        console.error('Failed to load vehicle assignments:', error);
      }
    });

    this.driverService.getDriverDocuments(driverId).subscribe({
      next: (documents) => {
        if (this.driver) {
          this.driver.documents = documents;
        }
      },
      error: (error) => {
        console.error('Failed to load driver documents:', error);
      }
    });
  }

  getDocStatusClass(status: string): string {
    return (status || '').toLowerCase().replace(/[_ ]/g, '-');
  }

  approve(): void {
    if (!this.driver) {
      return;
    }

    this.driverService.approveDriver(this.driver.id!).subscribe({
      next: (response) => {
        console.log('Approve response:', response);

        if (response.success || response.status) {
          this.driver = response;
          alert('Driver approved successfully');
        } else {
          alert('Failed to approve driver: ' + (response.message || 'Unknown error'));
        }
      },
      error: (error) => {
        console.error(error);
        alert('Failed to approve driver: ' + (error?.error?.message || 'Unknown error'));
      }
    });
  }

  openEditModal(): void {
    if (!this.driver) {
      return;
    }

    this.editDriver = {
      firstName: this.driver.firstName,
      middleName: this.driver.middleName,
      lastName: this.driver.lastName,
      gender: this.driver.gender,
      dateOfBirth: this.driver.dateOfBirth,
      nationality: this.driver.nationality,
      phone: this.driver.phone,
      secondaryPhone: this.driver.secondaryPhone,
      email: this.driver.email,
      address: this.driver.address,
      employeeId: this.driver.employeeId,
      branch: this.driver.branch,
      driverType: this.driver.driverType,
      licenseNumber: this.driver.licenseNumber,
      licenseExpiry: this.driver.licenseExpiry,
      status: this.driver.status,
      photoUrl: this.driver.photoUrl
    };

    this.editPhotoFile = undefined;
    this.editPhotoPreview = this.driver.photoUrl || null;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editPhotoFile = undefined;
    this.editPhotoPreview = null;
  }

  onEditPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      input.value = '';
      return;
    }

    this.editPhotoFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.editPhotoPreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  removeEditPhoto(): void {
    this.editPhotoFile = undefined;
    this.editPhotoPreview = null;
    this.editDriver.photoUrl = null;
  }

  updateDriver(): void {
    if (!this.driver) {
      return;
    }

    if (this.editPhotoFile) {
      const formData = new FormData();
      formData.append('file', this.editPhotoFile);

      this.driverService.uploadDriverPhoto(formData).subscribe({
        next: (photoUrl: string) => {
          this.editDriver.photoUrl = photoUrl;
          this.saveDriverChanges();
        },
        error: (error) => {
          console.error('Photo upload failed:', error);
          alert(error?.error?.message || 'Failed to upload driver photo');
        }
      });

      return;
    }

    this.saveDriverChanges();
  }

  private saveDriverChanges(): void {
    if (!this.driver) {
      return;
    }

    this.driverService.updateDriver(
      this.driver.id!,
      this.editDriver
    ).subscribe({
      next: (updatedDriver) => {
        this.driver = updatedDriver;
        this.showEditModal = false;
        this.editPhotoFile = undefined;
        this.editPhotoPreview = null;

        alert('Driver updated successfully');
      },
      error: (error) => {
        console.error(error);

        alert(
          error?.error?.message ||
          'Failed to update driver'
        );
      }
    });
  }
}