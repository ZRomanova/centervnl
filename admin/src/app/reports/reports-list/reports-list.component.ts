import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Report } from 'src/app/shared/interfaces';
import { ReportsService } from 'src/app/shared/transport/reports.service';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css']
})
export class ReportsListComponent implements OnInit, OnDestroy {

  reports: Report[]
  loading = false
  oSub: Subscription

  constructor(private datePipe: DatePipe,
    private reportsService: ReportsService,
    private router: Router) { }

  ngOnInit(): void {
    this.loading = true

    this.oSub = this.reportsService.fetch({}).subscribe(reports => {
      this.reports = reports
      this.reports.forEach(report => {
        report.dateStr = this.datePipe.transform(report.created, 'dd.MM.yyyy HH:mm')
        // let description = ''
        // report.chapters.forEach((chapter, index) => {
        //   if (index > 0) description += ', '
        //   description += chapter.title
        // })
        // report.description = description
      })
      this.loading = false
    })
  }

  edit(id) {
    this.router.navigate(['reports', id])
  }

  ngOnDestroy(): void {
    this.oSub.unsubscribe()
  }

}
