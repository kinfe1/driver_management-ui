import { Component, OnInit } from '@angular/core';
import { ApiDriverService } from '../../services/api-driver.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit {

  documents: any[] = [];
  filteredDocuments: any[] = [];
  drivers: any[] = [];

  selectedDriverId = '';

  stats = {
    total: 0,
    pending: 0,
    verified: 0,
    expired: 0
  };

  showUploadModal = false;

  selectedFile?: File;

  upload = {
    driverId: '',
    documentType: 'DRIVER_LICENSE',
    issueDate: '',
    expiryDate: '',
    remarks: ''
  };

  showReplaceModal = false;

  selectedReplaceFile?: File;

  replaceDocumentId = '';

  replace = {
    documentType: 'DRIVER_LICENSE',
    issueDate: '',
    expiryDate: '',
    remarks: ''
  };

  constructor(private apiDriverService: ApiDriverService) {}

  ngOnInit(): void {
    this.loadDocuments();
    this.loadDrivers();
  }

  loadDocuments(): void {
    this.apiDriverService.getAllDocuments().subscribe({
      next: documents => {
        this.documents = documents || [];
        this.filteredDocuments = [...this.documents];
        this.calculateStats();
      },
      error: error => {
        console.error('Failed to load documents:', error);
        this.documents = [];
        this.filteredDocuments = [];
        this.calculateStats();
      }
    });
  }

  loadDrivers(): void {
    this.apiDriverService.getDrivers().subscribe({
      next: drivers => {
        this.drivers = drivers || [];
      },
      error: error => {
        console.error('Failed to load drivers:', error);
        this.drivers = [];
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.documents.length;
    this.stats.pending = this.documents.filter(d => d.status === 'PENDING').length;
    this.stats.verified = this.documents.filter(d => d.status === 'VERIFIED').length;
    this.stats.expired = this.documents.filter(d => d.status === 'EXPIRED').length;
  }

  filterDocuments(): void {
    if (!this.selectedDriverId) {
      this.filteredDocuments = [...this.documents];
      return;
    }

    this.filteredDocuments = this.documents.filter(
      document => document.driverId === this.selectedDriverId
    );
  }

  clearDriverFilter(): void {
    this.selectedDriverId = '';
    this.filteredDocuments = [...this.documents];
  }

  openUploadModal(): void {
    this.showUploadModal = true;
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
    this.selectedFile = undefined;

    this.upload = {
      driverId: '',
      documentType: 'DRIVER_LICENSE',
      issueDate: '',
      expiryDate: '',
      remarks: ''
    };
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  uploadDocument(): void {

    if (!this.upload.driverId) {
      alert('Please select a driver');
      return;
    }

    if (!this.selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();

    formData.append('driverId', this.upload.driverId);
    formData.append('documentType', this.upload.documentType);

    if (this.upload.issueDate) {
      formData.append('issueDate', this.upload.issueDate);
    }

    if (this.upload.expiryDate) {
      formData.append('expiryDate', this.upload.expiryDate);
    }

    if (this.upload.remarks) {
      formData.append('remarks', this.upload.remarks);
    }

    formData.append('file', this.selectedFile);

    this.apiDriverService.uploadDocument(formData).subscribe({
      next: () => {
        this.closeUploadModal();
        this.loadDocuments();
      },
      error: error => {
        console.error('Document upload failed:', error);
        alert(error?.error?.message || 'Failed to upload document');
      }
    });
  }

  preview(doc: any): void {
    this.apiDriverService.previewDocument(doc.id).subscribe({
      next: blob => {
        const contentType = blob.type || doc.contentType || 'application/pdf';
        const fileBlob = new Blob([blob], { type: contentType });
        const url = window.URL.createObjectURL(fileBlob);
        const previewWindow = window.open(url, '_blank');

        if (!previewWindow) {
          alert('Please allow pop-ups to preview the document');
        }

        // setTimeout(() => {
          window.URL.revokeObjectURL(url);
        // }, 60000);
      },
      error: error => {
        console.error('Document preview failed:', error);
        alert('Unable to preview document');
      }
    });
  }

  download(doc: any): void {
    this.apiDriverService.downloadDocument(doc.id).subscribe({
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

  verify(doc: any): void {
    this.apiDriverService.verifyDocument(doc.id).subscribe({
      next: () => {
        this.loadDocuments();
      },
      error: error => {
        console.error('Document verification failed:', error);
        alert(error?.error?.message || 'Failed to verify document');
      }
    });
  }

  reject(doc: any): void {

    const reason = prompt('Enter rejection reason');

    if (!reason) {
      return;
    }

    this.apiDriverService.rejectDocument(doc.id, reason).subscribe({
      next: () => {
        this.loadDocuments();
      },
      error: error => {
        console.error('Document rejection failed:', error);
        alert(error?.error?.message || 'Failed to reject document');
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/_/g, '-');
  }

  openReplaceModal(doc: any): void {
    this.replaceDocumentId = doc.id;

    this.replace = {
      documentType: doc.documentType,
      issueDate: doc.issueDate || '',
      expiryDate: doc.expiryDate || '',
      remarks: doc.remarks || ''
    };

    this.selectedReplaceFile = undefined;
    this.showReplaceModal = true;
  }

  closeReplaceModal(): void {
    this.showReplaceModal = false;
    this.replaceDocumentId = '';
    this.selectedReplaceFile = undefined;

    this.replace = {
      documentType: 'DRIVER_LICENSE',
      issueDate: '',
      expiryDate: '',
      remarks: ''
    };
  }

  onReplaceFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedReplaceFile = event.target.files[0];
    }
  }

  replaceDocument(): void {

    if (!this.replaceDocumentId) {
      alert('Document not selected');
      return;
    }

    if (!this.selectedReplaceFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();

    formData.append('documentType', this.replace.documentType);

    if (this.replace.issueDate) {
      formData.append('issueDate', this.replace.issueDate);
    }

    if (this.replace.expiryDate) {
      formData.append('expiryDate', this.replace.expiryDate);
    }

    if (this.replace.remarks) {
      formData.append('remarks', this.replace.remarks);
    }

    formData.append('file', this.selectedReplaceFile);

    this.apiDriverService.replaceDocument(
      this.replaceDocumentId,
      formData
    ).subscribe({
      next: () => {
        this.closeReplaceModal();
        this.loadDocuments();
      },
      error: error => {
        console.error('Document replacement failed:', error);
        alert(error?.error?.message || 'Failed to replace document');
      }
    });
  }

  handleAction(event: Event, doc: any): void {
    const select = event.target as HTMLSelectElement;
    const action = select.value;

    if (!action) {
      return;
    }

    switch (action) {
      case 'preview':
        this.preview(doc);
        break;

      case 'download':
        this.download(doc);
        break;

      case 'verify':
        this.verify(doc);
        break;

      case 'reject':
        this.reject(doc);
        break;

      case 'replace':
        this.openReplaceModal(doc);
        break;
    }

    select.value = '';
  }
}