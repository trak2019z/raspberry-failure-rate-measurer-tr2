import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';

import { HomeService } from "../home.service";
import { AuthService } from "src/app/auth/auth.service";
import { HomeSupervisionData } from '../home-supervision.data.model';
import { HomeServerroomData } from '../home-serverroom.data';

@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    isAdmin = 0;
    userId: string;
    isButtonDisabled = true;
    isChangingPassword = false;
    supervisionedServerRooms: HomeSupervisionData[] = [];
    serverRooms: HomeServerroomData[] = [];
    selectedServerRoom: string;
    minTemperature: number;
    maxTemperature: number;
    minHumidity: number;
    maxHumidity: number;
    currentPreferences: any;
    private supervisionedServerRoomsListener: Subscription;
    private serverRoomsListener: Subscription;
    private preferencesListener: Subscription;

    constructor(public homeService: HomeService, private authService: AuthService) {}

    ngOnInit() {
        this.isAuthenticated = this.authService.getIsAuth();
        this.isAdmin = this.authService.getIsAdmin();
        this.userId = this.authService.getUserId();
        if(this.isAdmin === 0) {
            this.homeService.getServerRoomsUnderUserCare(this.userId);
        } else {
            this.homeService.getServerRoomsList();
            this.serverRoomsListener = this.homeService.getServerRoomsListener().subscribe((serverRoomsList: { serverrooms: HomeServerroomData[] }) => {
                this.serverRooms = serverRoomsList.serverrooms;
            })
        }
        this.supervisionedServerRoomsListener = this.homeService.getSupervisionedRoomsListener().subscribe((supervisionedServerRoomsList: { serverRooms: HomeSupervisionData[] }) => {
            this.supervisionedServerRooms = supervisionedServerRoomsList.serverRooms;
        })
        this.preferencesListener = this.homeService.getServerRoomPreferencesListener().subscribe((currentServerRoomPreferences: { serverRoomPreferences: any }) => {
            this.currentPreferences = currentServerRoomPreferences;
            if(this.currentPreferences != null) {
                this.maxHumidity = this.currentPreferences.maximumHumidity;
                this.maxTemperature = this.currentPreferences.maximumTemperature;
                this.minHumidity = this.currentPreferences.minimumHumidity;
                this.minTemperature = this.currentPreferences.minimumTemperature;
            }
        })
    }

    isFormValid(form: NgForm) {
        if(form.valid) {
            this.isButtonDisabled = false;
        } else {
            this.isButtonDisabled = true;
        }
    }

    onChangePassword(form: NgForm) {
        if(form.invalid) {
            return;
        } else {
            this.isChangingPassword = true;
            this.homeService.changePassword(this.userId, form.value.oldPassword, form.value.newPassword, form.value.repeatNewPassword)
        }
    }

    onRenouncingSupervision(serverRoomName) {
        this.homeService.renounceSupervision(this.userId, serverRoomName);
    }

    getServerRoomPreferences(serverRoomName) {
        this.homeService.getServerRoomPreferences(serverRoomName);
    }

    onServerRoomPreferencesUpdate() {
        this.homeService.updateServerRoomPreferences(this.selectedServerRoom, this.minTemperature, this.maxTemperature, this.minHumidity, this.maxHumidity);
    }
    
    ngOnDestroy() {
        if(this.supervisionedServerRooms.length) {
            this.supervisionedServerRoomsListener.unsubscribe();
        }
        if(this.serverRooms.length > 0) {
            this.serverRoomsListener.unsubscribe();
        }
        this.preferencesListener.unsubscribe();
    }
}