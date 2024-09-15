import { NgModule } from '@angular/core';
import { AppCommonModule } from 'src/app/app.common.module';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routing';

@NgModule({
  imports: [LoginRoutingModule, AppCommonModule],
  declarations: [LoginComponent],
  exports: [],
})
export class LoginModule {}
