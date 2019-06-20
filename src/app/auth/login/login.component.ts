import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
    isButtonDisabled = true;
    loginFailed = false;
    accountDisabled = false;
    isAuthenticating = false;
    userIsAuthenticated = false;
    private loginUserRespondSub: Subscription;
    private authStatusSub: Subscription;

    constructor(public authService: AuthService, private router: Router) {}

    ngOnInit() {
        this.userIsAuthenticated = this.authService.getIsAuth();
        if(this.userIsAuthenticated) {
            this.router.navigate(["/home"]);
        }
        this.authStatusSub = this.authService.gethAuthStatusListener().subscribe(authStatus => {
            this.loginFailed = true;
            this.isAuthenticating = false;
        })
        this.loginUserRespondSub = this.authService.getLoginResult().subscribe((obj: { code: number }) => {
            if(obj.code === 403) {
                this.accountDisabled = true;
                this.isAuthenticating = false;
            }
        });
    }

    isFormValid(form: NgForm) {
        this.loginFailed = false;
        this.accountDisabled = false;
        if(form.valid) {
            this.isButtonDisabled = false;
        } else {
            this.isButtonDisabled = true;
        }
    }

    onLogin(form: NgForm) {
        if(form.invalid) {
            return;
        } else {
            this.isAuthenticating = true;
            this.authService.login(form.value.login, form.value.password);
        }
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
        this.loginUserRespondSub.unsubscribe();
    }
}