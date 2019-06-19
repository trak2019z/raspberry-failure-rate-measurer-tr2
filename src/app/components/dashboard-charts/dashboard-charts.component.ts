import { Component, OnInit, OnChanges, SimpleChanges, Input, ViewChild, ElementRef } from '@angular/core';

import { Chart } from "chart.js";

@Component({
    selector: "app-dashboard-charts",
    templateUrl: "./dashboard-charts.component.html",
    styleUrls: ["./dashboard-charts.component.css"]
})

export class DashboardChartsComponent implements OnInit, OnChanges {
    @Input() preferences: any;
    @Input() abbreviation: any;

    @ViewChild('temperatureDoughnut') temperatureDoughnut: ElementRef;
    @ViewChild('humidityDoughnut') humidityDoughnut: ElementRef;
    @ViewChild('warningDoughnut') warningDoughnut: ElementRef;

    tmpChart = null;
    humChart = null;
    warnChart = null;
    newPreferences = undefined;
    newAbbreviation = undefined;

    private tmpData = null;
    private humData = null;
    private warnData = null;

    ngOnInit() {
        let donutTmp = this.temperatureDoughnut.nativeElement.getContext('2d');
        let donutHum = this.humidityDoughnut.nativeElement.getContext('2d');
        let donutWarn = this.warningDoughnut.nativeElement.getContext('2d');
        this.tmpData = {
            labels: ["Temperature below admissible", "Temperature above admissible", "Permissible temperature"],
            datasets: [{"data": [0, 0, 0], "backgroundColor": ["#F44336", "#e57373", "#607d8b"]}]
        }
        this.humData = {
            labels: ["Humidity below admissible", "Humidity above admissible", "Permissible humidity"],
            datasets: [{"data": [0, 0, 0], "backgroundColor": ["#4CAF50", "#81c784", "#607d8b"]}]
        }
        this.warnData = {
            labels: ["Number of warnings", "Measurements falling within the norm"],
            datasets: [{"data": [0, 0], "backgroundColor": ["#03A9F4", "#607d8b"]}]
        }
        this.tmpChart = new Chart(donutTmp,
            {
                "type": 'doughnut',
                "data": this.tmpData,
                "options": {
                    "cutoutPercentage": 50,
                    "animation": {
                        "animateScale": true,
                        "animateRotate": true
                    }
                }
            });
        this.humChart = new Chart(donutHum,
            {
                "type": 'doughnut',
                "data": this.humData,
                "options": {
                    "cutoutPercentage": 50,
                    "animation": {
                        "animateScale": true,
                        "animateRotate": true
                    }
                }
            });
        this.warnChart = new Chart(donutWarn,
            {
                "type": 'doughnut',
                "data": this.warnData,
                "options": {
                    "cutoutPercentage": 50,
                    "animation": {
                        "animateScale": true,
                        "animateRotate": true
                    }
                }
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        let tmpAbove = 0, 
            tmpBelow = 0, 
            tmpPermissible = 0,
            humAbove = 0, 
            humBelow = 0, 
            humPermissible = 0,
            warn = 0, 
            norm = 0;
        if(changes.preferences != undefined) {
            this.newPreferences = changes.preferences.currentValue;
        }
        if(changes.abbreviation != undefined) {
            if(changes.abbreviation.currentValue == null) {
                return;
            }
            this.newAbbreviation = changes.abbreviation.currentValue;
            if(this.newPreferences != undefined) {
                this.newAbbreviation.forEach(element => {
                    // Temperature
                    if(parseFloat(element.temperature) >= this.newPreferences.maximumTemperature) {
                        tmpAbove++;
                        warn++;
                    } else if(parseFloat(element.temperature) <= this.newPreferences.minimumTemperature) {
                        tmpBelow++;
                        warn++;
                    } else {
                        tmpPermissible++;
                        norm++;
                    }
                    // Humidity
                    if(parseFloat(element.humidity) >= this.newPreferences.maximumHumidity) {
                        humAbove++;
                        warn++;
                    } else if(parseFloat(element.humidity) <= this.newPreferences.minimumHumidity) {
                        humBelow++;
                        warn++;
                    } else {
                        humPermissible++;
                        norm++;
                    }
                });
            }
            // this.newAbbreviation.forEach(element => {
            //     // Temperature
            //     if(parseFloat(element.temperature) >= this.newPreferences.maximumTemperature) {
            //         tmpAbove++;
            //         warn++;
            //     } else if(parseFloat(element.temperature) <= this.newPreferences.minimumTemperature) {
            //         tmpBelow++;
            //         warn++;
            //     } else {
            //         tmpPermissible++;
            //         norm++;
            //     }
            //     // Humidity
            //     if(parseFloat(element.humidity) >= this.newPreferences.maximumHumidity) {
            //         humAbove++;
            //         warn++;
            //     } else if(parseFloat(element.humidity) <= this.newPreferences.minimumHumidity) {
            //         humBelow++;
            //         warn++;
            //     } else {
            //         humPermissible++;
            //         norm++;
            //     }
            // });
        }
        this.tmpData.datasets[0].data = [tmpBelow, tmpAbove, tmpPermissible];
        this.humData.datasets[0].data = [humBelow, humAbove, humPermissible];
        this.warnData.datasets[0].data = [warn, norm];
        this.tmpChart.update();
        this.humChart.update();
        this.warnChart.update();
    }
}
// #1fc8f8 first color
// #76a346 second color