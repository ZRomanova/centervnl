import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/shared/interfaces';
import { OrdersService } from 'src/app/shared/transport/orders.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit {

  form: FormGroup
  loading = 1
  id: string
  order: Order
  oSub: Subscription
  statuses = ['в работе', 'выполнен', 'доставлен', 'отменен']
  methods = ['на месте', 'онлайн']

  constructor(private router: Router, 
    private activateRoute: ActivatedRoute,
    private ordersService: OrdersService,) { 
      this.id = this.activateRoute.snapshot.params['id']
    }

  ngOnInit(): void {
    if (this.id) {
      this.ordersService.fetchById(this.id).subscribe(order => {
        this.order = order
        this.data()
        this.loading --
      })
    } else this.router.navigate(['products'])
  }

  data() {
    this.form = new FormGroup({
      status: new FormControl(this.order.status),
      payment: new FormGroup({
        paid: new FormControl(this.order.payment.paid),
        delivery: new FormControl(this.order.payment.delivery),
        total: new FormControl(this.order.payment.total),
        price: new FormControl(this.order.payment.price),
        method: new FormControl(this.order.payment.method),
        status: new FormControl(this.order.payment.status),
      })
    })
  }

  back() {
    this.router.navigate(['products'])
  }

  onSubmit() {
    const data = {...this.form.value}
    this.oSub = this.ordersService.update(this.id, data).subscribe(result => {
      this.order = result
    })
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }
}
