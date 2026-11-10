import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles: string[] = route.data['roles'] ?? [];
    const userRole = this.auth.getRole();
    const canAccess = userRole ? allowedRoles.includes(userRole) : false;
    if (!canAccess) {
      this.router.navigate(['/']);
    }
    return canAccess;
  }
}
