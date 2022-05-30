import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/shared/interfaces';
import { OrdersService } from 'src/app/shared/transport/orders.service';

const STEP = 100

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit, OnDestroy {

  limit = STEP
  offset = 0
  shop: string

  now: Date
  oSub: Subscription
  orders: Order[]
  loading = false
  noMore = false
  filter: any = {
    'fields_user': 1,
    'fields_number': 1,
    'filter_number': true,
    'fields_send': 1,
    'fields_comment': 1,
    'fields_payment': 1,
    'fields_status': 1,
  }

  colorStatuses = {
    "в корзине":  'primary',
    "в работе": 'danger', 
    "выполнен": 'warning',
    "доставлен": 'success', 
    "отменен": 'secondary'
  }

  constructor(private ordersService: OrdersService,
    private datePipe: DatePipe,
    private router: Router) { }

  ngOnInit(): void {
    this.loading = true

    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = orders
      this.orders.forEach(item => {
        item.dateStr = `${this.datePipe.transform(item.send, 'dd.MM.yyyy')} | ${item.payment.total} ₽ | ${item.payment.status}  | ${item.status}`
        item.image = item.user.photo
        item.description = item.comment
        item.name = item.user.email
        item.statusColor = this.colorStatuses[item.status]
      })
      this.noMore = orders.length < this.limit
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
    this.router.navigate(['orders', id])
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }

}