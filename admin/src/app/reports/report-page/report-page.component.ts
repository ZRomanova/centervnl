import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Report, ReportChapter, ReportSection } from 'src/app/shared/interfaces';
import { ReportsService } from 'src/app/shared/transport/reports.service';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  loading = 2
  id: string
  report: Report
  oSub: Subscription
  cSub: Subscription
  htModal = false
  chapters: string[]

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
        title: '',
        content: '',
        year: new Date().getFullYear(),
        chapters: [],
        visible: true
      }
      this.data()
      this.loading --
    }
    this.cSub = this.reportsService.fetchChapters().subscribe(chapters => {
      this.chapters = chapters
      this.loading --
    })
  }

  data() {
    this.form = new FormGroup({
      title: new FormControl(this.report.title, Validators.required),
      content: new FormControl(this.report.content, Validators.required),
      year: new FormControl(this.report.year, Validators.required),
      visible: new FormControl(this.report.visible),
      chapters: new FormArray(this.report.chapters.map(chapter => this.createChapterFormGroup(chapter)))
    })
  }

  createChapterFormGroup(item: ReportChapter) {
    return new FormGroup({
      title: new FormControl(item.title, Validators.required),
      link: new FormControl(item.link),
      content: new FormControl(item.content, Validators.required),
      sections: new FormArray(item.sections.map(section => this.createSectionFormGroup(section)))
    })
  }

  createSectionFormGroup(item: ReportSection) {
    return new FormGroup({
      title: new FormControl(item.title, Validators.required),
      link: new FormControl(item.link),
      content: new FormControl(item.content, Validators.required)
    })
  }

  back() {
    this.router.navigate(['reports'])
  }

  openHtModal() {
    this.htModal = true
  }
  closeHtModal(event) {
    this.htModal = false
  }

  plusChapter() {
    const chapter: ReportChapter = {
      title: '',
      content: '',
      sections: []
    }
    const chapters = this.form.get('chapters') as FormArray
    chapters.push(this.createChapterFormGroup(chapter))
  }

  deleteChapter(i) {
    const chapters = this.form.get('chapters') as FormArray
    chapters.removeAt(i)
  }

  plusSection(j) {
    const section: ReportSection = {
      title: '',
      content: '',
    }
    const chapters = this.form.get('chapters') as FormArray
    const sections = chapters.controls[j].get('sections') as FormArray
    sections.push(this.createSectionFormGroup(section))
  } 

  deleteSection(j, i) {
    const chapters = this.form.get('chapters') as FormArray
    const sections = chapters.controls[j].get('sections') as FormArray
    sections.removeAt(i)
  }

  onSubmit() {
    const data = {...this.form.value}
    if (this.id) {
      this.oSub = this.reportsService.update(this.id, data).subscribe(result => {
        this.report = result
        this.id = this.report._id
        this.data()
      })
    } else {
      this.oSub = this.reportsService.create(data).subscribe(result => {
        this.report = result
        this.id = this.report._id
        this.router.navigate(['reports', result._id])
      })
    }
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.cSub) this.cSub.unsubscribe()
  }
}
