import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should store a token and normalize an admin role after login', async () => {
    const loginPromise = service.login('admin@example.com', 'StrongPass123!');

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'admin@example.com',
      password: 'StrongPass123!'
    });

    req.flush({
      success: true,
      message: 'Logged in',
      data: {
        token: 'jwt-token',
        user: {
          id: '1',
          name: 'System Admin',
          email: 'admin@example.com',
          role: 'SUPER_ADMIN'
        }
      }
    });

    const result = await loginPromise;
    expect(result).toBeTrue();
    expect(service.getRole()).toBe('Admin');
    expect(localStorage.getItem('driver-management-token')).toBe('jwt-token');
  });
});
