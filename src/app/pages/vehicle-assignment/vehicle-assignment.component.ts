import { Component, OnInit } from '@angular/core';
import { ApiDriverService } from '../../services/api-driver.service';


@Component({
  selector: 'app-vehicle-assignment',
  templateUrl: './vehicle-assignment.component.html',
  styleUrls: ['./vehicle-assignment.component.scss']
})
export class VehicleAssignmentComponent implements OnInit {


  vehicles:any[] = [];

  availableVehicles:any[] = [];

  drivers:any[] = [];

  assignments:any[] = [];



  showVehicleModal=false;

  showAssignModal=false;



  vehicle:any = {

  plateNumber:'',
  manufacturer:'',
  model:'',
  vehicleType:'',
  year:null

  };



  assignment:any={

  driverId:'',
  vehicleId:'',
  assignmentDate:new Date()
  .toISOString()
  .substring(0,10)

  };



  constructor(
    private apiDriverService:ApiDriverService
  ){}



  ngOnInit(){

    this.loadVehicles();

    this.loadAssignments();

    this.loadDrivers();

  }



  loadVehicles(){

    this.apiDriverService.getVehicles()
    .subscribe(data=>{

    this.vehicles=data;

    });

  }



  loadAssignments(){

    this.apiDriverService
    .getVehicleAssignments()
    .subscribe(data=>{

      this.assignments=data;

    });

  }



  loadDrivers(){

    this.apiDriverService
    .getDrivers()
    .subscribe(data=>{

    this.drivers=data;

    });

  }



  openVehicleModal(){

    this.showVehicleModal=true;

  }


  closeVehicleModal(){

    this.showVehicleModal=false;

  }



  saveVehicle(){

    this.apiDriverService
    .createVehicle(this.vehicle)
    .subscribe(()=>{

    this.loadVehicles();

    this.closeVehicleModal();

    });


  }



  openAssignModal(){

    this.loadAvailableVehicles();

    this.showAssignModal=true;

  }



  closeAssignModal(){

    this.showAssignModal=false;

  }



  loadAvailableVehicles(){

    this.apiDriverService
    .getAvailableVehicles()
    .subscribe(data=>{

    this.availableVehicles=data;

    });

  }



  saveAssignment(){

    this.apiDriverService
    .createVehicleAssignment(this.assignment)
    .subscribe(()=>{


    this.loadAssignments();

    this.loadVehicles();

    this.closeAssignModal();


    });


  }


}