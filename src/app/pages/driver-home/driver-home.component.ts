import { Component, OnInit } from '@angular/core';
import { Driver } from '../../models/driver.model';
import { ApiDriverService } from '../../services/api-driver.service';

@Component({
  selector: 'app-driver-home',
  templateUrl: './driver-home.component.html',
  styleUrls: ['./driver-home.component.scss']
})
export class DriverHomeComponent implements OnInit {
  userName = 'Driver';
  driver?: Driver;

  selectedFile?: File;
  selectedFileName = '';
  uploadMessage = '';
  isUploading = false;

  upload = {
    documentType: '',
    issueDate: '',
    expiryDate: '',
    remarks: ''
  };

  constructor(private driverService: ApiDriverService) {}

  ngOnInit(): void {
    this.loadDriverProfile();
  }

  loadDriverProfile(): void {
    this.driverService.getDriverProfile().subscribe({
      next: (driver) => {
        this.userName = `${driver?.firstName ?? ''} ${driver?.lastName ?? ''}`.trim() || 'Driver';
        this.loadDriverDetails(driver!);
      },
      error: (error) => {
        console.error('Failed to load driver profile:', error);
        alert(error?.error?.message || 'Failed to load your profile');
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

  get assignedVehicle(): string {
    return this.driver?.assignedVehicle || 'No vehicle assigned';
  }

  get nextRenewal(): string {
    const documents = this.driver?.documents ?? [];

    if (!documents.length) {
      return 'No renewals due soon';
    }

    const today = new Date();

    const upcomingDocuments = documents
      .filter(doc => doc.expiryDate)
      .map(doc => ({
        ...doc,
        expiry: new Date(doc.expiryDate!)
      }))
      .filter(doc => !isNaN(doc.expiry.getTime()) && doc.expiry >= today)
      .sort((a, b) => a.expiry.getTime() - b.expiry.getTime());

    if (!upcomingDocuments.length) {
      return 'No renewals due soon';
    }

    const nextDocument = upcomingDocuments[0];
    const days = this.daysUntil(nextDocument.expiryDate!);

    return `${nextDocument.documentType} in ${days} days`;
  }

  get documentStatus(): string {
    const documents = this.driver?.documents ?? [];

    if (!documents.length) {
      return 'No documents uploaded yet';
    }

    const expired = documents.filter(doc =>
      (doc.status ?? '').toString().toUpperCase() === 'EXPIRED'
    ).length;

    const expiringSoon = documents.filter(doc => {
      const status = (doc.status ?? '').toString().toUpperCase();
      return status === 'EXPIRING_SOON' || status === 'EXPIRING SOON' || status === 'EXPIRING';
    }).length;

    const pending = documents.filter(doc =>
      (doc.status ?? '').toString().toUpperCase() === 'PENDING'
    ).length;

    if (expired > 0) {
      return `${expired} expired document${expired > 1 ? 's' : ''}`;
    }

    if (expiringSoon > 0) {
      return `${expiringSoon} document${expiringSoon > 1 ? 's' : ''} expiring soon`;
    }

    if (pending > 0) {
      return `${pending} document${pending > 1 ? 's' : ''} pending review`;
    }

    return 'All documents are current';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedFile = undefined;
      this.selectedFileName = '';
      return;
    }

    const file = input.files[0];

    if (file.size > 10 * 1024 * 1024) {
      this.selectedFile = undefined;
      this.selectedFileName = '';
      this.uploadMessage = 'File size must not exceed 10 MB.';
      input.value = '';
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      this.selectedFile = undefined;
      this.selectedFileName = '';
      this.uploadMessage = 'Only PDF, JPG, and PNG files are allowed.';
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
    this.uploadMessage = '';
  }

  uploadDocument(): void {
    if (!this.driver?.id) {
      this.uploadMessage = 'Driver profile could not be loaded.';
      return;
    }

    if (!this.upload.documentType) {
      this.uploadMessage = 'Please select a document type.';
      return;
    }

    if (!this.upload.issueDate) {
      this.uploadMessage = 'Please select the issue date.';
      return;
    }

    if (!this.upload.expiryDate) {
      this.uploadMessage = 'Please select the expiry date.';
      return;
    }

    if (new Date(this.upload.expiryDate) <= new Date(this.upload.issueDate)) {
      this.uploadMessage = 'Expiry date must be after the issue date.';
      return;
    }

    if (!this.selectedFile) {
      this.uploadMessage = 'Please choose a file first.';
      return;
    }

    const formData = new FormData();

    formData.append('driverId', this.driver.id);
    formData.append('documentType', this.upload.documentType);
    formData.append('issueDate', this.upload.issueDate);
    formData.append('expiryDate', this.upload.expiryDate);
    formData.append('remarks', this.upload.remarks);
    formData.append('file', this.selectedFile);

    this.isUploading = true;
    this.uploadMessage = '';

    this.driverService.uploadDocument(formData).subscribe({
      next: () => {
        this.isUploading = false;
        this.uploadMessage = 'Document uploaded successfully.';
        this.selectedFile = undefined;
        this.selectedFileName = '';

        this.upload = {
          documentType: '',
          issueDate: '',
          expiryDate: '',
          remarks: ''
        };

        this.loadDriverProfile();
      },
      error: (error) => {
        console.error('Document upload failed:', error);
        this.isUploading = false;
        this.uploadMessage = error?.error?.message || 'Failed to upload document.';
      }
    });
  }

  private daysUntil(expiry: string): number {
    const expiryDate = new Date(expiry);
    const now = new Date();

    if (isNaN(expiryDate.getTime())) {
      return 0;
    }

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const expiryDay = new Date(
      expiryDate.getFullYear(),
      expiryDate.getMonth(),
      expiryDate.getDate()
    );

    const ms = expiryDay.getTime() - today.getTime();

    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }
}