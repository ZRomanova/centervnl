import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Report, Doc } from 'src/app/shared/interfaces';
import { DocsService } from 'src/app/shared/transport/documents.service';
import { GeneralService } from 'src/app/shared/transport/general.service';
import { ReportsService } from 'src/app/shared/transport/reports.service';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css']
})
export class ReportsListComponent implements OnInit, OnDestroy {

  reports: Report[]
  loading = 3
  oSub: Subscription
  cSub: Subscription
  form: FormGroup
  htModal = false
  docs: Doc[]
  docsSort: any[] = []
  activeDocsPage = 0

  constructor(private datePipe: DatePipe,
    private generalService: GeneralService,
    private docsService: DocsService,  
    private reportsService: ReportsService,
    private router: Router) { }

  ngOnInit(): void {

    this.oSub = this.reportsService.fetch({}).subscribe(reports => {
      this.reports = reports
      this.reports.forEach(report => {
        report.dateStr = this.datePipe.transform(report.created, 'dd.MM.yyyy HH:mm')
      })
      this.loading--
    })

    this.generalService.fetch("REPORTS").subscribe(data => {
      this.form = new FormGroup({
        text: new FormControl(data.text)
      })
      this.loading--
    })
    this.docsService.fetch().subscribe(docs => {
      this.docs = docs
      this.docsSort = this.makeArray(this.docs)
      this.loading--
    })
  }

  makeArray(arrFrom) {
    const chunkArray = (arr, cnt) => arr.reduce((prev, cur, i, a) => !(i % cnt) ? prev.concat([a.slice(i, i + cnt)]) : prev, []);
    return chunkArray(arrFrom, 3)
  }

  openDocForm(id) {
    this.router.navigate(['documents', id])
  }

  backDocs() {
    if (this.activeDocsPage == 0) this.activeDocsPage = this.docsSort.length - 1
    else this.activeDocsPage --
  }

  nextDocs() {
    if (this.activeDocsPage == this.docsSort.length - 1) this.activeDocsPage = 0
    else this.activeDocsPage ++
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
