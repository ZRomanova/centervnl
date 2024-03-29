import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/interfaces';
import { UsersService } from 'src/app/shared/transport/users.service';

const STEP = 100

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {

  limit = STEP
  offset = 0
  shop: string

  now: Date
  oSub: Subscription
  users: User[]
  loading = false
  noMore = false
  filter: any = {}

  constructor(private usersService: UsersService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loading = true

    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.usersService.fetch(params).subscribe(users => {
      this.users = users
      this.users.forEach(user => {
        user.dateStr = `${user.created ? this.datePipe.transform(user.created, 'dd.MM.yyyy') : '-'}`
      })
      this.noMore = users.length < this.limit
      this.loading = false
    })
  }

  loadMore(toEnd: boolean) {
    if (toEnd) this.offset += this.limit
    else this.offset -= this.limit
    this.loading = true
    this.fetch()
  }

  edit(id) {
    this.router.navigate(['users', id])
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }

}
