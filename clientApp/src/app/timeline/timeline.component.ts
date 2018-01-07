import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import 'highcharts/adapters/standalone-framework.src';
import * as xRange from 'highcharts/modules/xrange.js';
import { BatchService } from '../services/batch.service';
import { Batch } from '../domain/batch';
import { TrainerService } from './../services/trainer.service';
import { Trainer } from './../domain/trainer';
import { CurriculaService } from './../services/curricula.service';

const Highcharts = require('highcharts/highcharts.src');

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})

export class TimelineComponent implements AfterViewInit, OnInit {
  curriculum = new FormControl();
  focus = new FormControl();
  location = new FormControl();
  bulding = new FormControl();
  curriculumList = ['Java', '.NET', 'SDET', 'HIBERNATE', 'SPRING', 'BIG DATA'];
  focusList = ['Java', '.NET', 'SDET', 'HIBERNATE', 'SPRING', 'BIG DATA'];
  locationList = ['Java', '.NET', 'SDET', 'HIBERNATE', 'SPRING', 'BIG DATA'];
  buldingList = ['Java', '.NET', 'SDET', 'HIBERNATE', 'SPRING', 'BIG DATA'];

  isConcluded = false;

  batches: Batch[];
  filteredBatches: Batch[];
  trainers: Trainer[];

  trainer: Trainer;





  batchTimeLine: any;



  @ViewChild('container', { read: ElementRef }) container: ElementRef;

  private chart: any;

  constructor(
    private batchService: BatchService,
    private trainerService: TrainerService,
    private curriculumService: CurriculaService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {


    xRange(Highcharts);

    this.chart = Highcharts.chart(this.container.nativeElement, {
      chart: {
        type: 'xrange'
      },
      title: {
        text: 'Batches'
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: ''
        },
        categories: [''],
        reversed: true
      },
      // tooltip: {
      //   pointFormat: '{series.name}: <b>{point.y}</b>',
      //   backgroundColor: '#FCFFC5',
      //   valueSuffix: 'cm',
      //   borderWidth: 3,
      //   borderRaduis: 6,
      //   shared: true
      // },

      series: []
    });
    this.getAllBatches();
  }

  getAllBatches() {
    let yAxiPosition = 0; //Sets the Y-axis
    let name = [];
    this.batchService.getAll().subscribe(batchData => {
      this.batches = batchData;
      for (const entry of this.batches) {
        // this.trainerService.getById(entry.trainer).subscribe(trainerData => {
        //   this.trainer = trainerData;
        //   for (const entry of this.trainers) {
        //     this.trainer.firstName = entry.firstName;
        //   }

        //   console.log(this.trainer.firstName);
        //})
        //this.getTrainerName(entry.trainer);
        this.chart.addSeries(
          {
            name: entry.name /*this.getTrainerName(entry.trainer)*/,
            borderColor: 'gray',
            pointWidth: 20,
            data: [{
              x: entry.startDate,
              x2: entry.endDate,
              y: yAxiPosition,
            }]
          });
        // name[yAxiPosition] = entry.trainer;
        yAxiPosition++;
      }
    });
    // console.log(name);
  }

  // getAllConcludedBatches() {
  //   this.batchService.getAll().subscribe(batchData => {
  //     this.batches = batchData;
  //     for (const entry of this.batches) {
  //       if (entry.endDate < new Date()) {
  //         this.chart.addSeries(
  //           {
  //             name: entry.name,
  //             borderColor: 'gray',
  //             pointWidth: 20,
  //             data: [{
  //               x: entry.startDate,
  //               x2: entry.endDate,
  //               y: 0,
  //             }]
  //           });
  //       }
  //       else { }
  //     }
  //   });
  // }

  // getAllBatchesWithTrainers() {
  //   this.batchService.getAll().subscribe(batchData => {
  //     this.batches = batchData;
  //     for (const entry of this.batches) {
  //       if (entry.trainer) {
  //         this.chart.addSeries(
  //           {
  //             name: entry.name,
  //             borderColor: 'gray',
  //             pointWidth: 20,
  //             data: [{
  //               x: entry.startDate,
  //               x2: entry.endDate,
  //               y: 0,
  //             }]
  //           });
  //       }
  //     }
  //   });
  // }

  //This method gets a trainers name
  getTrainerName(id: string) {
    this.trainerService.getById(id).subscribe(trainerData => {
      this.trainer = trainerData;
      return this.trainer.firstName;
    });

  }

  // Concluded batches checkbox
  hide() {
    this.isConcluded = !this.isConcluded;
    console.log(this.isConcluded);
    while (this.chart.series.length > 0) {
      this.chart.series[0].remove(true);
    }
    if (this.isConcluded) {
      console.log(this.batches);
      this.filteredBatches = this.batches.filter(
        batch => batch.endDate > new Date()
      );
      let yAxiPosition = 0;
      for (const entry of this.filteredBatches) {
        this.chart.addSeries(
          {
            name: entry.name /*this.getTrainerName(entry.trainer)*/,
            borderColor: 'gray',
            pointWidth: 20,
            data: [{
              x: entry.startDate,
              x2: entry.endDate,
              y: yAxiPosition,
            }]
          });
        // name[yAxiPosition] = entry.trainer;
        yAxiPosition++;
      }
    } else {
      while (this.chart.series.length > 0) {
        this.chart.series[0].remove(true);
      }
      let yAxiPosition = 0;
      for (const entry of this.filteredBatches) {
        this.chart.addSeries(
          {
            name: entry.name /*this.getTrainerName(entry.trainer)*/,
            borderColor: 'gray',
            pointWidth: 20,
            data: [{
              x: entry.startDate,
              x2: entry.endDate,
              y: yAxiPosition,
            }]
          });
        // name[yAxiPosition] = entry.trainer;
        yAxiPosition++;
      }
    }
  }

}



