import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from 'src/app/shared/transport/service.service';
import { CheckoutsService } from 'src/app/shared/transport/checkouts.service';
import { Checkout, Service } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';
// import * as FileSaver from 'file-saver';
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
    "ведущий": 'primary',
    "неявка": 'danger',
    "заявка": 'warning',
    "участник": 'success',
    "отмена": 'secondary'
  }

  constructor(private servicesService: ServiceService,
    private checkoutsService: CheckoutsService,
    private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router) {
    this.id = this.activateRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.sSub = this.servicesService.fetchById(this.id).subscribe(service => {
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
      // offset: this.offset,
      // limit: this.limit
    })
    this.oSub = this.checkoutsService.fetch(this.id, this.date, params).subscribe((checkouts: Checkout[]) => {
      this.checkouts = checkouts
      this.checkouts.forEach((item: any) => {
        item.statusColor = this.colorStatuses[item.status]
      })
      this.noMore = this.checkouts.length < this.limit
      this.loading = false
    })
  }

  loadXLSX() {
    const params = {
      // offset: this.offset,
      // limit: this.limit
      format: 'xlsx'
    }
    this.oSub = this.checkoutsService.get_excel(this.id, this.date, params).subscribe({
      next: (data: Blob) => {
        // console.log(data)
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.download = `${this.service.name} (${this.datePipe.transform(this.date, "dd_MM_yyyy HH_mm", "UTC +3")}).xlsx`;
        link.click();
        // FileSaver.saveAs(data, `filename.xlsx`)
      }
    })
  }

  loadMore(toEnd: boolean) {
    if (toEnd) this.offset += this.limit
    else this.offset -= this.limit
    this.loading = true
    this.fetch()
  }

  newDate() {
    // this.date = date
    this.offset = 0
    this.fetch()
  }

  edit(id) {
    this.router.navigate(['services', 'checkout', id])
  }

  check(user) {
    this.oSub = this.checkoutsService.update(user._id, { status: 'участник' }).subscribe(result => {
      user.status = 'участник'
      user.statusColor = this.colorStatuses[user.status]
    })
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.dSub) this.dSub.unsubscribe()
    if (this.sSub) this.sSub.unsubscribe()
  }

}
