import { Component } from '@angular/core';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  isMenuVisible: boolean = false;

  constructor(private menuService: MenuService) {
    this.menuService.toggleMenuBar.subscribe((res) => {
      this.isMenuVisible = res;
    });
  }
}
