import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Checkout } from 'src/app/shared/interfaces';
import { CheckoutsService } from 'src/app/shared/transport/checkouts.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  loading = 1
  id: string
  checkout: Checkout
  oSub: Subscription
  statuses = ['заявка', 'отмена', 'участник', 'неявка', 'ведущий']
  methods = ['на месте', 'онлайн']

  constructor(private router: Router, 
    private activateRoute: ActivatedRoute,
    private checkoutsService: CheckoutsService) { 
      this.id = this.activateRoute.snapshot.params['id']
    }

  ngOnInit(): void {
    if (this.id) {
      this.checkoutsService.fetchById(this.id).subscribe(checkout => {
        this.checkout = checkout
        this.data()
        this.loading--
      })
    } else this.back()
  }

  data() {
    this.form = new FormGroup({
      status: new FormControl(this.checkout.status),
      info: new FormControl(this.checkout.info),
      // payment: new FormGroup({
      //   paid: new FormControl(this.checkout.payment.paid),
      //   price: new FormControl(this.checkout.payment.price),
      //   method: new FormControl(this.checkout.payment.method),
      //   status: new FormControl(this.checkout.payment.status),
      //   description: new FormControl(this.checkout.payment.description),
      // })
    })
  }

  back() {
    if (this.checkout && this.checkout.service && this.checkout.service._id)
      this.router.navigate(['services', 'checkouts', this.checkout.service._id])
    else
      this.router.navigate(['services'])
  }

  onSubmit() {
    const data = {...this.form.value}
    this.oSub = this.checkoutsService.update(this.id, data).subscribe(result => {
      this.checkout = {...this.checkout, status: result.status, payment: result.payment}
    })
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }
}
