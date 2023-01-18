import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Report } from 'src/app/shared/interfaces';
import { ReportsService } from 'src/app/shared/transport/reports.service';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  loading = 1
  id: string
  report: Report
  oSub: Subscription
  chapters: string[]
  annualFile: File = null
  financeFile: File = null
  justiceFile: File = null

  constructor(private router: Router, 
    private activateRoute: ActivatedRoute,
    private reportsService: ReportsService) { 
      this.id = this.activateRoute.snapshot.params['id']
    }

  ngOnInit(): void {
    if (this.id == 'new') this.id = null
    if (this.id) {
      this.reportsService.fetchById(this.id).subscribe(report => {
        this.report = report
        this.data()
        this.loading --
      })
    } else {
      this.report = {
        finance: null,
        justice: null,
        annual: null,
        year: new Date().getFullYear(),
        visible: true
      }
      this.data()
      this.loading --
    }

  }

  data() {
    this.form = new FormGroup({
      finance: new FormControl(this.report.finance),
      justice: new FormControl(this.report.justice),
      annual: new FormControl(this.report.annual),
      year: new FormControl(this.report.year, Validators.required),
      visible: new FormControl(this.report.visible)
    })
  }

  onAnnualUpload(event: any) {
    const file = event.target.files[0]
    this.annualFile = file
  }
  onJusticeUpload(event: any) {
    const file = event.target.files[0]
    this.justiceFile = file
  }
  onFinanceUpload(event: any) {
    const file = event.target.files[0]
    this.financeFile = file
  }

  back() {
    this.router.navigate(['reports'])
  }

  onSubmit() {
    const data = {...this.form.value}
    if (this.id) {
      this.oSub = this.reportsService.update(this.id, data).subscribe(result => {
        this.report = result
        this.id = this.report._id
        this.data()
        if (this.annualFile || this.justiceFile || this.financeFile) this.onFilesUpload()
      })
    } else {
      this.oSub = this.reportsService.create(data).subscribe(result => {
        this.report = result
        this.id = this.report._id
        this.router.navigate(['reports', result._id])
        if (this.annualFile || this.justiceFile || this.financeFile) this.onFilesUpload()
      })
    }
  }

  onFilesUpload() {
    this.reportsService.upload(this.id, this.annualFile, this.justiceFile, this.financeFile).subscribe(result => {
      this.report = result
      this.annualFile = null
      this.justiceFile = null
      this.financeFile = null
      this.data()
    }, error => console.log(error))
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }
}
