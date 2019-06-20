import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
    isButtonDisabled = true;
    isRegistering = false;
    registeringSuccessfull = false;
    registeringFailed = false;
    userIsAuthenticated = false;
    private createUserRespondSub: Subscription;
    // private authStatusSub: Subscription;

    constructor(public authService: AuthService, private router: Router) {}

    ngOnInit() {
        this.userIsAuthenticated = this.authService.getIsAuth();
        if(this.userIsAuthenticated) {
            this.router.navigate(["/home"]);
        }
        this.createUserRespondSub = this.authService.getCreateResult().subscribe((obj: { code: number }) => {
            this.registeringSuccessfull = false;
            this.registeringFailed = false;
            if(obj.code === 201) {
                this.registeringSuccessfull = true;
            } else {
                this.registeringFailed = true;
            }
            this.isRegistering = false;
          });
    }

    isFormValid(form: NgForm) {
        this.registeringSuccessfull = false;
        this.registeringFailed = false;
        if(form.valid) {
            this.isButtonDisabled = false;
        } else {
            this.isButtonDisabled = true;
        }
    }

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        } else {
            this.isRegistering = true;
            this.authService.createUser(form.value.login, form.value.password, form.value.repeatpassword);
        }
    }

    ngOnDestroy() {
        // this.authStatusSub.unsubscribe();
        this.createUserRespondSub.unsubscribe();
    }
}