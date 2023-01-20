
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Shop } from 'src/app/shared/interfaces';
import { ShopsService } from 'src/app/shared/transport/shops.service';

@Component({
  selector: 'app-shops-list',
  templateUrl: './shops-list.component.html',
  styleUrls: ['./shops-list.component.css']
})
export class ShopsListComponent implements OnInit, OnDestroy {

  oSub: Subscription
  shops: Shop[]
  shopForm = false
  currentShop = null
  shopID: string
  private subscription: Subscription;
  filter: any = {
    'fields_name': 1
  }

  constructor(private shopsService: ShopsService, 
    private activateRoute: ActivatedRoute,
    private router: Router) {
      // this.shopID = this.activateRoute.snapshot.params['shop'];
      // this.subscription = activateRoute.params.subscribe(params => {
      //   console.log(params)
      //   this.shopID = params['shop']
      // });
   }

  ngOnInit(): void {
    this.oSub = this.shopsService.fetch(this.filter).subscribe(shops => {
      this.shops = shops
    })
  }

  openForm(shop) {
    this.router.navigate(['shop', shop])
  }

  closeForm(shop) {
    if (shop) {
      if (this.currentShop) {
        const index = this.shops.indexOf(this.shops.find(t => t._id == this.currentShop._id))
        this.shops[index] = shop
      } else {
        this.shops.push(shop)
        this.shops.sort((a, b) => +(a.name > b.name))
      }
    }
    this.currentShop = null
    this.shopForm = false
  }

  openShop(id) {
    this.router.navigate(['products', id])
  }

  ngOnDestroy(): void {
    this.oSub.unsubscribe()
    if (this.subscription) this.oSub.unsubscribe()
  }

}
