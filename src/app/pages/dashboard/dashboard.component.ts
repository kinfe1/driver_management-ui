import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Driver } from '../../models/driver.model';
import { ApiDriverService } from '../../services/api-driver.service';

interface ActivityEvent {
  description: string;
  subject: string;
  time: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Active' | 'Suspended' | 'Pending Approval';
}

interface ComplianceSummary {
  valid: number;
  expiringSoon: number;
  expired: number;
  validPct: number;
  expiringPct: number;
  expiredPct: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  metrics = { total: 0, active: 0, suspended: 0, expiredLicenses: 0, assignedVehicles: 0 };
  compliance: ComplianceSummary = { valid: 0, expiringSoon: 0, expired: 0, validPct: 0, expiringPct: 0, expiredPct: 0 };
  drivers: Driver[] = [];
  recentActivity: ActivityEvent[] = [];

  constructor(private driverService: ApiDriverService, private router: Router) {}

  ngOnInit(): void {
    this.driverService.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
    });

    this.driverService.getDashboardStats().subscribe(stats => {
      this.metrics = {
        total: stats.totalDrivers,
        active: stats.activeDrivers,
        suspended: stats.suspendedDrivers,
        expiredLicenses: stats.expiredLicenses,
        assignedVehicles: 0
      };
    });

    this.driverService.getComplianceOverview().subscribe(compliance => {
      this.compliance = {
        valid: compliance.validDocumentsCount,
        expiringSoon: compliance.expiringSoonCount,
        expired: compliance.expiredCount,
        validPct: compliance.validDocumentsPercent,
        expiringPct: compliance.expiringSoonPercent,
        expiredPct: compliance.expiredPercent
      };
    });

    this.driverService.getRecentEvents().subscribe(events => {
      this.recentActivity = events.map(event => ({
        description: event.event,
        subject: event.driver,
        time: event.time,
        status: this.toStatus(event.status)
      }));
    });
  }

  private toStatus(status: string): ActivityEvent['status'] {
    const normalized = status.toUpperCase();
    if (normalized === 'SUSPENDED') { return 'Suspended'; }
    if (normalized === 'PENDING_APPROVAL' || normalized === 'PENDING') { return 'Pending Approval'; }
    if (normalized === 'EXPIRED') { return 'Expired'; }
    if (normalized === 'ACTIVE') { return 'Active'; }
    return 'Valid';
  }

  get statusClasses(): Record<string, string> {
    return {
      Valid: 'status-valid',
      'Expiring Soon': 'status-warning',
      Expired: 'status-danger',
      Active: 'status-active',
      Suspended: 'status-suspended',
      'Pending Approval': 'status-pending'
    };
  }

  addDriver(): void {
    this.router.navigate(['/add-driver']);
  }
}
