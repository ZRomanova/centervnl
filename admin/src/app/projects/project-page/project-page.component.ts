import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Partner, Project, Tag } from 'src/app/shared/interfaces';
import { PartnersService } from 'src/app/shared/transport/partners.service';
import { ProjectService } from 'src/app/shared/transport/project.service';
import { TagService } from 'src/app/shared/transport/tag.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {

  form: FormGroup
  loading = 1
  id: string
  project: Project
  oSub: Subscription
  iSub: Subscription
  image: File
  imagePreview: string
  gallery: File[] = []
  galleryPreview: string[] = []
  htModal = false

  tags: Tag[]
  tagsSelected: string[] = []
  partners: Partner[]
  partnersSelected: string[] = []


  pSub: Subscription
  ptSub: Subscription
  tSub: Subscription

  constructor(private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private projectsService: ProjectService,
    private tagsService: TagService,
    private partnersService: PartnersService,
    private router: Router ) { 
    this.id = this.activateRoute.snapshot.params['id']; }

  ngOnInit(): void {
    if (this.id == 'new') this.id = null
    if (this.id) {
      this.projectsService.fetchById(this.id).subscribe(project => {
        this.project = project
        this.imagePreview = this.project.image
        this.tagsSelected = this.project.tags ? this.project.tags : []
        this.partnersSelected = this.project.partners ? this.project.partners : []
        this.data()
        this.loading --
      })
    } else {
      this.form = new FormGroup({
        name: new FormControl('', Validators.required),
        path: new FormControl(''),
        visible: new FormControl(true),
        image: new FormControl(''),
        gallery: new FormArray([]),
        description: new FormControl(''),
        period: new FormGroup({
          start: new FormControl(null, Validators.required),
          end: new FormControl(null)
        })
      })
      this.loading --
    }
    this.tSub = this.tagsService.fetch().subscribe(result => {
      this.tags = result
    })
    this.ptSub = this.partnersService.fetch().subscribe(result => {
      this.partners = result
    })
  }

  data() {
    this.form = new FormGroup({
      name: new FormControl(this.project.name, Validators.required),
      path: new FormControl(this.project.path),
      visible: new FormControl(this.project.visible),
      image: new FormControl(this.project.image),
      gallery: new FormArray(this.project.gallery.map(el => new FormControl(el))),
      description: new FormControl(this.project.description),
      period: new FormGroup({
        start: new FormControl(this.datePipe.transform(this.project.period.start, 'yyyy-MM-dd'), Validators.required),
        end: new FormControl(this.project.period.end ? this.datePipe.transform(this.project.period.end, 'yyyy-MM-dd') : null)
      })
    })
  }

  openHtModal() {
    this.htModal = true
  }
  closeHtModal(event) {
    this.htModal = false
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
    console.log(this.gallery, this.galleryPreview)
  }

  plusToGallery() {
    const gallery = this.form.get('gallery') as FormArray
    gallery.push(new FormControl(''))
  }

  photoURL() {
    if (this.form.value.image) this.imagePreview = this.form.value.image
  }

  deletePhotoByIndex(i: number) {
    this.galleryPreview.splice(i, 1)
    this.gallery.splice(i, 1)
  }

  deleteURLByIndex(i: number) {
    const gallery = this.form.get('gallery') as FormArray
    gallery.removeAt(i)
  }

  clickTag(id) {
    let index = this.tagsSelected.indexOf(id)
    if (index > -1) this.tagsSelected.splice(index, 1)
    else this.tagsSelected.push(id)
  }
  clickPartner(id) {
    let index = this.partnersSelected.indexOf(id)
    if (index > -1) this.partnersSelected.splice(index, 1)
    else this.partnersSelected.push(id)
  }

  onSubmit() {
    const data = {...this.form.value, tags: this.tagsSelected, partners: this.partnersSelected}
    if (this.id) {
      this.oSub = this.projectsService.update(this.id, data).subscribe(result1 => {
        if (this.image || this.gallery.length) {
          this.iSub = this.projectsService.upload(this.id, this.image, this.gallery).subscribe(result2 => {
            this.project = result2
            this.data()
            this.image = null
          })
        } else {
          this.project = result1
          this.data()
        }
      })
    } else {
      this.oSub = this.projectsService.create(data).subscribe(result1 => {
        if (this.image || this.gallery.length) {
          this.iSub = this.projectsService.upload(result1._id, this.image, this.gallery).subscribe(result2 => {
            this.image = null
            this.router.navigate(['projects', result1._id])
          })
        } else {
          this.router.navigate(['projects', result1._id])
        }
      })
    }
  }

  back() {
    this.router.navigate(['projects'])
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.iSub) this.iSub.unsubscribe()
  }

}
