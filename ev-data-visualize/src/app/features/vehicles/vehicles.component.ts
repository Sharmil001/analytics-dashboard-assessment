import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { VehicleService } from 'src/app/core/services/vehicle.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
})
export class VehiclesComponent implements OnInit {
  vehiclesList: any[] = [];
  filteredActivityTypes: any[] = [];
  vehicleCols: any[] = [];
  selectedActivityType: any = null;
  filterTypes: any = {
    text: 'text',
    date: 'date',
  };
  isAllTypes: boolean = false;

  constructor(
    private vehicleService: VehicleService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getVehicleCols();
    this.getAllVehicles();
  }

  getVehicleCols(): void {
    this.vehicleCols = [
      {
        field: 'vin',
        header: 'VIN (1-10)',
        filterType: this.filterTypes.text,
      },
      {
        field: 'county',
        header: 'County',
        filterType: this.filterTypes.text,
      },
      {
        field: 'city',
        header: 'City',
        filterType: this.filterTypes.text,
      },
      {
        field: 'state',
        header: 'State',
        filterType: this.filterTypes.text,
      },
      {
        field: 'postalCode',
        header: 'Postal Code',
        filterType: this.filterTypes.text,
      },
      {
        field: 'model',
        header: 'Model',
        filterType: this.filterTypes.text,
      },
      {
        field: 'make',
        header: 'Make',
        filterType: this.filterTypes.text,
      },
      {
        field: 'electricVehicleType',
        header: 'Type',
        filterType: this.filterTypes.text,
      },
      {
        field: 'electricRange',
        header: 'Range',
        filterType: this.filterTypes.text,
      },
      {
        field: 'cafvEligibility',
        header: 'Eligibility',
        filterType: this.filterTypes.text,
      },
    ];
  }

  getAllVehicles(): void {
    this.spinner.show();
    this.vehicleService.fetchVehiclesFromCSV().subscribe((vehicles: any) => {
      this.vehiclesList = vehicles;
      this.spinner.hide();
    });
  }
}
