import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from 'src/app/shared/transport/service.service';
import { CheckoutsService } from 'src/app/shared/transport/checkouts.service';
import { Checkout, Service } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';

const STEP = 100

@Component({
  selector: 'app-checkout-list',
  templateUrl: './checkout-list.component.html',
  styleUrls: ['./checkout-list.component.css']
})
export class CheckoutListComponent implements OnInit, OnDestroy {

  limit = STEP
  offset = 0

  id: string
  checkouts: Checkout[] = []
  date: Date
  dates: Date[]
  oSub: Subscription
  dSub: Subscription
  sSub: Subscription
  ready = 3
  service: Service

  filter: any = {}
  loading = false
  noMore = false

  colorStatuses = {
    "ведущий":  'primary',
    "неявка": 'danger', 
    "заявка": 'warning',
    "участник": 'success', 
    "отмена": 'secondary'
  }

  constructor(private servicesService: ServiceService,
    private checkoutsService: CheckoutsService,
    private activateRoute: ActivatedRoute,
    private router: Router) { 
      this.id = this.activateRoute.snapshot.params['id'];
    }

  ngOnInit(): void {
    this.sSub =  this.servicesService.fetchById(this.id).subscribe(service => {
      this.service = service
      this.ready--
    })
    this.dSub = this.checkoutsService.fetchDates(this.id).subscribe(dates => {
      this.dates = dates
      this.ready--
      if (this.dates && this.dates.length) { 
        this.date = this.dates[0]
        this.ready--
        this.fetch()
      } else this.ready--
    })
  }

  fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })
    this.oSub = this.checkoutsService.fetch(this.id, this.date, params).subscribe(checkouts => {
      this.checkouts = checkouts
      this.checkouts.forEach((item: any) => {
        item.statusColor = this.colorStatuses[item.status]
      })
      this.noMore = this.checkouts.length < this.limit
      this.loading = false
    })
  }

  loadMore(toEnd: boolean) {
    if (toEnd) this.offset += this.limit
    else this.offset -= this.limit
    this.loading = true
    this.fetch()
  }

  newDate(date) {
    this.date = date
    this.offset = 0
    this.fetch()
  }

  edit(id) {
    this.router.navigate(['services', 'checkout', id])
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.dSub) this.dSub.unsubscribe()
    if (this.sSub) this.sSub.unsubscribe()
  }

}
