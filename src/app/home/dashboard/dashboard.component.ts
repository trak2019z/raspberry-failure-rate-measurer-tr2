import { Component, OnInit, OnDestroy } from "@angular/core";

import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { HomeService } from '../home.service';

import { HomeServerroomData } from '../home-serverroom.data';
import { HomeSupervisionData } from '../home-supervision.data.model';

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit, OnDestroy {
    isLoading = false;
    isAuthenticated = false;
    isAdmin = 0;
    serverRoomName = "";
    serverRoomListVisible = false;
    abbreviation = null;
    serverRoomAbbreviationToDisplay = "";

    userId: string;
    serverRooms: HomeServerroomData[] = [];
    supervisionedServerRooms: HomeSupervisionData[] = [];
    currentPreferences: any;
    today: string;
    avgTemperature = "";
    maxTemperature = "";
    avgHumidity = "";
    maxHumidity = "";
    warnings = 0;

    private serverRoomsListener: Subscription;
    private supervisionedServerRoomsListener: Subscription;
    private preferencesListener: Subscription;
    private abbreviationListener: Subscription;

    constructor(private authService: AuthService, public homeService: HomeService) {}

    ngOnInit() {
        this.isAuthenticated = this.authService.getIsAuth();
        this.isAdmin = this.authService.getIsAdmin();
        this.userId = this.authService.getUserId();
        if(this.isAdmin === 0) {
            this.homeService.getServerRoomsUnderUserCare(this.userId);
            this.supervisionedServerRoomsListener = this.homeService.getSupervisionedRoomsListener().subscribe((supervisionedServerRoomsList: { serverRooms: HomeSupervisionData[] }) => {
                this.supervisionedServerRooms = supervisionedServerRoomsList.serverRooms;
                this.serverRoomName = this.supervisionedServerRooms[0].serverRoomName;
                this.onDashboardLoad(this.supervisionedServerRooms[0].serverRoomName);
            })
        } else {
            this.homeService.getServerRoomsList();
            this.serverRoomsListener = this.homeService.getServerRoomsListener().subscribe((serverRoomsList: { serverrooms: HomeServerroomData[] }) => {
                this.serverRooms = serverRoomsList.serverrooms;
                this.serverRoomName = this.serverRooms[0].name;
                this.onDashboardLoad(this.serverRooms[0].name);
            })
        }
        this.preferencesListener = this.homeService.getServerRoomPreferencesListener().subscribe((currentServerRoomPreferences: { serverRoomPreferences: any }) => {
            this.currentPreferences = currentServerRoomPreferences;
        })
        this.abbreviationListener = this.homeService.getAbbreviationListener().subscribe((measurementsAbbreviationList) => {
            let counter = 0,
                avgTmp = 0, 
                avgHum = 0,
                maxTmp = 0,
                maxHum = 0,
                warningsNumber = 0;
            this.abbreviation = measurementsAbbreviationList;
            if(this.abbreviation.length) {
                this.today = this.abbreviation[0].date.slice(0, 10);
                this.abbreviation.forEach(element => {
                    avgTmp += parseFloat(element.temperature);
                    avgHum += parseFloat(element.humidity);
                    if(maxTmp < parseFloat(element.temperature)) {
                        maxTmp = parseFloat(element.temperature);
                    }
                    if(maxHum < parseFloat(element.humidity)) {
                        maxHum = parseFloat(element.humidity)
                    }
                    if(this.currentPreferences) {
                        if(element.temperature >= this.currentPreferences.maximumTemperature || element.temperature <= this.currentPreferences.minimumTemperature) {
                            warningsNumber++;
                        }
                        if(element.humidity >= this.currentPreferences.maximumHumidity || element.humidity <= this.currentPreferences.minimumHumidity) {
                            warningsNumber++;
                        }
                    }
                    counter++;
                });
                this.avgTemperature = (avgTmp / counter).toFixed(2);
                this.avgHumidity = (avgHum / counter).toFixed(2);
                this.maxTemperature = maxTmp.toFixed(2);
                this.maxHumidity = maxHum.toFixed(2);
                this.warnings = warningsNumber;
            } else {
                this.avgTemperature = "0";
                this.avgHumidity = "0";
                this.maxTemperature = "0";
                this.maxHumidity = "0";
                this.warnings = 0;
            }
        })
    }

    onDashboardLoad(name: string) {
        this.homeService.getServerRoomPreferences(name);
        this.homeService.getDashboardAbbreviation(name);
    }

    onSummaryTooltipImageclick() {
        this.serverRoomListVisible = !this.serverRoomListVisible;
    }

    onChangingServerRoomAbbreviationToDisplay() {
        if(this.serverRoomAbbreviationToDisplay != this.serverRoomName) {
            this.homeService.getServerRoomPreferences(this.serverRoomAbbreviationToDisplay);
            this.homeService.getDashboardAbbreviation(this.serverRoomAbbreviationToDisplay);
            this.serverRoomName = this.serverRoomAbbreviationToDisplay;
            this.serverRoomAbbreviationToDisplay = "";
            this.serverRoomListVisible = false;
        } else {
            this.serverRoomAbbreviationToDisplay = "";
            this.serverRoomListVisible = false;
        }
    }

    ngOnDestroy() {
        if(this.supervisionedServerRooms.length) {
            this.supervisionedServerRoomsListener.unsubscribe();
        }
        if(this.serverRooms.length > 0) {
            this.serverRoomsListener.unsubscribe();
        }
        this.preferencesListener.unsubscribe();
        this.abbreviationListener.unsubscribe();
    }
}