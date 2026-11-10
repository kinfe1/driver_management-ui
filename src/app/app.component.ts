import { Component, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';

interface NavItem {
  label: string;
  route: string;
  roles: string[];
  exact?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'driver-management-ui';
  isNavOpen = false;
  showProfileMenu = false;

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', roles: ['Admin'], exact: true, icon: 'fa-solid fa-table-columns' },
    { label: 'Drivers', route: '/drivers', roles: ['Admin'], icon: 'fa-solid fa-users' },
    { label: 'Add Driver', route: '/add-driver', roles: ['Admin'], icon: 'fa-solid fa-user-plus' },
    { label: 'Documents', route: '/documents', roles: ['Admin'], icon: 'fa-solid fa-file-lines' },
    { label: 'Vehicle Assignment', route: '/vehicle-assignment', roles: ['Admin'], icon: 'fa-solid fa-truck' },
    { label: 'My Dashboard', route: '/driver-home', roles: ['Driver'], icon: 'fa-solid fa-table-columns' },
    { label: 'My Profile', route: '/my-profile', roles: ['Driver'], icon: 'fa-solid fa-user' },
    { label: 'My Documents', route: '/my-documents', roles: ['Driver'], icon: 'fa-solid fa-file-lines' },
    { label: 'My Vehicles', route: '/my-vehicles', roles: ['Driver'], icon: 'fa-solid fa-car' },
    { label: 'Settings', route: '/driver-settings', roles: ['Driver'], icon: 'fa-solid fa-gear' }
  ];

  constructor(public auth: AuthService, public loadingService: LoadingService) {}

  get filteredNavItems(): NavItem[] {
    const role = this.auth.getRole();
    if (!role) {
      return [];
    }
    return this.navItems.filter(item => item.roles.includes(role));
  }

  get lastName(): string {
    const name = this.auth.getUser()?.name?.trim();
    if (!name) {
      return 'Account';
    }
    const parts = name.split(' ');
    return parts.length > 1 ? parts[parts.length - 1] : name;
  }

  get firstName(): string {
    const name = this.auth.getUser()?.name?.trim();
    if (!name) {
      return 'Account';
    }
    const parts = name.split(' ');
    return parts.length > 1 ? parts[0] : name;
  }

  get name(): string {
    const name = this.auth.getUser()?.name?.trim();
    if (!name) {
      return 'Account';
    }
 
    return name;
  }

   get role(): string {
    const role = this.auth.getUser()?.role?.trim();
    if (!role) {
      return 'Driver';
    }

    return role;
  }

  get lastNameInitial(): string {
    return this.lastName.charAt(0).toUpperCase();
  }

  get userImage(): string {
    const profileImageUrl = this.auth.getUser()?.profileImageUrl?.trim();
    if (!profileImageUrl) {
      return 'assets/avatar.jpeg';
    }
    return profileImageUrl;
  }

  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }

  closeNav(): void {
    this.isNavOpen = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: any): void {
    if (this.isNavOpen) {
      this.closeNav();
      event?.preventDefault?.();
    }
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout(): void {
    this.showProfileMenu = false;
    this.auth.logout();
  }
  
  closeProfileMenu(): void{
    this.showProfileMenu = false;
  }

}
