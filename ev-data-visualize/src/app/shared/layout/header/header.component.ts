import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONFIG } from 'src/app/config/config';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  overlayVisible: boolean = false;
  headerLogoUrl: string = CONFIG.appLogo;
  avatarName: string = '';
  isMenuVisible: boolean = true;
  fullName: string = 'Sharmil Adroja';
  emailId: string = '';

  constructor(private menuService: MenuService, private router: Router) {
    this.menuService.toggleMenuBar.subscribe((res) => {
      this.isMenuVisible = !res;
    });
  }

  ngOnInit(): void {
    this.formateUserDetails();
  }

  formateUserDetails() {
    const sessionData: any = sessionStorage.getItem('user');
    const userDetails: any = JSON.parse(sessionData);
    this.avatarName = userDetails.name.slice(0, 2).toUpperCase();
    this.emailId = userDetails.email;
    this.fullName = userDetails.name;
  }

  toggleMenu() {
    this.menuService.toggleMenuBar.next(true);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
