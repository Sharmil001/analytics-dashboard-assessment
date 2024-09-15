import { NgModule } from '@angular/core';
import { AppCommonModule } from 'src/app/app.common.module';
import { WidgetsComponent } from './widgets.component';
import { AvatarComponent } from './avatar/avatar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [AppCommonModule, FormsModule, CommonModule],
  declarations: [WidgetsComponent, AvatarComponent],
  exports: [AvatarComponent],
})
export class WidgetModel {}
