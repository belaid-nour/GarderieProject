import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexMarkers,
  ApexGrid,
  ApexTitleSubtitle,
  ApexFill,
  ApexResponsive,
  ApexTheme,
  ApexNonAxisChartSeries,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { StatisticCard2Component } from '@shared/components/statistic-card2/statistic-card2.component';
import { AttendanceChartComponent } from '@shared/components/attendance-chart/attendance-chart.component';
import { ChartCard4Component } from '@shared/components/chart-card4/chart-card4.component';
import { EventCardComponent } from '@shared/components/event-card/event-card.component';
import { ScheduleCardComponent } from '@shared/components/schedule-card/schedule-card.component';
import { TableCardComponent } from '@shared/components/table-card/table-card.component';
import { EmpStatusComponent } from '@shared/components/emp-status/emp-status.component';
import { ChartCard1Component } from '@shared/components/chart-card1/chart-card1.component';
import { OrderInfoBoxComponent } from '@shared/components/order-info-box/order-info-box.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  fill: ApexFill;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    NgApexchartsModule,
    NgScrollbarModule,
    BreadcrumbComponent,
    StatisticCard2Component,
    AttendanceChartComponent,
    ChartCard4Component,
    EventCardComponent,
    ScheduleCardComponent,
    TableCardComponent,
    EmpStatusComponent,
    ChartCard1Component,
    OrderInfoBoxComponent,
  ],
})
export class MainComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  public lineChartOptions: Partial<ChartOptions> = {};
  public barChartOptions: Partial<ChartOptions> = {};

  breadscrums = [
    {
      title: 'Dashboard',
      items: [],
      active: 'Dashboard',
    },
  ];

  stats = {
    totalAdmins: 0,
    totalParents: 0,
    totalTeachers: 0,
    totalEnfants: 0,
    totalUsers: 0,
    enfantsParSexe: {
      M: 0,
      F: 0,
    },
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
    this.initBarChart();
  }

  loadStats() {
    this.http.get<any>('http://localhost:8081/dashboard/totals').subscribe({
      next: (data) => {
        this.stats = {
          totalAdmins: data.admins ?? 0,
          totalParents: data.parents ?? 0,
          totalTeachers: data.teachers ?? 0,
          totalEnfants: data.enfants ?? 0,
          totalUsers: (data.admins ?? 0) + (data.parents ?? 0) + (data.teachers ?? 0),
          enfantsParSexe: data.enfantsParSexe ?? { M: 0, F: 0 }
        };
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.stats = {
          totalAdmins: 0,
          totalParents: 0,
          totalTeachers: 0,
          totalEnfants: 0,
          totalUsers: 0,
          enfantsParSexe: { M: 0, F: 0 },
        };
      },
    });
  }

  initBarChart() {
    this.barChartOptions = {
      series: [
        {
          name: 'percent',
          data: [5, 8, 10, 14, 9, 7, 11, 5, 9, 16, 7, 5],
        },
      ],
      chart: {
        height: 320,
        type: 'bar',
        toolbar: { show: false },
        foreColor: '#9aa0ac',
      },
      plotOptions: {
        bar: {
          dataLabels: { position: 'top' },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val}%`,
        offsetY: -20,
        style: { fontSize: '12px', colors: ['#9aa0ac'] },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        categories: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ],
        position: 'bottom',
        labels: { offsetY: 0 },
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: { enabled: true, offsetY: -35 },
      },
      fill: {
        type: 'gradient',
        colors: ['#4F86F8', '#4F86F8'],
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
        },
      },
      yaxis: {
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: false, formatter: (val) => `${val}%` },
      },
      tooltip: {
        theme: 'dark',
        marker: { show: true },
        x: { show: true },
      },
    };
  }
}