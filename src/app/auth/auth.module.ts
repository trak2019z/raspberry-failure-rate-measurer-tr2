import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { ConfirmEqualValidatorDirective } from '../shared/confirm-equal-validator.directive';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ConfirmEqualValidatorDirective
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    AuthRoutingModule
  ]
})

export class AuthModule {}
