import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopsService } from 'src/app/shared/transport/shops.service';
import { Shop } from '../../shared/interfaces'


@Component({
  selector: 'app-shop-page',
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.css']
})
export class ShopPageComponent implements OnInit {

  shop: any = null
  // @Output() close = new EventEmitter<Shop | null>()
  id: string
  form: FormGroup
  loading = 1

  constructor(private shopsService: ShopsService,
    private router: Router,
    private activateRoute: ActivatedRoute) { 
    this.id = this.activateRoute.snapshot.params['id'];
  }

  ngOnInit(): void {

    if (this.id === 'new') this.id = null
      if (this.id) {
        this.shopsService.fetchById(this.id).subscribe(item => {
          this.shop = item
          this.data()
          this.loading --
        })
      } else {
        this.form = new FormGroup({
          name: new FormControl('', Validators.required),
          path: new FormControl(''), 
          icon: new FormControl(''), 
          visible: new FormControl(true), 
          description: new FormControl(''),
          groups: new FormArray([]),
        })
        this.loading --
      }

  }

  data() {
    this.form = new FormGroup({
      name: new FormControl(this.shop.name, Validators.required),
      path: new FormControl(this.shop.path),
      icon: new FormControl(this.shop.icon), 
      visible: new FormControl(this.shop.visible), 
      groups: new FormArray(this.shop.groups.map(item => this.createGroup(item))),
      description: new FormControl(this.shop.description)
    })
  }

  createGroup(item: any = {}) {
    return new FormGroup({
      _id: new FormControl(item._id ? item._id : null),
      name: new FormControl(item.name, Validators.required),
      description: new FormControl(item.description),
      visible: new FormControl(item.visible),
      image: new FormControl(item.image),
      path: new FormControl(item.path),
    })
  }

  addGroup() {
    const gallery = this.form.get('groups') as FormArray
      gallery.push(this.createGroup())
  }

  deleteGroupByIndex(i) {
    const array = this.form.get('groups') as FormArray
    array.removeAt(i)
  }

  back() {
    this.router.navigate(['products'])
  }

  onSubmit() {

    let sub
    if (!this.shop) {
      sub = this.shopsService.create(this.form.value)
    } else {
      sub = this.shopsService.update(this.shop._id, this.form.value)
    }
    sub.subscribe(shop => {
      this.shop = shop
      this.data()
    })
  } 
  

}
