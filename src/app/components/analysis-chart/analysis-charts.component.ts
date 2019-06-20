import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Chart } from "chart.js";

@Component({
    selector: "app-analysis-chart",
    templateUrl: "./analysis-chart.component.html",
    styleUrls: ["./analysis-chart.component.css"]
})

export class AnalysisChartComponent implements OnInit, OnChanges {
    @Input() chartData: { title: string, data: [] }
    @ViewChild('barChart') barChart: ElementRef;

    analysisChart = null;
    dataToDisplay = null;
    generatedChart = null;

    constructor() {}

    ngOnInit() {
        this.analysisChart = this.barChart.nativeElement.getContext("2d");
        this.dataToDisplay = {
            labels: ["A", "B"],
            datasets: [
                { "data": [11, 22, 33], 
                  "borderColor": "rgba(197,23,1,0.8)", 
                  "backgroundColor": "rgba(197,23,1,0.4)",
                  "hoverBackgroundColor": "rgba(197,23,1,1)",
                  "borderWidth": 1,
                  "pointRotation": 5,
                  "pointHoverRadius": 8,
                  "fill": false,
                  "label": "Series A" 
                },
                { "data": [22, 22, 22], 
                  "borderColor": "rgba(234,43,1,0.8)", 
                  "backgroundColor": "rgba(234,43,1,0.4)",
                  "hoverBackgroundColor": "rgba(234,43,1,1)",
                  "borderWidth": 1,
                  "pointRotation": 5,
                  "pointHoverRadius": 8,
                  "fill": false,
                  "label": "Series B",
                  "type": "line",
                }
            ]
        };
        this.generatedChart = new Chart(this.analysisChart, {
            "type": "bar",
            "data": this.dataToDisplay,
            "options": {
                "title" :{
                    "display": true,
                    "text": ""
                },
                "responsive": true,
                "showLines": true,
                "animation": {
                    "animateScale": true,
                }
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        setTimeout(() => {
            this.dataToDisplay.labels = changes.chartData.currentValue.data.labels;
            this.dataToDisplay.datasets = changes.chartData.currentValue.data.datasets;
            this.generatedChart.showLines = true;
            this.generatedChart.update();
        })
    }
}