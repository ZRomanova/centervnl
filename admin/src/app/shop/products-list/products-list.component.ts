import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/interfaces';
import { ProductsService } from 'src/app/shared/transport/products.service';

const STEP = 100

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})

export class ProductsListComponent implements OnInit, OnDestroy {

  limit = STEP
  offset = 0
  shop: string

  now: Date
  oSub: Subscription
  private subscription: Subscription;
  products: Product[]
  loading = false
  noMore = false
  filter: any = {
    'fields_group': 1,
    'fields_name': 1,
    'fields_description': 1,
    'fields_visible': 1,
    'fields_image': 1,
    'fields_price': 1,
  }

  constructor(private productsService: ProductsService,
    private router: Router,
    private activateRoute: ActivatedRoute) { 
      this.shop = this.activateRoute.snapshot.params['shop'];
      this.subscription = activateRoute.params.subscribe(params => {
        this.shop = params['shop']
        this.offset = 0
        this.fetch()
      });
    }

  ngOnInit(): void {
    this.loading = true

    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      filter_shop: this.shop,
      limit: this.limit
    })

    this.oSub = this.productsService.fetch(params).subscribe(services => {
      this.products = services
      this.products.forEach(product => {
        product.dateStr = `${product.price} ₽`
        product.description = product.description ? (product.group + ' | ' + product.description) : product.group
      })
      this.noMore = services.length < this.limit
      this.loading = false
    })
  }

  create(event) {
    this.router.navigate(['products', this.shop, 'new'])
  }

  edit(id) {
    this.router.navigate(['products',this.shop, id])
  }

  loadMore(toEnd: boolean) {
    if (toEnd) this.offset += this.limit
    else this.offset -= this.limit
    this.loading = true
    this.fetch()
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.subscription) this.oSub.unsubscribe()
  }

}
