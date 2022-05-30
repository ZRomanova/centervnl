import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Report } from 'src/app/shared/interfaces';
import { GeneralService } from 'src/app/shared/transport/general.service';
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
  cSub: Subscription
  form: FormGroup
  htModal = false

  constructor(private datePipe: DatePipe,
    private generalService: GeneralService, 
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
      this.generalService.fetch("REPORTS").subscribe(data => {
        this.form = new FormGroup({
          text: new FormControl(data.text)
        })
        this.loading = false
      })
      
    })
  }

  openHtModal() {
    this.htModal = true
  }
  closeHtModal(event) {
    this.htModal = false
  }

  edit(id) {
    this.router.navigate(['reports', id])
  }

  onSubmit() {
    this.form.disable()
    this.cSub = this.generalService.update("REPORTS", this.form.value).subscribe(value => {
      this.form.patchValue(value)
    })
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.cSub) this.cSub.unsubscribe()
  }

}
