import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Driver, DriverDocument } from '../models/driver.model';
import { MockDriverService } from './mock-driver.service';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ApiDriverService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private mockDriverService: MockDriverService
  ) {}

  getDashboardStats(): Observable<{ totalDrivers: number; activeDrivers: number; suspendedDrivers: number; expiredLicenses: number }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/admin/dashboard/stats`, { headers: this.authHeaders() }).pipe(
      map(response => this.unwrap(response)),
      map(stats => ({
        totalDrivers: stats.totalDrivers ?? stats.total ?? 0,
        activeDrivers: stats.activeDrivers ?? stats.active ?? 0,
        suspendedDrivers: stats.suspendedDrivers ?? stats.suspended ?? 0,
        expiredLicenses: stats.expiredLicenses ?? stats.expired ?? 0
      })),
      // catchError(() => of({
      //   // totalDrivers: this.mockDriverService.getMetrics().total,
      //   // activeDrivers: this.mockDriverService.getMetrics().active,
      //   // suspendedDrivers: this.mockDriverService.getMetrics().suspended,
      //   // expiredLicenses: this.mockDriverService.getMetrics().expiredLicenses
      // }))
    );
  }

  getComplianceOverview(): Observable<{ validDocumentsPercent: number; expiringSoonPercent: number; expiredPercent: number; validDocumentsCount: number; expiringSoonCount: number; expiredCount: number }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/admin/dashboard/compliance-overview`, { headers: this.authHeaders() }).pipe(
      map(response => this.unwrap(response)),
      // catchError(() => of({
      //   validDocumentsPercent: 72,
      //   expiringSoonPercent: 18,
      //   expiredPercent: 10,
      //   validDocumentsCount: 108,
      //   expiringSoonCount: 27,
      //   expiredCount: 15
      // }))
    );
  }

  getRecentEvents(): Observable<Array<{ event: string; driver: string; time: string; status: string }>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/admin/dashboard/recent-events`, { headers: this.authHeaders() }).pipe(
      map(response => this.unwrap(response) || []),
      map(events => events.map((event: any) => ({
        event: event.event ?? event.description ?? 'Activity recorded',
        driver: event.driver ?? event.subject ?? 'Unknown driver',
        time: event.time ?? event.createdAt ?? 'Recently updated',
        status: event.status ?? 'ACTIVE'
      }))),
      catchError(() => of([
        // { event: 'License status updated', driver: 'Aamin Paner', time: '18 minutes ago', status: 'Valid' },
        // { event: 'Driver suspended pending review', driver: 'Jane Nanez', time: '45 minutes ago', status: 'Suspended' }
      ]))
    );
  }

  getDrivers(params?: { search?: string; status?: string; page?: number; limit?: number }): Observable<Driver[]> {
    let httpParams = new HttpParams();
    if (params?.search) { httpParams = httpParams.set('search', params.search); }
    if (params?.status) { httpParams = httpParams.set('status', params.status); }
    if (params?.page != null) { httpParams = httpParams.set('page', params.page.toString()); }
    if (params?.limit != null) { httpParams = httpParams.set('limit', params.limit.toString()); }

    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/drivers`, { headers: this.authHeaders(), params: httpParams }).pipe(
      map(response => (this.unwrap(response) || []).map((driver: any) => this.toDriver(driver))),
      catchError(() => 
        of(
          // this.mockDriverService.getDrivers().map(driver => ({ ...driver }))
        )
      )
    );
  }

  getDriverById(id: any): Observable<Driver | undefined> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/drivers/${id}`, { headers: this.authHeaders() }).pipe(
      map(response => this.toDriver(this.unwrap(response))),
      catchError(
        () => of(
          // this.mockDriverService.getDriverById(id)
        )
      )
    );
  }

  getVehicleAssignmentsByDriver(driverId: string): Observable<any[]> {

    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/vehicle-assignments/driver/${driverId}`,
      {
        headers: this.authHeaders()
      }
    ).pipe(
      map(response => this.unwrap(response) || [])
    );

  }



  getDriverDocuments(driverId: string): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/documents/driver/${driverId}`,
      {
        headers: this.authHeaders()
      }
    ).pipe(
      map(response => {
        const documents = this.unwrap(response) || [];

        return documents.map(document => ({
          ...document,
          status: this.normalizeDocumentStatus(document.status)
        }));
      })
    );
  }

  createDriver(payload: Partial<Driver>): Observable<Driver> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/drivers`, payload, { headers: this.authHeaders() }).pipe(
      map(response => this.toDriver(this.unwrap(response))),
      catchError(() => of(this.toDriver(payload)))
    );
  }

  updateDriver(id: string, payload: Partial<Driver>): Observable<Driver> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/drivers/${id}`, payload, { headers: this.authHeaders() }).pipe(
      map(response => this.toDriver(this.unwrap(response))),
      catchError(() => of(this.toDriver(payload as any)))
    );
  }

  getDriverProfile(): Observable<Driver | undefined> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/drivers/me/profile`, { headers: this.authHeaders() }).pipe(
      map(response => this.toDriver(this.unwrap(response))),
      // catchError(() => of(this.mockDriverService.getDrivers()[0]))
    );
  }

  approveDriver(driverId: string): Observable<any> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/drivers/${driverId}/approve`, {}, { headers: this.authHeaders() }).pipe(
      map(response => this.unwrap(response)),
      catchError(() => of({ driverId, approved: false }))
    );
  }
  updateDriverProfile(payload: Partial<Driver>): Observable<Driver | undefined> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/drivers/me/profile`, payload, { headers: this.authHeaders() }).pipe(
      map(response => this.toDriver(this.unwrap(response))),
      catchError(() => of(this.toDriver(payload as any)))
    );
  }

  getDriverPreferences(): Observable<{ language: string; timezone: string; notificationMethod: string }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/drivers/me/preferences`, { headers: this.authHeaders() }).pipe(
      map(response => this.unwrap(response) || { language: 'en', timezone: 'UTC', notificationMethod: 'EMAIL' }),
      catchError(() => of({ language: 'en', timezone: 'UTC', notificationMethod: 'EMAIL' }))
    );
  }

  updateDriverPreferences(payload: { language: string; timezone: string; notificationMethod: string }): Observable<any> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/drivers/me/preferences`, payload, { headers: this.authHeaders() }).pipe(
      map(response => this.unwrap(response)),
      catchError(() => of(payload))
    );
  }

  getVehicleAssignments(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/vehicle-assignments`,
      { headers: this.authHeaders() }
    ).pipe(
      map(response => this.unwrap(response) || []),
      catchError(() => of([]))
    );
  }


  createVehicleAssignment(payload: {
    driverId: string;
    vehicleId: string;
    assignmentDate: string;
  }): Observable<any> {

    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/vehicle-assignments`,
      payload,
      { headers: this.authHeaders() }
    ).pipe(
      map(response => this.unwrap(response)),
      catchError(error => {
        console.error('Vehicle assignment failed', error);
        throw error;
      })
    );
  }


  deleteVehicleAssignment(assignmentId: string): Observable<any> {

    return this.http.delete<ApiResponse<any>>(
      `${this.baseUrl}/vehicle-assignments/${assignmentId}`,
      { headers: this.authHeaders() }
    ).pipe(
      map(response => this.unwrap(response)),
      catchError(error => {
        console.error('Delete assignment failed', error);
        throw error;
      })
    );
  }



  //
  // VEHICLE METHODS
  //


  getVehicles(): Observable<any[]> {

    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/vehicles`,
      { headers: this.authHeaders() }
    ).pipe(
      map(response => this.unwrap(response) || []),
      catchError(() => of([]))
    );

  }

  getAvailableVehicles(): Observable<any[]> {

    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/vehicles/available`,
      { headers: this.authHeaders() }
    ).pipe(
      map(response => this.unwrap(response) || []),
      catchError(() => of([]))
    );

  }

  createVehicle(payload: {
    plateNumber: string;
    manufacturer: string;
    model: string;
    vehicleType: string;
    year: number;
    status?: string;
  }): Observable<any> {


    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/vehicles`,
      payload,
      { headers: this.authHeaders() }
    ).pipe(
      map(response => this.unwrap(response)),
      catchError(error => {
        console.error('Vehicle creation failed', error);
        throw error;
      })
    );

  }



  updateVehicle(
    id: string,
    payload: {
      plateNumber: string;
      manufacturer: string;
      model: string;
      vehicleType: string;
      year: number;
      status?: string;
    }
  ): Observable<any> {


    return this.http.put<ApiResponse<any>>(
      `${this.baseUrl}/vehicles/${id}`,
      payload,
      { headers: this.authHeaders() }
    ).pipe(
      map(response => this.unwrap(response)),
      catchError(error => {
        console.error('Vehicle update failed', error);
        throw error;
      })
    );

  }



  deleteVehicle(id: string): Observable<any> {

    return this.http.delete<ApiResponse<any>>(
      `${this.baseUrl}/vehicles/${id}`,
      { headers: this.authHeaders() }
    ).pipe(
      map(response => this.unwrap(response)),
      catchError(error => {
        console.error('Vehicle delete failed', error);
        throw error;
      })
    );

  }

  exportReport(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/admin/reports/export`, { headers: this.authHeaders() }).pipe(
      map(response => this.unwrap(response)),
      catchError(() => of({ uri: '/reports/export.csv' }))
    );
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('driver-management-token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  private unwrap<T>(response: ApiResponse<T> | T | null | undefined): T {
    if (!response) {
      return [] as T;
    }
    if (typeof response === 'object' && 'success' in response && 'data' in response) {
      return (response as ApiResponse<T>).data;
    }
    return response as T;
  }

  private toDriver(source: any): Driver {

    const firstName = source?.firstName ?? source?.name?.split(' ')[0] ?? 'Driver';
    const lastName = source?.lastName ?? source?.name?.split(' ').slice(1).join(' ') ?? 'Unknown';

    return {
      id: source?.id ?? source?.driverId ?? undefined,
      firstName,
      middleName: source?.middleName ??  '',
      lastName,
      gender: source?.gender ??  '',
      nationality: source?.nationality ??  '',
      address: source?.address ?? '',
      employeeId: source?.employeeId ?? source?.employee_id ?? ``,
      phone: source?.phone ?? source?.mobile ?? '',
      email: source?.email ?? '',
      branch: source?.branch ?? source?.office ?? 'Main Hub',
      driverType: source?.driverType ?? source?.driver_type ?? 'Truck',
      status: this.normalizeStatus(source?.status),
      licenseNumber: source?.licenseNumber ?? source?.license_number ?? '',
      licenseExpiry: source?.licenseExpiry ?? source?.license_expiry ?? '',
      assignedVehicle: source?.assignedVehicle ?? source?.vehicle?.plate ?? source?.assignedVehicleName ?? '',
      assignedVehicleModel: source?.assignedVehicleModel ?? source?.vehicle?.model ?? '',
      photoUrl: source?.photoUrl ? `https://f3f6-69-250-93-176.ngrok-free.app${source.photoUrl}`: source?.avatar ?? '/assets/avatar.jpeg',
      documents: (source?.documents ?? []).map((document: any) => ({
        type: document?.type ?? document?.documentType ?? 'Document',
        expiry: document?.expiry ?? document?.expiryDate ?? '',
        status: this.normalizeDocumentStatus(document?.status),
        fileName: document?.fileName ?? 'document'
      })),
      assignmentHistory: (source?.assignmentHistory ?? source?.assignments ?? []).map((entry: any) => ({
        plate: entry?.plate ?? entry?.vehicle?.plate ?? '',
        type: entry?.type ?? entry?.vehicle?.type ?? '',
        model: entry?.model ?? entry?.vehicle?.model ?? '',
        assignedAt: entry?.assignedAt ?? entry?.assignmentDate ?? '',
        status: entry?.status ?? 'Assigned'
      })),
      profileCompleteness: source?.profileCompleteness ?? 0
    };
  }

  private normalizeStatus(status?: string): Driver['status'] {
    const normalized = (status ?? '').toUpperCase();
    if (normalized === 'ACTIVE') { return 'ACTIVE'; }
    if (normalized === 'SUSPENDED') { return 'SUSPENDED'; }
    if (normalized === 'PENDING_APPROVAL' || normalized === 'PENDING') { return 'PENDING_APPROVAL'; }
    return 'INACTIVE';
  }

  private normalizeDocumentStatus(status?: string): DriverDocument['status'] {
    const normalized = (status ?? '').toUpperCase();
    if (normalized === 'EXPIRED') { return 'Expired'; }
    if (normalized === 'EXPIRING_SOON' || normalized === 'EXPIRING') { return 'Expiring Soon'; }
    return 'Valid';
  }


  // for document 

  getAllDocuments(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/documents`, {
      headers: this.authHeaders()
    }).pipe(
      map(response => this.unwrap(response) || []),
      catchError(() => of([]))
    );
  }


  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/documents/upload`,
      formData,
      {
        headers: this.fileUploadHeaders()
      }
    ).pipe(
      map(response => this.unwrap(response)),
      catchError(() => of(null))
    );
  }


  previewDocument(documentId: string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/documents/${documentId}/preview`,
      {
        headers: this.authHeaders(),
        responseType: 'blob'
      }
    );
  }


  downloadDocument(documentId: string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/documents/${documentId}/download`,
      {
        headers: this.authHeaders(),
        responseType: 'blob'
      }
    );
  }


  verifyDocument(documentId: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/documents/${documentId}/verify`,
      {},
      {
        headers: this.authHeaders()
      }
    ).pipe(
      map(response => this.unwrap(response)),
      catchError(() => of(null))
    );
  }


  rejectDocument(documentId: string, reason: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/documents/${documentId}/reject?reason=${encodeURIComponent(reason)}`,
      {},
      {
        headers: this.authHeaders()
      }
    ).pipe(
      map(response => this.unwrap(response)),
      catchError(() => of(null))
    );
  }


  replaceDocument(documentId: string, formData: FormData): Observable<any> {
    return this.http.put<ApiResponse<any>>(
      `${this.baseUrl}/documents/${documentId}`,
      formData,
      {
        headers: this.fileUploadHeaders()
      }
    ).pipe(
      map(response => this.unwrap(response)),
      catchError(() => of(null))
    );
  }


  deleteDocument(documentId: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(
      `${this.baseUrl}/documents/${documentId}`,
      {
        headers: this.authHeaders()
      }
    ).pipe(
      map(response => this.unwrap(response)),
      catchError(() => of(null))
    );
  }

  private fileUploadHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('driver-management-token') || ''}`
    });
  }

  uploadDriverPhoto(formData: FormData): Observable<string> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/drivers/upload-photo`,
      formData,
      {
        headers: this.fileUploadHeaders()
      }
    ).pipe(
      map(response => this.unwrap(response) || '')
    );
    }
}
