import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Driver } from '../../models/driver.model';
import { ApiDriverService } from '../../services/api-driver.service';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent {
  driver: Partial<Driver> = {
    status: 'PENDING_APPROVAL'
  };

  genders = ['Male', 'Female'];
  driverTypes = ['Truck', 'Taxi', 'Bus', 'Delivery'];

  photoFile?: File;
  photoPreview: string | null = null;
  isSubmitting = false;

  constructor(
    private router: Router,
    private driverService: ApiDriverService
  ) {}

  submit(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    // If no photo was selected, create the driver directly.
    if (!this.photoFile) {
      this.createDriver();
      return;
    }

    // First upload the photo and get the URL.
    const formData = new FormData();
    formData.append('file', this.photoFile);

    this.driverService.uploadDriverPhoto(formData).subscribe({
      next: (photoUrl: string) => {
        // Set the returned URL on the driver.
        this.driver.photoUrl = "https://f3f6-69-250-93-176.ngrok-free.app" + photoUrl;

        // Create the driver using the uploaded photo URL.
        this.createDriver();
      },
      error: (error) => {
        console.error('Photo upload failed:', error);
        alert(error?.error?.message || 'Failed to upload driver photo.');
        this.isSubmitting = false;
      }
    });
  }

  private createDriver(): void {
    this.driverService.createDriver(this.driver).subscribe({
      next: () => {
        this.router.navigate(['/drivers']);
      },
      error: (error) => {
        console.error('Driver creation failed:', error);
        alert(error?.error?.message || 'Failed to create driver.');
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/drivers']);
  }

  onPhotoSelected(event: Event): void {
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

    this.photoFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.photoPreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.photoFile = undefined;
    this.photoPreview = null;
  }
}