import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { HomeComponent } from './features/home/home.component';
import { AppCommonModule } from './app.common.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { VehiclesComponent } from './features/vehicles/vehicles.component';
import { WidgetModel } from './shared/widgets/widget.model';
import { MessageService } from 'primeng/api';
import { AuthGuard } from './core/gaurd/auth.gaurd';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    // WidgetsComponent,
    HomeComponent,
    VehiclesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppCommonModule,
    NgxSpinnerModule,
    WidgetModel,
  ],
  providers: [MessageService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
