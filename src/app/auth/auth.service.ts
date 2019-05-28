import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { AuthSignupData } from "./auth-signup-data.model";
import { AuthLoginData } from "./auth-login-data.model";
import { Subject } from "rxjs";

const url = "http://localhost:3000/api/auth/";

@Injectable({providedIn: "root"})
export class AuthService {
    private authStatusListener = new Subject<boolean>();
    private createResult = new Subject<{code: number}>();
    private token: string;
    private isAuthenticated = false;
    private userId: string;
    private isAdmin: number;
    private tokenTimer: any;
    private loginResult = new Subject<{code: number}>();

    constructor(private http: HttpClient, private router: Router) {}

    private setAuthTimer(duration: number) {
        console.log("Setting timer: " + duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
        localStorage.setItem("userId", userId);
      }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
      }

    createUser(login: string, password: string, repeatpassword: string) {
        const authData: AuthSignupData = { login: login, password: password, repeatpassword: repeatpassword };
        this.http.post(url + "signup", authData)
        .subscribe((result: any) => {
            this.createResult.next({
                code: result.code
            })
        }, error => {
            this.createResult.next({
                code: error.error.code
            });
            this.authStatusListener.next(false);
        });
    }

    getCreateResult() {
        return this.createResult.asObservable();
    }

    gethAuthStatusListener() {
        return this.authStatusListener.asObservable();
      }

    login(login: string, password: string) {
        const userData: AuthLoginData = { login: login, password: password };
        this.http.post<{ token: string, tokenLifespan: number, id: string, login: string, isAdmin: number }>(url + "login", userData)
        .subscribe(response => {
            const token = response.token;
            this.token = token;
            if(token) {
                const tokenLifespan = response.tokenLifespan;
                this.setAuthTimer(tokenLifespan);
                this.isAuthenticated = true;
                this.userId = response.id;
                this.isAdmin = response.isAdmin;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + tokenLifespan * 1000);
                console.log(expirationDate);
                this.saveAuthData(token, expirationDate, this.userId); // this.isAdmin
                this.router.navigate(["/home"]);
            }
        }, error => {
            this.loginResult.next({
                code: error.status
            });
            this.authStatusListener.next(false);
        })
    }

    getLoginResult() {
        return this.loginResult.asObservable();
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null;
        this.isAdmin = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(["/auth"]);
    }

    getIsAuth() {
        return this.isAuthenticated;
      }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if(!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
          }
      }

    getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        if (!token || !expirationDate) {
          return;
        }
        return {
          token: token,
          expirationDate: new Date(expirationDate),
          userId: userId
        }
    }

}