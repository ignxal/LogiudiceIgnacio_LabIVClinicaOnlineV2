import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderComponent } from './loader/loader.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { CaptchaDirective } from '../../directives/captcha.directive';
import { FormsModule } from '@angular/forms';
import { SharedComponent } from './shared.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    LoaderComponent,
    NavbarComponent,
    CaptchaComponent,
    CaptchaDirective,
    SharedComponent,
    FooterComponent,
  ],
  imports: [CommonModule, RouterModule, MatProgressBarModule, FormsModule],
  exports: [
    FooterComponent,
    NavbarComponent,
    CaptchaDirective,
    CaptchaComponent,
  ],
})
export class SharedModule {}
