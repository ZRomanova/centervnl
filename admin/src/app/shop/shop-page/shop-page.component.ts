import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopsService } from 'src/app/shared/transport/shops.service';
import { Shop } from '../../shared/interfaces'


@Component({
  selector: 'app-shop-page',
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.css']
})
export class ShopPageComponent implements OnInit {

  @Input() shop: Shop = null
  @Output() close = new EventEmitter<Shop | null>()

  form: FormGroup

  constructor(private shopsService: ShopsService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      path: new FormControl('')
    })
    if (this.shop) {
      this.form.patchValue({
        name: this.shop.name,
        path: this.shop.path
      })
    }
  }

  finish(result: boolean) {
    if (result) {
      let sub
      if (!this.shop) {
        sub = this.shopsService.create(this.form.value)
      } else {
        sub = this.shopsService.update(this.shop._id, this.form.value)
      }
      sub.subscribe(shop => {
        this.close.emit(shop)
      }, error => this.close.emit(null))
    } else {
      this.close.emit(null)
    }
  }

}
