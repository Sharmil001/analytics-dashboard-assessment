import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, switchMap, concatMap, reduce } from 'rxjs/operators';

export interface Vehicle {
  model: string;
  electricVehicleType: string;
  electricRange: number;
  baseMSRP: number;
  location: {
    longitude: any;
    latitude: any;
  };
  cafvEligibility?: string;
  make?: string;
}

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private vehicleSubject = new BehaviorSubject<Vehicle[]>([]); // BehaviorSubject to store vehicle data
  private vehiclesLoaded = false; // To track whether the data is already loaded

  constructor(private http: HttpClient) {}

  // Function to fetch vehicles, with cache logic
  fetchVehiclesFromCSV(): Observable<Vehicle[]> {
    if (this.vehiclesLoaded) {
      return this.vehicleSubject.asObservable();
    } else {
      return this.http
        .get('assets/csv/Electric_Vehicle_Population_Data.csv', {
          responseType: 'text',
        })
        .pipe(
          switchMap((csvData) => this.parseCSVInBatches(csvData, 50)),
          reduce((acc: any, batch: any) => [...acc, ...batch], []),
          map((vehicles: Vehicle[]) => {
            this.vehicleSubject.next(vehicles);
            this.vehiclesLoaded = true;
            return [...new Set(vehicles.map((res) => res))];
          })
        );
    }
  }

  private parseCSVInBatches(
    csvData: string,
    batchSize: number
  ): Observable<Vehicle[]> {
    return new Observable<Vehicle[]>((observer) => {
      const parsedData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      }).data;
      const totalBatches = Math.ceil(parsedData.length / batchSize);
      let currentBatch = 0;

      const processBatch = () => {
        const start = currentBatch * batchSize;
        const end = Math.min(start + batchSize, parsedData.length);

        const vehicles = parsedData.slice(start, end).map((vehicle: any) => ({
          vin: vehicle['VIN (1-10)'],
          county: vehicle['County'],
          city: vehicle['City'],
          state: vehicle['State'],
          postalCode: vehicle['Postal Code'],
          modelYear: vehicle['Model Year'],
          make: vehicle['Make'],
          model: vehicle['Model'],
          electricVehicleType: vehicle['Electric Vehicle Type'],
          cafvEligibility:
            vehicle['Clean Alternative Fuel Vehicle (CAFV) Eligibility'],
          electricRange: +vehicle['Electric Range'],
          baseMSRP: +vehicle['Base MSRP'],
          dOLVehicleID: vehicle['DOL Vehicle ID'],
          location: this.extractLocation(vehicle['Vehicle Location']),
          electricUtility: vehicle['Electric Utility'],
          censusTract: vehicle['2020 Census Tract'],
        }));

        observer.next(vehicles);
        currentBatch++;

        if (currentBatch < totalBatches) {
          setTimeout(processBatch, 0); // Yield control
        } else {
          observer.complete();
        }
      };

      processBatch();
    });
  }

  private extractLocation(pointString: string): {
    longitude: any;
    latitude: any;
  } {
    if (!pointString || !pointString.startsWith('POINT')) {
      return { longitude: null, latitude: null };
    }

    const coordinates = pointString
      .replace('POINT (', '')
      .replace(')', '')
      .split(' ');

    if (coordinates.length === 2) {
      return {
        longitude: parseFloat(coordinates[0]),
        latitude: parseFloat(coordinates[1]),
      };
    }

    return { longitude: null, latitude: null };
  }

  // Function to aggregate data for chart display
  getChartData(vehicles: Vehicle[]): { type: string; count: number }[] {
    const typeCounts = vehicles.reduce((acc, vehicle) => {
      acc[vehicle.electricVehicleType] =
        (acc[vehicle.electricVehicleType] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(typeCounts).map((key) => ({
      type: key,
      count: typeCounts[key],
    }));
  }

  // vehicle type percentage
  calculateVehiclePercentages(vehicles: Vehicle[]): {
    bevPercentage: number;
    phevPercentage: number;
  } {
    let bevCount = 0;
    let phevCount = 0;

    vehicles.forEach((vehicle) => {
      if (vehicle.electricVehicleType === 'Battery Electric Vehicle (BEV)') {
        bevCount++;
      } else if (
        vehicle.electricVehicleType === 'Plug-in Hybrid Electric Vehicle (PHEV)'
      ) {
        phevCount++;
      }
    });

    const totalCount = bevCount + phevCount;

    return {
      bevPercentage: (bevCount / totalCount) * 100,
      phevPercentage: (phevCount / totalCount) * 100,
    };
  }

  // vehicle percentage eligiblity
  calculateVehiclePercentagesEligiblity(vehicles: any[]): number[] {
    const totalCount = vehicles.length;
    const cleanAlternativeFuelEligibleCount = vehicles.filter(
      (v) => v.cafvEligibility === 'Clean Alternative Fuel Vehicle Eligible'
    ).length;
    const notEligibleCount = vehicles.filter(
      (v) => v.cafvEligibility === 'Not eligible due to low battery range'
    ).length;
    const eligibilityUnknownCount = vehicles.filter((v) =>
      v.cafvEligibility.includes('Eligibility unknown')
    ).length;

    return [
      (cleanAlternativeFuelEligibleCount / totalCount) * 100,
      (notEligibleCount / totalCount) * 100,
      (eligibilityUnknownCount / totalCount) * 100,
    ];
  }
}
