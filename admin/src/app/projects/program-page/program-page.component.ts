import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Phrase, Program } from 'src/app/shared/interfaces';
import { ProgramService } from 'src/app/shared/transport/program.service';

@Component({
  selector: 'app-program-page',
  templateUrl: './program-page.component.html',
  styleUrls: ['./program-page.component.css']
})
export class ProgramPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  loading = 1
  id: string
  program: Program
  image: File
  imagePreview: string
  icon: File
  iconPreview: string
  gallery: File[] = []
  galleryPreview: string[] = []

  oSub: Subscription
  iSub: Subscription

  constructor(private activateRoute: ActivatedRoute,
    private programsService: ProgramService,
    private router: Router ) { 
    this.id = this.activateRoute.snapshot.params['id']; }

  ngOnInit(): void {
    if (this.id == 'new') this.id = null
    if (this.id) {
      this.programsService.fetchById(this.id).subscribe(program => {
        this.program = program
        this.imagePreview = this.program.image
        this.data()
        this.loading --
      })
    } else {
      this.form = new FormGroup({
        name: new FormControl('', Validators.required),
        subtitle: new FormControl(''),
        path: new FormControl(''),
        visible: new FormControl(true),
        description: new FormControl(''),
        image: new FormControl(''),
        icon: new FormControl(''),
        gallery: new FormArray([]),
        phrases: new FormArray([]),
        text_1: new FormControl(''),
        text_2: new FormControl(''),
        text_3: new FormControl(''),
        text_4: new FormArray([]),
        text_5: new FormControl(''),
        text_6: new FormControl(''),
        text_button: new FormControl(''),
        url_button: new FormControl(''),
        video: new FormControl('')
      })
      this.loading --
    }
  }

  data() {
    this.form = new FormGroup({
      name: new FormControl(this.program.name, Validators.required),
      subtitle: new FormControl(this.program.subtitle),
      path: new FormControl(this.program.path),
      visible: new FormControl(this.program.visible),
      image: new FormControl(this.program.image),
      description: new FormControl(this.program.description),
      icon: new FormControl(this.program.icon),
      gallery: new FormArray(this.program.gallery.map(el => new FormControl(el))),
      phrases: new FormArray(this.program.phrases.map(el => new FormGroup({
        name: new FormControl(el.name, Validators.required),
        description: new FormControl(el.description, Validators.required),
        image: new FormControl(el.image, Validators.required),
      }))),
      text_1: new FormControl(this.program.text_1),
      text_2: new FormControl(this.program.text_2),
      text_3: new FormControl(this.program.text_3),
      text_4: new FormArray(this.program.text_4.map(el => new FormControl(el))),
      text_5: new FormControl(this.program.text_5),
      text_6: new FormControl(this.program.text_6),
      text_button: new FormControl(this.program.text_button),
      url_button: new FormControl(this.program.url_button),
      video: new FormControl(this.program.video),
    })
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

  plusToFormArray(type: string) {
    const gallery = this.form.get(type) as FormArray
    gallery.push(new FormControl(''))
  }

  plusToPhrases() {
    const gallery = this.form.get("phrases") as FormArray
    gallery.push(new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
    }))
  }

  photoURL() {
    if (this.form.value.image) this.imagePreview = this.form.value.image
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
      this.oSub = this.programsService.update(this.id, data).subscribe(result1 => {
        if (this.image || this.gallery.length) {
          this.iSub = this.programsService.upload(this.id, this.image, this.gallery).subscribe(result2 => {
            this.program = result2
            this.id = this.program._id
            this.data()
            this.gallery = []
            this.image = null
          })
        } else {
          this.program = result1
          this.id = this.program._id
          this.data()
        }
      })
    } else {
      this.oSub = this.programsService.create(data).subscribe(result1 => {
        if (this.image || this.gallery.length) {
          this.iSub = this.programsService.upload(result1._id, this.image, this.gallery).subscribe(result2 => {
            this.image = null
            this.program = result2
            this.id = this.program._id
            this.gallery = []
            this.router.navigate(['programs', result2._id])
          })
        } else {
          this.program = result1
          this.id = this.program._id
          this.router.navigate(['programs', result1._id])
        }
      })
    }
  }

  back() {
    this.router.navigate(['programs'])
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.iSub) this.iSub.unsubscribe()
  }
}
