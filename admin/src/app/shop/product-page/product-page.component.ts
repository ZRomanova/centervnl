import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PriceList, Product, ProductVariant, Shop } from 'src/app/shared/interfaces';
import { ProductsService } from 'src/app/shared/transport/products.service';
import { ShopsService } from 'src/app/shared/transport/shops.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  loading = 3
  id: string
  product: Product
  oSub: Subscription
  sSub: Subscription
  iSub: Subscription
  gSub: Subscription
  image: File
  imagePreview: string
  gallery: File[] = []
  galleryPreview: string[] = []
  htModal = false
  shop: string
  shops: Shop[]
  groups: string[]

  constructor(private router: Router, 
    private activateRoute: ActivatedRoute,
    private shopsService: ShopsService,
    private productsService: ProductsService,) { 
      this.id = this.activateRoute.snapshot.params['id']
      this.shop = this.activateRoute.snapshot.params['shop'];
    }

  ngOnInit(): void {
    if (this.id == 'new') this.id = null
    if (this.id) {
      this.productsService.fetchById(this.id).subscribe(product => {
        this.product = product
        this.imagePreview = this.product.image
        this.data()
        this.loading --
      })
    } else {
      this.form = new FormGroup({
        name: new FormControl('', Validators.required),
        path: new FormControl(''),
        price: new FormControl('', Validators.required),
        visible: new FormControl(true),
        image: new FormControl(''),
        group: new FormControl(''),
        gallery: new FormArray([]),
        description: new FormControl(''),
        shop: new FormControl(this.shop, Validators.required),
        options: new FormArray([])
      })
      this.loading --
    }
    this.sSub = this.shopsService.fetch().subscribe(shops => {
      this.shops = shops
      this.loading --
    })
    this.sSub = this.shopsService.fetchGroups(this.shop).subscribe(groups => {
      this.groups = groups
      console.log(groups)
      this.loading --
    })
  }

  data() {
    this.form = new FormGroup({
      name: new FormControl(this.product.name, Validators.required),
      path: new FormControl(this.product.path),
      price: new FormControl(this.product.price, Validators.required),
      visible: new FormControl(this.product.visible),
      image: new FormControl(this.product.image),
      group: new FormControl(this.product.group),
      shop: new FormControl(typeof this.product.shop == 'object' ? this.product.shop._id : this.product.shop, Validators.required),
      gallery: new FormArray(this.product.gallery ? this.product.gallery.map(el => new FormControl(el)) : []),
      description: new FormControl(this.product.description),
      options: new FormArray(this.product.options ? this.product.options.map(opt => this.createOptionFormGroup(opt)) : []),
    })
  }

  createOptionFormGroup(item: ProductVariant) {
    return new FormGroup({
      name: new FormControl(item.name, Validators.required),
      variants: new FormArray(item.variants.map(variant => this.createVariantFormGroup(variant))),
    })
  }

  createVariantFormGroup(item: PriceList) {
    return new FormGroup({
      name: new FormControl(item.name, Validators.required),
      price: new FormControl(item.price, Validators.required),
    })
  }

  back() {
    this.router.navigate(['products', this.shop])
  }

  openHtModal() {
    this.htModal = true
  }
  closeHtModal(event) {
    this.htModal = false
  }

  plusToGallery() {
    const gallery = this.form.get('gallery') as FormArray
    gallery.push(new FormControl(''))
  }

  deleteURLByIndex(i) {
    const gallery = this.form.get('gallery') as FormArray
    gallery.removeAt(i)
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result.toString()
    }
    reader.readAsDataURL(file)
  }

  onGalleryUpload(event: any) {
    const files = event.target.files
    this.gallery = [...this.gallery, ...files]
    for (const file of files) {
      const reader = new FileReader()
      reader.onload = () => {
        this.galleryPreview = [...this.galleryPreview, reader.result.toString()]
      }
      reader.readAsDataURL(file)
    }
  }

  plusOption() {
    const option: ProductVariant = {
      name: '',
      variants: [{name: '', price: 1}]
    }
    const options = this.form.get('options') as FormArray
    options.push(this.createOptionFormGroup(option))
  }

  deleteOption(i) {
    const options = this.form.get('options') as FormArray
    options.removeAt(i)
  }

  plusVariant(j) {
    const variant: PriceList = {
      name: '',
      price: 1
    }
    const options = this.form.get('options') as FormArray
    const variants = options.controls[j].get('variants') as FormArray
    variants.push(this.createVariantFormGroup(variant))
  } 

  deleteVariant(j, i) {
    const options = this.form.get('options') as FormArray
    const variants = options.controls[j].get('variants') as FormArray
    variants.removeAt(i)
  }

  photoURL() {
    if (this.form.value.image) this.imagePreview = this.form.value.image
  }

  deletePhotoByIndex(i: number) {
    this.galleryPreview.splice(i, 1)
    this.gallery.splice(i, 1)
  }

  onSubmit() {
    const data = {...this.form.value}
    if (this.id) {
      this.oSub = this.productsService.update(this.id, data).subscribe(result1 => {
        if (this.image || this.gallery.length) {
          this.iSub = this.productsService.upload(this.id, this.image, this.gallery).subscribe(result2 => {
            this.product = result2
            this.id = this.product._id
            this.data()
            this.image = null
          })
        } else {
          this.product = result1
          this.id = this.product._id
          this.product.shop = this.shops.find((el: Shop) => el._id == result1.shop)
          this.data()
        }
      })
    } else {
      this.oSub = this.productsService.create(data).subscribe(result1 => {
        if (this.image || this.gallery.length) {
          this.iSub = this.productsService.upload(result1._id, this.image, this.gallery).subscribe(result2 => {
            this.image = null
            this.product = result2
            this.id = this.product._id
            this.router.navigate(['products', result1._id])
          })
        } else {
          this.product = result1
          this.id = this.product._id
          this.router.navigate(['products', result1._id])
        }
      })
    }
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.iSub) this.iSub.unsubscribe()
  }

}
