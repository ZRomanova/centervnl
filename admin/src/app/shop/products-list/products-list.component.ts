import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/interfaces';
import { ProductsService } from 'src/app/shared/transport/products.service';
import { ShopsService } from 'src/app/shared/transport/shops.service';


@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})

export class ProductsListComponent implements OnInit, OnDestroy {

  shop: string
  groups: any[] = []
  group: any
  now: Date
  oSub: Subscription
  private subscription: Subscription;
  products: Product[] = []
  loading = false
  filter: any = {
    'fields_groups.$': 1,
  }

  constructor(private productsService: ProductsService,
    private shopsService: ShopsService,
    private router: Router,
    private activateRoute: ActivatedRoute) { 
      this.shop = this.activateRoute.snapshot.params['shop'];
      this.subscription = activateRoute.params.subscribe(params => {
        this.shop = params['shop']
        this.fetchShop()
      });
    }

  ngOnInit(): void {
    this.fetchShop()
  }

  fetchShop() {
    this.loading = true
    this.shopsService.fetchById(this.shop).subscribe((shop: any) => {
      this.groups = shop.groups
      if (this.groups.length) {
        this.group = this.groups[0]
        this.fetch()
      } else {
        this.products = []
        this.loading = false
      }
    })
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      filter__id: this.shop,
      "filter_groups._id": this.group._id
    })

    this.oSub = this.productsService.fetch(params).subscribe(services => {
      this.products = services
      this.products.forEach(product => {
        product.dateStr = `${product.price} ₽`
        product.description = product.description ? (product.group + ' | ' + product.description) : product.group
      })
      this.loading = false
    })
  }

  create(event) {
    const params = {
      group_id: this.group._id,
      visible: false,
      price: 1
    }
    this.productsService.create(params).subscribe(product => {
      this.router.navigate(['product', product._id])
    })
  }

  edit(id) {
    this.router.navigate(['product', id])
  }

  loadNewGroup() {
    this.loading = true
    this.fetch()
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.subscription) this.subscription.unsubscribe()
  }

}
