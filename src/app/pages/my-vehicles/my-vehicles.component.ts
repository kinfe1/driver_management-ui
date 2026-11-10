import { Component, OnInit } from '@angular/core';
import { Driver } from '../../models/driver.model';
import { ApiDriverService } from '../../services/api-driver.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-vehicles',
  templateUrl: './my-vehicles.component.html',
  styleUrls: ['./my-vehicles.component.scss']
})
export class MyVehiclesComponent implements OnInit {

  driver?: Driver;

  assignments: any[] = [];

  activeAssignment: any = null;

  loading = true;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private driverService: ApiDriverService
  ) {}

  ngOnInit(): void {
    this.loadDriverData();
  }

  /**
   * Load logged-in driver's profile
   */
  private loadDriverData(): void {

    this.loading = true;
    this.errorMessage = '';

    this.driverService.getDriverProfile().subscribe({

      next: (driver) => {

        this.driver = driver;

        if (!driver?.id) {
          this.loading = false;
          this.errorMessage =
            'Unable to identify your driver profile.';
          return;
        }

        this.loadVehicleAssignments(driver.id);
      },

      error: (error) => {

        console.error(
          'Failed to load driver profile:',
          error
        );

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load your driver profile.';
      }

    });
  }

  /**
   * Load all vehicle assignments for the logged-in driver
   */
  private loadVehicleAssignments(driverId: string): void {

    this.driverService
      .getVehicleAssignmentsByDriver(driverId)
      .subscribe({

        next: (assignments) => {

          this.assignments = assignments || [];

          // Find the currently active assignment
          this.activeAssignment =
            this.assignments.find(
              assignment =>
                assignment.status === 'Assigned' ||
                assignment.status === 'ACTIVE' ||
                assignment.status === 'Active'
            ) || null;

          // Update driver information with real assignment data
          if (this.driver) {

            this.driver.assignmentHistory =
              this.assignments;

            if (this.activeAssignment) {

              this.driver.assignedVehicle =
                this.activeAssignment.plate;

              this.driver.assignedVehicleModel =
                this.activeAssignment.model;

            } else {

              this.driver.assignedVehicle =
                undefined;

              this.driver.assignedVehicleModel =
                undefined;

            }
          }

          this.loading = false;
        },

        error: (error) => {

          console.error(
            'Failed to load vehicle assignments:',
            error
          );

          this.loading = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to load vehicle assignments.';
        }

      });
  }

  /**
   * Current vehicle plate number
   */
  get assignedVehicle(): string {

    return this.activeAssignment?.plate ||
      this.driver?.assignedVehicle ||
      'Unassigned';
  }

  /**
   * Current vehicle model
   */
  get assignedVehicleModel(): string {

    return this.activeAssignment?.model ||
      this.driver?.assignedVehicleModel ||
      'N/A';
  }

  /**
   * Current vehicle status
   */
  get vehicleStatus(): string {

    if (!this.activeAssignment) {
      return 'Unassigned';
    }

    return this.activeAssignment.status ||
      'Assigned';
  }

  /**
   * Current route
   *
   * Uses backend route data if available.
   */
  get vehicleRoute(): string {

    if (!this.activeAssignment) {
      return 'No active assignment';
    }

    if (
      this.activeAssignment.route ||
      this.activeAssignment.routeName
    ) {
      return (
        this.activeAssignment.route ||
        this.activeAssignment.routeName
      );
    }

    return 'No route assigned';
  }

  /**
   * Assignment history excluding
   * the currently active assignment.
   */
  get assignmentHistory(): any[] {

    return this.assignments.filter(
      assignment =>
        assignment !== this.activeAssignment
    );
  }

}