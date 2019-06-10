import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { HomeAccountData } from "../home-account.data.model";
import { HomeServerroomData } from '../home-serverroom.data';
import { HomeService } from "../home.service";
import { AuthService } from "src/app/auth/auth.service";
import { Subscription } from "rxjs";

@Component({
    selector: "app-administration",
    templateUrl: "./administration.component.html",
    styleUrls: ["./administration.component.css"]
})
export class AdministrationComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    isAdmin = 0;
    isLoading = false;
    disabledAccount: string;
    activatedAccount: string;
    userAccount: string;
    serverRoom: string;
    accountToBound: string;
    serverRoomToBound: string;
    disabledAccounts: HomeAccountData[] = [];
    activeAccounts: HomeAccountData[] = [];
    serverRooms: HomeServerroomData[] = [];
    private disabledAccountsListener: Subscription;
    private activatedAccountsListener: Subscription;
    private serverRoomsListener: Subscription;
    isButtonDisabled = true;

    constructor(public homeService: HomeService, private authService: AuthService, private router: Router) {}

    ngOnInit() {
        this.isAuthenticated = this.authService.getIsAuth();
        this.isAdmin = this.authService.getIsAdmin();
        if(this.isAdmin === 0) {
            this.router.navigate(["/home"]);
        }
        this.isLoading = true;
        this.homeService.getNotActiveAccountsList();
        this.disabledAccountsListener = this.homeService.getDisabledAccountsListener().subscribe((disabledAccountsList: { accounts: HomeAccountData[] }) => {
            this.disabledAccounts = disabledAccountsList.accounts;
        })
        this.homeService.getActiveAccountsList();
        this.activatedAccountsListener = this.homeService.getActiveAccountsListener().subscribe((activeAccountsList: { accounts: HomeAccountData[] }) => {
            this.activeAccounts = activeAccountsList.accounts;
        })
        this.homeService.getServerRoomsList();
        this.serverRoomsListener = this.homeService.getServerRoomsListener().subscribe((serverRoomsList: { serverrooms: HomeServerroomData[] }) => {
            this.serverRooms = serverRoomsList.serverrooms;
        })
        this.isLoading = false;
    }

    onAccountActivating() {
        if(this.disabledAccount) {
            let login = null;
            this.disabledAccounts.forEach(element => {
                if(element.id === this.disabledAccount) {
                    login = element.login;
                }
            });
            this.homeService.activateAccount(this.disabledAccount, login);
            this.disabledAccount = null;
        }
    }

    onAccountDisabling() {
        if(this.activatedAccount) {
            let login = null;
            this.activeAccounts.forEach(element => {
                if(element.id === this.activatedAccount) {
                    login = element.login;
                }
            });
            this.homeService.disableAccount(this.activatedAccount, login);
            this.activatedAccount = null;
        }
    }

    onPrivilegesGranting() {
        if(this.userAccount) {
            let login = null;
            this.activeAccounts.forEach(element => {
                if(element.id === this.userAccount) {
                    login = element.login;
                }
            });
            this.homeService.giveAccountAdminPrivileges(this.userAccount, login);
            this.userAccount = null;
        }
    }

    isFormValid(form: NgForm) {
        if(form.valid) {
            this.isButtonDisabled = false;
        } else {
            this.isButtonDisabled = true;
        }
    }

    onAddingServerRoom(form: NgForm) {
        if(form.invalid) {
            return;
        } else {
            this.homeService.createServerRoom(form.value.serverName, form.value.serverAddress, form.value.serverCity);
            form.reset();
            this.isButtonDisabled = true;
        }
    }

    onDeletingServerRoom() {
        this.homeService.deleteServerRoom(this.serverRoom);
    }

    onBoundingUserToServerRoom() {
        this.homeService.createRelationBetweenUserAndServerRoom(this.accountToBound, this.serverRoomToBound);
    }

    onDeletingBoundBetweenUserAndServerRoom() {
        this.homeService.deleteRelationBetweenUserAndServerRoom(this.accountToBound, this.serverRoomToBound);
    }

    ngOnDestroy() {
        this.disabledAccountsListener.unsubscribe();
        this.activatedAccountsListener.unsubscribe();
        this.serverRoomsListener.unsubscribe();
    }
}