import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { isUndefined } from 'util';

@Component({
    selector: "app-dashboard-cards",
    templateUrl: "./dashboard-cards.component.html",
    styleUrls: ["./dashboard-cards.component.css"]
})

export class DashboardCardsComponent implements OnInit, OnChanges {
    @Input() today: string;
    @Input() avgTemperature: string;
    @Input() maxTemperature: string;
    @Input() avgHumidity: string;
    @Input() maxHumidity: string;
    @Input() warnings: number;
    @Input() preferences: any;

    minPrevailedTemperature = 0;
    minPrevailedHumidity = 0;
    maxPrevailedTemperature = 0;
    maxPrevailedHumidity = 0;

    constructor() {}

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        if(changes.today != undefined) {
            const today = changes.today.currentValue;
        }
        if(changes.avgTemperature != undefined) {
            const avgTemperature = changes.avgTemperature.currentValue;
        }
        if(changes.maxTemperature != undefined) {
            const maxTemperature = changes.maxTemperature.currentValue;
        }
        if(changes.avgHumidity != undefined) {
            const avgHumidity = changes.avgHumidity.currentValue;
        }
        if(changes.maxHumidity != undefined) {
            const maxHumidity = changes.maxHumidity.currentValue;
        }
        if(changes.warnings != undefined) {
            const warnings = changes.warnings.currentValue;
        }
        if(changes.preferences != undefined) {
            if(isUndefined(changes.preferences.currentValue)) {
                return
            }
            const newPreferences = changes.preferences.currentValue;
            this.minPrevailedTemperature = newPreferences.minimumTemperature;
            this.minPrevailedHumidity = newPreferences.minimumHumidity;
            this.maxPrevailedTemperature = newPreferences.maximumTemperature;
            this.maxPrevailedHumidity = newPreferences.maximumHumidity;
        }
    }
}