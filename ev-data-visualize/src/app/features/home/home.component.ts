import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartService } from 'src/app/core/services/charts.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';

interface Vehicle {
  model: string;
  electricVehicleType: string;
  electricRange: number;
  baseMSRP: number;
  location: {
    longitude: number;
    latitude: number;
  };
  cafvEligibility?: string;
  make?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  vehicles: Vehicle[] = [];

  totalVehicles: number = 0;
  totalCAFVEligible: number = 0;
  totalElectricRange: string = '';
  averageMSRP: number = 0;

  pieChartData: any;
  pieChartEligibility: any;

  barChartDetails: any;
  filterDropdown: any[] = [
    { label: 'Make', value: 'make' },
    { label: 'Model', value: 'model' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
    { label: 'County', value: 'county' },
    { label: 'Postal Code', value: 'postalCode' },
    { label: 'Electric Vehicle Type', value: 'electricVehicleType' },
    { label: 'Eligibility (CAFV)', value: 'cafvEligibility' },
  ];

  selectedFilter: any = { label: 'Make', value: 'make' };

  constructor(
    private vehicleService: VehicleService,
    private spinner: NgxSpinnerService,
    private chartService: ChartService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.vehicleService.fetchVehiclesFromCSV().subscribe((vehicles) => {
      // VEHICLES DATA
      this.vehicles = vehicles;

      // GENERATE PIE CHARTS
      this.generatePieChartData();
      this.generatePieChartDataEligiblity();

      // GENERATE BAR CHART
      this.calculateCountsByField(this.selectedFilter.value);

      // CARDS CALCULTIONS
      this.calculateKPIs(vehicles);
      this.spinner.hide();
    });
  }

  calculateKPIs(vehicles: Vehicle[]) {
    let totalMSRP = 0;
    let bevElectricRange = 0;
    let cafvEligibleCount = 0;
    let minElectricRange = Infinity;
    let maxElectricRange = -Infinity;

    vehicles.forEach((vehicle) => {
      // Increment total number of vehicles
      this.totalVehicles++;

      // Check if the vehicle is CAFV eligible
      if (
        vehicle.cafvEligibility &&
        vehicle.cafvEligibility.includes(
          'Clean Alternative Fuel Vehicle Eligible'
        )
      ) {
        cafvEligibleCount++;
      }

      // Calculate the total electric range for BEVs
      // if (vehicle.electricVehicleType === 'Battery Electric Vehicle (BEV)') {
      //   // Update min and max electric range

      // }
      if (vehicle.electricRange < minElectricRange) {
        minElectricRange = vehicle.electricRange;
      }
      if (vehicle.electricRange > maxElectricRange) {
        maxElectricRange = vehicle.electricRange;
      }

      // Sum the MSRP for calculating average MSRP
      totalMSRP += vehicle.baseMSRP;
    });

    // Assign values to the class properties
    this.totalCAFVEligible = cafvEligibleCount;
    this.totalElectricRange = `${minElectricRange} - ${maxElectricRange}`;

    // Calculate the average MSRP
    this.averageMSRP = totalMSRP / this.totalVehicles;
  }

  generatePieChartData() {
    const percentages = this.vehicleService.calculateVehiclePercentages(
      this.vehicles
    );
    const labels = ['BEV', 'PHEV'];
    const colors = ['#42A5F5', '#66BB6A'];
    const data = [percentages.bevPercentage, percentages.phevPercentage];
    this.pieChartData = this.chartService.getPieChart(data, labels, colors);
  }

  generatePieChartDataEligiblity(): void {
    const percentageCount =
      this.vehicleService.calculateVehiclePercentagesEligiblity(this.vehicles);
    const labels = [
      'Not Eligible',
      'Eligibility unknown as battery',
      'Clean Alternative Fuel Eligible',
    ];
    const colors = ['#4CAF50', '#FF5252', '#FFC107'];
    const data = percentageCount;
    this.pieChartEligibility = this.chartService.getPieChart(
      data,
      labels,
      colors
    );
  }

  calculateCountsByField(selectedField: string) {
    const counts: { [key: string]: number } = {};
    const chartLabel = 'Vehicle Count';
    const xTitle = this.selectedFilter.lable;
    const yTitle = 'Vehicle Count';

    (this.vehicles || []).forEach((vehicle: any) => {
      const fieldValue = vehicle[selectedField];
      if (fieldValue) {
        counts[fieldValue] = (counts[fieldValue] || 0) + 1;
      }
    });

    this.barChartDetails = this.chartService.getBarChart(
      Object.keys(counts),
      Object.values(counts),
      chartLabel,
      xTitle,
      yTitle
    );
  }
}
