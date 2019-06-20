import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from 'src/app/auth/auth.service';
import { HomeService } from '../home.service';

import { Subscription } from 'rxjs';

import { HomeServerroomData } from '../home-serverroom.data';
import { HomeSupervisionData } from '../home-supervision.data.model';

@Component({
    selector: "app-measurement",
    templateUrl: "./measurement.component.html",
    styleUrls: ["./measurement.component.css"]
})
export class MeasurementComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    isAdmin = 0;
    isValid = false;
    visibleImageNumber = null;
    isLoading = false;
    analysisResultVisible = false;
    avgTemperature = "";
    maxTemperature = "";
    avgHumidity = "";
    maxHumidity = "";
    minTemperature = "";
    minHumidity = "";
    warnings = 0;
    sensorType = 0;
    percentage = 0;
    createdChartData = null;

    userId: string;
    serverRooms: any[];
    today: string;
    descriptionServerRoomName: string;
    descriptionDateFrom: string;
    descriptionDateTo: string;
    currentPreferences: any;
    measurementsResult: any;

    private serverRoomsListener: Subscription;
    private supervisionedServerRoomsListener: Subscription;
    private preferencesListener: Subscription;
    private measurementsDataListener: Subscription;

    constructor(private authService: AuthService, public homeService: HomeService) {}

    ngOnInit() {
        this.isAuthenticated = this.authService.getIsAuth();
        this.isAdmin = this.authService.getIsAdmin();
        this.userId = this.authService.getUserId();
        if(this.isAdmin === 0) {
            this.homeService.getServerRoomsUnderUserCare(this.userId);
            this.supervisionedServerRoomsListener = this.homeService.getSupervisionedRoomsListener().subscribe((supervisionedServerRoomsList: { serverRooms: HomeSupervisionData[] }) => {
                this.serverRooms = supervisionedServerRoomsList.serverRooms;
            })
        } else {
            this.homeService.getServerRoomsList();
            this.serverRoomsListener = this.homeService.getServerRoomsListener().subscribe((serverRoomsList: { serverrooms: HomeServerroomData[] }) => {
                this.serverRooms = serverRoomsList.serverrooms;
            })
        }
        this.preferencesListener = this.homeService.getServerRoomPreferencesListener().subscribe((currentServerRoomPreferences: { serverRoomPreferences: any }) => {
            this.currentPreferences = currentServerRoomPreferences;
        })
        setTimeout(() => {
            this.measurementsDataListener = this.homeService.getMeasurementDataListener().subscribe((measurementsDataList) => {
                this.measurementsResult = measurementsDataList;
                if(this.measurementsResult.length) {
                    this.analysisResultVisible = true;
                    let counter = 0,
                        avgTmp = 0, 
                        avgHum = 0,
                        maxTmp = 0,
                        maxHum = 0,
                        minTmp = parseFloat(this.measurementsResult[0].temperature),
                        minHum = parseFloat(this.measurementsResult[0].humidity),
                        warningsNumber = 0;
                    this.measurementsResult.forEach(element => {
                        avgTmp += parseFloat(element.temperature);
                        avgHum += parseFloat(element.humidity);
                        if(maxTmp < parseFloat(element.temperature)) {
                            maxTmp = parseFloat(element.temperature);
                        }
                        if(maxHum < parseFloat(element.humidity)) {
                            maxHum = parseFloat(element.humidity)
                        }
                        if(minTmp >= parseFloat(element.temperature)) {
                            minTmp = parseFloat(element.temperature)
                        }
                        if(minHum >= parseFloat(element.humidity)) {
                            minHum = parseFloat(element.humidity)
                        }
                        if(this.currentPreferences) {
                            if(this.sensorType == 1) {
                                if(element.temperature >= this.currentPreferences.maximumTemperature || element.temperature <= this.currentPreferences.minimumTemperature) {
                                    warningsNumber++;
                                }
                            }
                            if(this.sensorType == 2) {
                                if(element.humidity >= this.currentPreferences.maximumHumidity || element.humidity <= this.currentPreferences.minimumHumidity) {
                                    warningsNumber++;
                                }
                            }
                        }
                        counter++;
                    })
                    this.avgTemperature = (avgTmp / counter).toFixed(2);
                    this.avgHumidity = (avgHum / counter).toFixed(2);
                    this.maxTemperature = maxTmp.toFixed(2);
                    this.maxHumidity = maxHum.toFixed(2);
                    this.minTemperature = minTmp.toFixed(2);
                    this.minHumidity = minHum.toFixed(2);
                    this.warnings = warningsNumber;
                    this.onCalculatingPercentage();
                    this.onCreatingChartDatasets();
                } else {
                    this.avgTemperature = "0";
                    this.avgHumidity = "0";
                    this.maxTemperature = "0";
                    this.maxHumidity = "0";
                    this.minTemperature = "0";
                    this.minHumidity = "0"
                    this.warnings = 0;
                }
                this.today = (new Date()).toISOString().slice(0, 10).replace(/-/g,"-");
                this.isLoading = false;
            })
        })
        // this.measurementsDataListener = this.homeService.getMeasurementDataListener().subscribe((measurementsDataList) => {
        //     this.measurementsResult = measurementsDataList;
        //     if(this.measurementsResult.length) {
        //         this.analysisResultVisible = true;
        //         let counter = 0,
        //             avgTmp = 0, 
        //             avgHum = 0,
        //             maxTmp = 0,
        //             maxHum = 0,
        //             minTmp = parseFloat(this.measurementsResult[0].temperature),
        //             minHum = parseFloat(this.measurementsResult[0].humidity),
        //             warningsNumber = 0;
        //         this.measurementsResult.forEach(element => {
        //             avgTmp += parseFloat(element.temperature);
        //             avgHum += parseFloat(element.humidity);
        //             if(maxTmp < parseFloat(element.temperature)) {
        //                 maxTmp = parseFloat(element.temperature);
        //             }
        //             if(maxHum < parseFloat(element.humidity)) {
        //                 maxHum = parseFloat(element.humidity)
        //             }
        //             if(minTmp >= parseFloat(element.temperature)) {
        //                 minTmp = parseFloat(element.temperature)
        //             }
        //             if(minHum >= parseFloat(element.humidity)) {
        //                 minHum = parseFloat(element.humidity)
        //             }
        //             if(this.currentPreferences) {
        //                 if(this.sensorType == 1) {
        //                     if(element.temperature >= this.currentPreferences.maximumTemperature || element.temperature <= this.currentPreferences.minimumTemperature) {
        //                         warningsNumber++;
        //                     }
        //                 }
        //                 if(this.sensorType == 2) {
        //                     if(element.humidity >= this.currentPreferences.maximumHumidity || element.humidity <= this.currentPreferences.minimumHumidity) {
        //                         warningsNumber++;
        //                     }
        //                 }
        //             }
        //             counter++;
        //         })
        //         this.avgTemperature = (avgTmp / counter).toFixed(2);
        //         this.avgHumidity = (avgHum / counter).toFixed(2);
        //         this.maxTemperature = maxTmp.toFixed(2);
        //         this.maxHumidity = maxHum.toFixed(2);
        //         this.minTemperature = minTmp.toFixed(2);
        //         this.minHumidity = minHum.toFixed(2);
        //         this.warnings = warningsNumber;
        //         this.onCalculatingPercentage();
        //         this.onCreatingChartDatasets();
        //     } else {
        //         this.avgTemperature = "0";
        //         this.avgHumidity = "0";
        //         this.maxTemperature = "0";
        //         this.maxHumidity = "0";
        //         this.minTemperature = "0";
        //         this.minHumidity = "0"
        //         this.warnings = 0;
        //     }
        //     this.today = (new Date()).toISOString().slice(0, 10).replace(/-/g,"-");
        //     this.isLoading = false;
        // })
    }

    isFormValid(form: NgForm) {
        if(form.valid) {
            this.isValid = true;
        } else {
            this.isValid = false;
        }
        if(form.value.factorType === '1') {
            this.visibleImageNumber = "DS18B20";
        } else if(form.value.factorType === '2') {
            this.visibleImageNumber = "DHT11";
        } else {
            this.visibleImageNumber = null;
        }
    }

    onMeasurementAnalysis(form: NgForm) {
        this.isLoading = true;
        if(form.invalid) {
            return
        } else {
            this.homeService.getServerRoomPreferences(form.value.serverRoomName);
            this.homeService.getMeasurementData(form.value.serverRoomName, form.value.fromDate, form.value.toDate, form.value.factorType);
            this.descriptionServerRoomName = form.value.serverRoomName;
            this.descriptionDateFrom = (form.value.fromDate).toISOString().slice(0, 10).replace(/-/g,"-");
            if(!form.value.toDate) {
                this.descriptionDateTo = (form.value.fromDate).toISOString().slice(0, 10).replace(/-/g,"-");;
            } else {
                this.descriptionDateTo = (form.value.toDate).toISOString().slice(0, 10).replace(/-/g,"-");
            }
            if(form.value.factorType == 1) {
                this.sensorType = 1;
            } else {
                this.sensorType = 2;
            }
        }
    }

    onCancel() {
        this.isValid = false;
    }

    onCalculatingPercentage() {
        this.percentage = this.warnings / this.measurementsResult.length;
        this.percentage = this.percentage * 100;
    }
    
    onCreatingChartDatasets() {
        let daysArray = [];
        let title = "";
        let chartData = { labels: [], datasets: [
            { "data": [], "type": "line", "label": "", "borderWidth": 2, "pointHoverRadius": 5, "fill": false, 
            "borderColor": "#1e88e5", "backgroundColor": "#90caf9", "hoverBackgroundColor": "#42a5f5" }, 
            { "data": [], "type": "line", "label": "", "borderWidth": 2, "pointHoverRadius": 5, "fill": false, "borderColor": "#1976d2", "backgroundColor": "#64b5f6", "hoverBackgroundColor": "#2196f3" },
            { "data": [], "borderWidth": 2, "backgroundColor": "", "hoverBackgroundColor": "", "label": "", "borderColor": "" }
        ]};
        if(this.sensorType == 1) {
            title = this.descriptionServerRoomName + " temperature chart";
            chartData.datasets[2].backgroundColor = "#ef9a9a";
            chartData.datasets[2].hoverBackgroundColor = "#ef5350";
            chartData.datasets[2].borderColor = "#e53935";
            chartData.datasets[2].label = "Measured temperature";
            chartData.datasets[0].label = "Minimal temperature";
            chartData.datasets[1].label = "Maximal temperature";
        } else {
            title = this.descriptionServerRoomName + " humidity chart";
            chartData.datasets[2].backgroundColor = "#a5d6a7";
            chartData.datasets[2].hoverBackgroundColor = "#66bb6a";
            chartData.datasets[2].borderColor = "#43a047";
            chartData.datasets[2].label = "Measured humidity";
            chartData.datasets[0].label = "Minimal humidity";
            chartData.datasets[1].label = "Maximal humidity";
        }
        if(this.measurementsResult.length <= 24) {
            this.measurementsResult.forEach(element => {
                chartData.labels.push(element.date)
                if(this.sensorType == 1) {
                    chartData.datasets[2].data.push(element.temperature);
                    chartData.datasets[0].data.push(this.currentPreferences.minimumTemperature);
                    chartData.datasets[1].data.push(this.currentPreferences.maximumTemperature);
                } else {
                    chartData.datasets[2].data.push(element.humidity);
                    chartData.datasets[0].data.push(this.currentPreferences.minimumHumidity);
                    chartData.datasets[1].data.push(this.currentPreferences.maximumHumidity);
                }
            });
        } else {
            this.measurementsResult.forEach(element => {
                let tmp = new Date(element.realDate);
                let arrayNumber = tmp.getMonth() + tmp.getDay()
                let date = tmp.getFullYear() + "-" + tmp.getMonth() + "-" + tmp.getDay();
                if(this.sensorType == 1) {
                    if(daysArray[arrayNumber] == undefined) {
                        daysArray[arrayNumber] = { date: date, value: parseFloat(element.temperature), counter: 1 };
                    } else {
                        daysArray[arrayNumber].value += parseFloat(element.temperature);
                        daysArray[arrayNumber].counter += 1;
                    }
                } else {
                    if(daysArray[arrayNumber] == undefined) {
                        daysArray[arrayNumber] = { date: date, value: parseFloat(element.humidity), counter: 1 };
                    } else {
                        daysArray[arrayNumber].value += parseFloat(element.humidity);
                        daysArray[arrayNumber].counter += 1;
                    }
                }
            })
            daysArray.forEach(element => {
                element.value = element.value / element.counter;
                element.value = element.value.toFixed(2);
                chartData.labels.push(element.date)
                chartData.datasets[2].data.push(element.value);
                if(this.sensorType == 1) {
                    chartData.datasets[0].data.push(this.currentPreferences.minimumTemperature);
                    chartData.datasets[1].data.push(this.currentPreferences.maximumTemperature);
                } else {
                    chartData.datasets[0].data.push(this.currentPreferences.minimumHumidity);
                    chartData.datasets[1].data.push(this.currentPreferences.maxHumidity);
                }
            });
        }
        this.createdChartData = { title: title, data: chartData};
    }

    ngOnDestroy() {
        if(this.isAdmin === 1) {
            this.serverRoomsListener.unsubscribe();
        } else {
            this.supervisionedServerRoomsListener.unsubscribe();
        }
        this.preferencesListener.unsubscribe();
        this.measurementsDataListener.unsubscribe();
    }
}