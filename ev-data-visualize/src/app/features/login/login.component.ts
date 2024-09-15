import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONFIG } from 'src/app/config/config';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: any;
  logoUrl: any = CONFIG.appLogo;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.form.valid && this.ValidateEmail(this.form.value.email)) {
      const user = {
        name: this.extractNameFromEmail(this.form.value.email),
        email: this.form.value.email,
      };

      this.router.navigateByUrl('/dashboard');
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  private ValidateEmail(email: any) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Invalid Email!',
      detail: 'Please enter a valid email address',
    });
    return false;
  }

  extractNameFromEmail(email: string): string {
    const username = email.split('@')[0];
    const name = username
      .replace(/\./g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return name;
  }
}
