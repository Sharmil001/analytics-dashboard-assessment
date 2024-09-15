import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menuItems: any[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-cog',
      routerLink: '/dashboard',
      sortOrder: 1,
    },
    {
      label: 'Vehicles',
      icon: 'pi pi-file',
      routerLink: '/vehicles',
      sortOrder: 2,
    },
    // {
    //   label: 'Reports',
    //   icon: 'pi pi-file',
    //   routerLink: '/reports',
    //   sortOrder: 2,
    // },
  ];

  public toggleMenuBar: BehaviorSubject<any> = new BehaviorSubject<boolean>(
    true
  );


  getMenuItems() {
    return this.menuItems;
  }
}
