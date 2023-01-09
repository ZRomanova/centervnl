import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/shared/interfaces';
import { ProjectService } from 'src/app/shared/transport/project.service';

const STEP = 100

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit, OnDestroy {

  limit = STEP
  offset = 0

  oSub: Subscription
  projects: Project[]
  loading = false
  noMore = false
  filter: any = {
    'fields_period': 1,
    'fields_name': 1,
    'fields_description': 1,
    'fields_visible': 1,
    'fields_image': 1,
  }

  constructor(private router: Router,
    private projectsService: ProjectService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loading = true

    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.projectsService.fetch(params).subscribe(projects => {
      this.projects = projects
      this.projects.forEach(project => {
        project.dateStr = `${project.period.end ? '' : 'c '}${this.datePipe.transform(project.period.start, 'dd.MM.yyyy')} ${project.period.end ? '- ' + this.datePipe.transform(project.period.end, 'dd.MM.yyyy') : ''}`
      })
      this.noMore = projects.length < this.limit
      this.loading = false
    })
  }

  loadMore(toEnd: boolean) {
    if (toEnd) this.offset += this.limit
    else this.offset -= this.limit
    this.loading = true
    this.fetch()
  }

  createProject(event) {
    this.router.navigate(['programs', 'projects', 'new'])
  }

  editProject(id) {
    this.router.navigate(['programs', 'projects', id])
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }
}
