import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { VehiclesComponent } from './features/vehicles/vehicles.component';
import { AuthGuard } from './core/gaurd/auth.gaurd';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('src/app/features/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'vehicles',
        component: VehiclesComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
