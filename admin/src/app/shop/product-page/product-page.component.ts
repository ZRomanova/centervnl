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
  loading = 1
  id: string
  product: any
  oSub: Subscription
  // sSub: Subscription
  // iSub: Subscription
  gSub: Subscription
  image: File
  imagePreview: string
  gallery: File[] = []
  galleryPreview: string[] = []
  // htModal = false
  // shop: string
  shops: Shop[] = []
  groups: string[] = []

  constructor(private router: Router, 
    private activateRoute: ActivatedRoute,
    private shopsService: ShopsService,
    private productsService: ProductsService,) { 
      this.id = this.activateRoute.snapshot.params['id']
    }

  ngOnInit(): void {
    if (this.id == 'new') this.id = null
    if (this.id) {
      this.productsService.fetchById(this.id).subscribe((product: any) => {
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
        // group: new FormControl(''),
        gallery: new FormArray([]),
        description: new FormControl(''),
        // shop: new FormControl(null, Validators.required),
        options: new FormArray([])
      })
      this.loading --
    }
    // this.sSub = this.shopsService.fetch().subscribe(shops => {
    //   this.shops = shops
    //   this.loading --
    // })
    // this.gSub = this.shopsService.fetchGroups(this.shop).subscribe(groups => {
    //   this.groups = groups
    //   this.loading --
    // })
  }

  data() {
    this.form = new FormGroup({
      name: new FormControl(this.product.name, Validators.required),
      path: new FormControl(this.product.path),
      price: new FormControl(this.product.price, Validators.required),
      visible: new FormControl(this.product.visible),
      image: new FormControl(this.product.image),
      // group: new FormControl(this.product.group),
      // shop: new FormControl(null, Validators.required),
      gallery: new FormArray(this.product.gallery ? this.product.gallery.map(el => new FormControl(el)) : []),
      description: new FormControl(this.product.description),
      options: new FormArray(this.product.options ? this.product.options.map(opt => this.createOptionFormGroup(opt)) : []),
    })
  }

  createOptionFormGroup(item: ProductVariant) {
    return new FormGroup({
      _id: new FormControl({value: item._id, disabled: !item._id}),
      name: new FormControl(item.name, Validators.required),
      variants: new FormArray(item.variants.map(variant => this.createVariantFormGroup(variant))),
    })
  }

  createVariantFormGroup(item: PriceList) {
    return new FormGroup({
      _id: new FormControl({value: item._id, disabled: !item._id}),
      name: new FormControl(item.name, Validators.required),
      price: new FormControl(item.price, Validators.required),
    })
  }

  back() {
    if (this.product) this.router.navigate(['products', this.product.shop_id])
    else this.router.navigate(['products'])
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
      this.oSub = this.productsService.update(this.id, data).subscribe(result => {
        this.product = result
        if (this.image || this.gallery.length) {
          this.onFilesUpload()
        } else this.data()
      }, error => console.log(error.error.message))
    } 
  }

  onFilesUpload() {
    this.productsService.upload(this.id, this.image, this.gallery).subscribe(result => {
      this.product = result
      this.image = null
      this.gallery = null
      this.galleryPreview = []
      if (result.image) this.product.image = result.image
      if (result.gallery && result.gallery.length) this.product.gallery = this.product.gallery.concat(result.gallery)
      this.data()
    }, error => console.log(error))
  }


  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }

}
