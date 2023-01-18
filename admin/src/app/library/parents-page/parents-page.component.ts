import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TransportService } from 'src/app/shared/transport/transport.service';

@Component({
  selector: 'app-parents-page',
  templateUrl: './parents-page.component.html',
  styleUrls: ['./parents-page.component.css']
})
export class ParentsPageComponent implements OnInit {

  form: FormGroup
  loading = 1
  id: string
  page: any
  // image: File
  // imagePreview: string
  gallery: File[] = []
  galleryPreview: string[] = []

  oSub: Subscription
  iSub: Subscription

  constructor(private activateRoute: ActivatedRoute,
    private transportService: TransportService,
    private router: Router ) { 
    this.id = this.activateRoute.snapshot.params['id']; }

  ngOnInit(): void {
    if (this.id == 'new') this.id = null
    if (this.id) {
      this.transportService.fetchById("parents", this.id).subscribe(page => {
        this.page = page
        // this.imagePreview = this.page.image
        this.data()
        this.loading --
      })
    } else {
      this.form = new FormGroup({
        name: new FormControl('', Validators.required),
        age: new FormControl(''),
        age_text: new FormControl(''),
        path: new FormControl(''),
        visible: new FormControl(true),
        description: new FormControl(''),

        gallery: new FormArray([]),
        orgs: new FormArray([]),
        text_help: new FormControl(''),
        text_form: new FormControl(''),
        text_orgs: new FormControl('Какие еще организации специализируются на поддержке детей'),
        url_library: new FormControl(''),
        text_library: new FormControl('Ознакомиться с материалами по развитию ребенка'),
      })
      this.loading --
    }
  }

  data() {
    this.form = new FormGroup({
      name: new FormControl(this.page.name, Validators.required),
      age: new FormControl(this.page.age),
      age_text: new FormControl(this.page.age_text),
      path: new FormControl(this.page.path),
      visible: new FormControl(this.page.visible),
      description: new FormControl(this.page.description),
      
      gallery: new FormArray(this.page.gallery.map(el => new FormControl(el))),
      orgs: new FormArray(this.page.orgs.map(el => new FormGroup({
        name: new FormControl(el.name, Validators.required),
        description: new FormControl(el.description, Validators.required),
        url: new FormControl(el.url),
      }))),
      text_help: new FormControl(this.page.text_help),
      text_form: new FormControl(this.page.text_form),
      text_library: new FormControl(this.page.text_library),
      text_orgs: new FormControl(this.page.text_orgs),
      url_library: new FormControl(this.page.url_library),
    })
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

  plusToFormArray(type: string) {
    const gallery = this.form.get(type) as FormArray
    gallery.push(new FormControl(''))
  }

  plusToOrgs() {
    const gallery = this.form.get("orgs") as FormArray
    gallery.push(new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      url: new FormControl(null),
    }))
  }

  deletePhotoByIndex(i: number) {
    this.galleryPreview.splice(i, 1)
    this.gallery.splice(i, 1)
  }

  deleteItemByIndex(type: string, i: number) {
    const gallery = this.form.get(type) as FormArray
    gallery.removeAt(i)
  }

  onSubmit() {
    const data = this.form.value
    if (this.id) {
      this.oSub = this.transportService.update("parents", this.id, data).subscribe(result => {
        this.page = result
        this.id = this.page._id
        this.data()
        if (this.gallery && this.gallery.length) {
          this.onFilesUpload()
        }
      })
    } else {
      this.oSub = this.transportService.create("parents", data).subscribe(result => {
        this.page = result
        this.id = this.page._id
        if (this.gallery && this.gallery.length) {
          this.onFilesUpload()
        } else {
          this.router.navigate(['library', 'parents', result._id])
        }
      })
    }
  }

  onFilesUpload() {
    this.iSub = this.transportService.upload("parents", this.id, null, this.gallery).subscribe(result => {
      // this.image = null
      this.page = result
      this.id = this.page._id
      this.gallery = []
      this.router.navigate(['library', 'parents', result._id])
    })
  }

  back() {
    this.router.navigate(['library', 'parents'])
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.iSub) this.iSub.unsubscribe()
  }
}
