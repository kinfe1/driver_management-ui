import { Component, OnInit } from '@angular/core';
import { Driver, DriverDocument } from '../../models/driver.model';
import { ApiDriverService } from '../../services/api-driver.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-documents',
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.scss']
})
export class MyDocumentsComponent implements OnInit {

  uploads: DriverDocument[] = [];
  driver?: Driver;

  selectedFile?: File;
  selectedFileName = '';
  uploadMessage = '';

  isUploading = false;

  upload = {
    documentType: 'DRIVER_LICENSE',
    issueDate: '',
    expiryDate: ''
  };

  constructor(
    private auth: AuthService,
    private driverService: ApiDriverService
  ) {}

  ngOnInit(): void {
    this.loadDriverProfile();
  }

  private loadDriverProfile(): void {

    this.driverService.getDriverProfile().subscribe({
      next: (driver) => {

        this.driver = driver;

        if (!driver?.id) {
          this.uploadMessage =
            'Unable to identify your driver profile.';
          return;
        }

        this.loadDocuments(driver.id);
      },

      error: (error) => {

        console.error(
          'Failed to load driver profile:',
          error
        );

        this.uploadMessage =
          error?.error?.message ||
          'Failed to load your driver profile.';
      }
    });
  }

  private loadDocuments(driverId: string): void {

    this.driverService.getDriverDocuments(driverId).subscribe({
      next: (documents) => {

        this.uploads = (documents || []).map((doc: any) => ({
          ...doc,
          status: this.normalizeDocumentStatus(doc.status)
        }));

      },

      error: (error) => {

        console.error(
          'Failed to load driver documents:',
          error
        );

        this.uploadMessage =
          error?.error?.message ||
          'Failed to load your documents.';
      }
    });
  }

  private normalizeDocumentStatus(status?: string): string {

    const normalized = (status ?? '').toUpperCase();

    if (normalized === 'EXPIRED') {
      return 'Expired';
    }

    if (
      normalized === 'EXPIRING_SOON' ||
      normalized === 'EXPIRING'
    ) {
      return 'Expiring Soon';
    }

    return 'Valid';
  }

  getStatusClass(status: string): string {

    return (status || '')
      .toLowerCase()
      .replace(/[_ ]/g, '-');
  }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {

      this.uploadMessage =
        'Please select a PDF, JPG, or PNG file.';

      input.value = '';
      this.selectedFile = undefined;
      this.selectedFileName = '';

      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {

      this.uploadMessage =
        'File size must not exceed 10 MB.';

      input.value = '';
      this.selectedFile = undefined;
      this.selectedFileName = '';

      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
    this.uploadMessage = '';
  }

  uploadDocument(): void {

    if (!this.driver?.id) {

      this.uploadMessage =
        'Unable to identify your driver profile.';

      return;
    }

    if (!this.selectedFile) {

      this.uploadMessage =
        'Choose a file before uploading.';

      return;
    }

    if (!this.upload.documentType) {

      this.uploadMessage =
        'Please select a document type.';

      return;
    }

    if (!this.upload.issueDate) {

      this.uploadMessage =
        'Please select the issue date.';

      return;
    }

    if (!this.upload.expiryDate) {

      this.uploadMessage =
        'Please select the expiry date.';

      return;
    }

    if (
      new Date(this.upload.expiryDate) <=
      new Date(this.upload.issueDate)
    ) {

      this.uploadMessage =
        'Expiry date must be after the issue date.';

      return;
    }

    this.isUploading = true;
    this.uploadMessage = '';

    const formData = new FormData();

    formData.append(
      'driverId',
      this.driver.id
    );

    formData.append(
      'documentType',
      this.upload.documentType
    );

    formData.append(
      'issueDate',
      this.upload.issueDate
    );

    formData.append(
      'expiryDate',
      this.upload.expiryDate
    );

    formData.append(
      'file',
      this.selectedFile
    );

    this.driverService.uploadDocument(formData).subscribe({

      next: () => {

        this.isUploading = false;

        this.uploadMessage =
          'Document uploaded successfully.';

        // Refresh documents from backend
        this.loadDocuments(this.driver!.id!);

        // Reset form
        this.resetUploadForm();
      },

      error: (error) => {

        console.error(
          'Document upload failed:',
          error
        );

        this.isUploading = false;

        this.uploadMessage =
          error?.error?.message ||
          'Failed to upload document.';
      }

    });
  }

  private resetUploadForm(): void {

    this.selectedFile = undefined;
    this.selectedFileName = '';

    this.upload = {
      documentType: 'DRIVER_LICENSE',
      issueDate: '',
      expiryDate: ''
    };

    const fileInput =
      document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

    if (fileInput) {
      fileInput.value = '';
    }
  }

  download(doc: any): void {
    this.driverService.downloadDocument(doc.id).subscribe({
      next: blob => {
        const contentType = blob.type || doc.contentType || 'application/octet-stream';
        const fileBlob = new Blob([blob], { type: contentType });
        const url = window.URL.createObjectURL(fileBlob);
        const link = document.createElement('a');

        link.href = url;
        link.download = doc.originalFileName || doc.fileName || 'document';
        link.click();

        window.URL.revokeObjectURL(url);
      },
      error: error => {
        console.error('Document download failed:', error);
        alert('Unable to download document');
      }
    });
  }
}