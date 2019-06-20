import { Component, OnInit } from "@angular/core";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
    isAdmin = 0;

    constructor(public authService: AuthService) {}

    ngOnInit() {
        this.isAdmin = this.authService.getIsAdmin();
    }

    onLogout() {
        this.authService.logout();
      }
}