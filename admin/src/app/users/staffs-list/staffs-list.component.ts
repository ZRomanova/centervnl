import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Staff } from 'src/app/shared/interfaces';
import { GeneralService } from 'src/app/shared/transport/general.service';
import { TeamService } from 'src/app/shared/transport/team.service';

const STEP = 100

@Component({
  selector: 'app-staffs-list',
  templateUrl: './staffs-list.component.html',
  styleUrls: ['./staffs-list.component.css']
})
export class StaffsListComponent implements OnInit, OnDestroy {

  limit = STEP
  offset = 0
  shop: string
  form: FormGroup
  now: Date
  oSub: Subscription
  users: Staff[]
  loading = 2
  noMore = false
  filter: any = {}

  constructor(private teamService: TeamService, private generalService: GeneralService, private router: Router,) { }

  ngOnInit(): void {
    this.generalService.fetch("TEAM").subscribe(data => {
      this.form = new FormGroup({
        text: new FormControl(data ? data.text : null)
      })
      this.loading--
    })
    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.teamService.fetch(params).subscribe(users => {
      this.users = users
      this.users.forEach(user => {
        user.dateStr = `${user.position}`
        user.name = `${user.surname} ${user.name}`
      })
      this.noMore = users.length < this.limit
      this.loading--
    })
  }

  loadMore(toEnd: boolean) {
    if (toEnd) this.offset += this.limit
    else this.offset -= this.limit
    this.loading++
    this.fetch()
  }

  edit(id) {
    this.router.navigate(['users', 'team', id])
  }

  onSubmit() {
    this.form.disable()
    this.generalService.update("TEAM", this.form.value).subscribe(value => {
      this.form.enable()
    })
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }

}
