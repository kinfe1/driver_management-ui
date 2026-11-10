import { Injectable } from '@angular/core';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class MockDriverService {
  private drivers: Driver[] = [
    // {
    //   id: 1,
    //   firstName: 'Aamin',
    //   lastName: 'Paner',
    //   employeeId: 'EMP-1024',
    //   phone: '+1 (415) 555-0124',
    //   email: 'aamin@example.com',
    //   branch: 'North Hub',
    //   driverType: 'Truck',
    //   status: 'Active',
    //   licenseNumber: 'DL-872-332',
    //   licenseExpiry: '2025-10-18',
    //   assignedVehicle: 'Truck TX-9921',
    //   assignedVehicleModel: 'Volvo FH16',
    //   photoUrl: 'https://i.pravatar.cc/120?img=10',
    //   documents: [
    //     { type: 'Driver License', expiry: '2025-10-18', status: 'Valid', fileName: 'license.pdf' },
    //     { type: 'National ID', expiry: '2027-03-12', status: 'Valid', fileName: 'national-id.pdf' },
    //     { type: 'Medical Certificate', expiry: '2024-08-12', status: 'Expiring Soon', fileName: 'medical.pdf' }
    //   ],
    //   assignmentHistory: [
    //     { plate: 'TX-9921', type: 'Truck', model: 'Volvo FH16', assignedAt: '2024-01-12', status: 'Active' },
    //     { plate: 'TX-8821', type: 'Truck', model: 'Mercedes Actros', assignedAt: '2023-09-08', status: 'Completed' }
    //   ]
    // },
    // {
    //   firstName: 'Jane',
    //   lastName: 'Nanez',
    //   employeeId: 'EMP-1082',
    //   phone: '+1 (415) 555-0182',
    //   email: 'jane.nanez@example.com',
    //   branch: 'Central Office',
    //   driverType: 'Taxi',
    //   licenseNumber: 'DL-221-451',
    //   licenseExpiry: '2023-11-25',
    //   assignedVehicleModel: 'Toyota Prius',
    //   photoUrl: 'https://i.pravatar.cc/120?img=12',
    //   documents: [
    //     { type: 'Driver License', expiry: '2023-11-25', status: 'Expired', fileName: 'license.pdf' },
    //     { type: 'National ID', expiry: '2026-04-10', status: 'Valid', fileName: 'national-id.pdf' }
    //   ],
    //   assignmentHistory: [
    //     { plate: 'TX-5789', type: 'Taxi', model: 'Toyota Prius', assignedAt: '2023-07-19', status: 'Active' }
    //   ]
    // },
    // {
    //   id: 3,
    //   firstName: 'Maroa',
    //   lastName: 'Coeremes',
    //   employeeId: 'EMP-1077',
    //   phone: '+1 (415) 555-0177',
    //   email: 'maroa@example.com',
    //   branch: 'East Depot',
    //   driverType: 'Bus',
    //   status: 'Pending Approval',
    //   licenseNumber: 'DL-315-944',
    //   licenseExpiry: '2026-05-03',
    //   assignedVehicle: 'Bus BK-2023',
    //   assignedVehicleModel: 'Volvo B11R',
    //   photoUrl: 'https://i.pravatar.cc/120?img=15',
    //   documents: [
    //     { type: 'Driver License', expiry: '2026-05-03', status: 'Valid', fileName: 'license.pdf' },
    //     { type: 'Medical Certificate', expiry: '2025-01-22', status: 'Valid', fileName: 'medical.pdf' }
    //   ],
    //   assignmentHistory: [
    //     { plate: 'BK-2023', type: 'Bus', model: 'Volvo B11R', assignedAt: '2024-03-01', status: 'Active' }
    //   ]
    // }
  ];

  getDrivers(): Driver[] {
    return [...this.drivers];
  }

  // getDriverById(id: number): Driver | undefined {
  //   return this.drivers.find(driver => driver.id === id);
  // }

  getDriverByName(name: string): Driver | undefined {
    const normalized = name.replace(/^driver\s+/i, '').trim().toLowerCase();
    return this.drivers.find(driver => {
      const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
      return fullName === normalized || `${driver.lastName}, ${driver.firstName}`.toLowerCase() === normalized;
    });
  }

  // getMetrics() {
  //   const total = this.drivers.length;
  //   const active = this.drivers.filter(driver => driver.status === 'Active').length;
  //   const suspended = this.drivers.filter(driver => driver.status === 'Suspended').length;
  //   const expiredLicenses = this.drivers.filter(driver => driver.documents.some(doc => doc.type === 'Driver License' && doc.status === 'Expired')).length;
  //   const assignedVehicles = this.drivers.filter(driver => !!driver.assignedVehicle).length;
  //   return { total, active, suspended, expiredLicenses, assignedVehicles };
  // }
}
