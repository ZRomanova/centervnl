import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Program } from 'src/app/shared/interfaces';
import { ProgramService } from 'src/app/shared/transport/program.service';

const STEP = 100

@Component({
  selector: 'app-programs-list',
  templateUrl: './programs-list.component.html',
  styleUrls: ['./programs-list.component.css']
})
export class ProgramsListComponent implements OnInit {

  limit = STEP
  offset = 0

  oSub: Subscription
  projects: Program[]
  loading = false
  noMore = false
  filter: any = {
    'fields_name': 1,
    'fields_subtitle': 1,
    'fields_visible': 1,
    'fields_image': 1,
  }

  constructor(private router: Router,
    private programsService: ProgramService) { }

  ngOnInit(): void {
    this.loading = true

    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.programsService.fetch(params).subscribe(projects => {
      this.projects = projects
      this.projects.forEach((project: any) => {
        project.dateStr = project.subtitle
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
    this.router.navigate(['programs', 'new'])
  }

  editProject(id) {
    this.router.navigate(['programs', id])
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }
}
