import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  items: any[] = [];
  visible: boolean = true;
  selectedMenu: boolean = false;

  constructor(
    public router: Router,
    private menuService: MenuService
  ) {
    this.menuService.toggleMenuBar.subscribe((res) => {
      this.visible = res;
    });
  }

  ngOnInit(): void {
    this.items = this.menuService.getMenuItems();
  }

  sideBar() {
    this.menuService.toggleMenuBar.next(false);
  }

  onSelectMenu(item: MenuItem): void {
    this.router.navigate([item.routerLink]);
  }
}
