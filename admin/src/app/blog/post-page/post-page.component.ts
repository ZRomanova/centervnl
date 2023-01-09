import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Partner, Post, Project, Service, Tag } from 'src/app/shared/interfaces';
import { PartnersService } from 'src/app/shared/transport/partners.service';
import { PostService } from 'src/app/shared/transport/post.service';
import { ProjectService } from 'src/app/shared/transport/project.service';
import { ServiceService } from 'src/app/shared/transport/service.service';
import { TagService } from 'src/app/shared/transport/tag.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  loading = 1
  id: string
  post: Post
  oSub: Subscription
  iSub: Subscription
  pSub: Subscription
  ptSub: Subscription
  sSub: Subscription
  tSub: Subscription
  image: File
  imagePreview: string
  htModal = false
  gallery: File[] = []
  galleryPreview: string[] = []
  projects: Project[]
  projectsSelected: string[] = []
  tags: Tag[]
  tagsSelected: string[] = []
  services: Service[]
  servicesSelected: string[] = []
  partners: Partner[]
  partnersSelected: string[] = []

  constructor(private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    // private projectsService: ProjectService,
    // private tagsService: TagService,
    // private servicesService: ServiceService,
    // private partnersService: PartnersService,
    private postsService: PostService,
    private router: Router) { 
      this.id = this.activateRoute.snapshot.params['id'];
    }

  ngOnInit(): void {
    if (this.id == 'new') this.id = null
    if (this.id) {
      this.postsService.fetchById(this.id).subscribe(post => {
        this.post = post
        this.tagsSelected = post.tags ? post.tags : []
        this.partnersSelected = post.partners ? post.partners : []
        this.servicesSelected = post.services ? post.services : []
        this.projectsSelected = post.projects ? post.projects: []
        this.imagePreview = this.post.image
        this.data()
        this.loading --
      })
    } else {
      this.form = new FormGroup({
        name: new FormControl('', Validators.required),
        path: new FormControl(''),
        visible: new FormControl(true),
        gallery: new FormArray([]),
        image: new FormControl(''),
        description: new FormControl(''),
        date: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required),
      })
      this.loading --
    }
    // this.pSub = this.projectsService.fetch({'fields_name': 1, 'filter_visible': 1}).subscribe(result => {
    //   this.projects = result
    // })
    // this.tSub = this.tagsService.fetch().subscribe(result => {
    //   this.tags = result
    // })
    // this.ptSub = this.partnersService.fetch().subscribe(result => {
    //   this.partners = result
    // })
    // this.sSub = this.servicesService.fetch({'fields_name': 1, 'filter_visible': 1}).subscribe(result => {
    //   this.services = result
    // })
  }

  data() {
    this.form = new FormGroup({
      name: new FormControl(this.post.name, Validators.required),
      path: new FormControl(this.post.path),
      visible: new FormControl(this.post.visible),
      gallery: new FormArray(this.post.gallery.map(el => new FormControl(el))),
      image: new FormControl(this.post.image),
      description: new FormControl(this.post.description),
      date: new FormControl(this.datePipe.transform(this.post.date, 'yyyy-MM-dd'), Validators.required),
    })
  }

  openHtModal() {
    this.htModal = true
  }
  closeHtModal(event) {
    this.htModal = false
  }

  getIdsFromArray(array) {
    return array.map(el => el._id)
  }

  deleteURLByIndex(i) {
    const gallery = this.form.get('gallery') as FormArray
    gallery.removeAt(i)
  }

  deletePhotoByIndex(i: number) {
    this.galleryPreview.splice(i, 1)
    this.gallery.splice(i, 1)
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

  photoURL() {
    if (this.form.value.image) this.imagePreview = this.form.value.image
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
  plusToGallery() {
    const gallery = this.form.get('gallery') as FormArray
    gallery.push(new FormControl(''))
  }

  onSubmit() {
    const data = this.form.value
    if (this.id) {
      this.oSub = this.postsService.update(this.id, data).subscribe(result1 => {
        if (this.image || this.gallery.length) {
          this.iSub = this.postsService.upload(this.id, this.image, this.gallery).subscribe(result2 => {
            this.post = result2
            this.id = this.post._id
            this.data()
            this.image = null
          })
        } else {
          this.post = result1
          this.id = this.post._id
          this.data()
        }
      })
    } else {
      this.oSub = this.postsService.create(data).subscribe(result1 => {
        if (this.image || this.gallery.length) {
          this.iSub = this.postsService.upload(result1._id, this.image, this.gallery).subscribe(result2 => {
            this.image = null
            this.post = result2
            this.id = this.post._id
            this.router.navigate(['blog', result2._id])
          })
        } else {
          this.post = result1
          this.id = this.post._id
          this.router.navigate(['blog', result1._id])
        }
      })
    }
  }

  // clickTag(id) {
  //   let index = this.tagsSelected.indexOf(id)
  //   if (index > -1) this.tagsSelected.splice(index, 1)
  //   else this.tagsSelected.push(id)
  // }
  // clickProject(id) {
  //   let index = this.projectsSelected.indexOf(id)
  //   if (index > -1) this.projectsSelected.splice(index, 1)
  //   else this.projectsSelected.push(id)
  // }
  // clickService(id) {
  //   let index = this.servicesSelected.indexOf(id)
  //   if (index > -1) this.servicesSelected.splice(index, 1)
  //   else this.servicesSelected.push(id)
  // }
  // clickPartner(id) {
  //   let index = this.partnersSelected.indexOf(id)
  //   if (index > -1) this.partnersSelected.splice(index, 1)
  //   else this.partnersSelected.push(id)
  // }

  back() {
    this.router.navigate(['blog'])
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.iSub) this.iSub.unsubscribe()
    if (this.sSub) this.sSub.unsubscribe()
    if (this.pSub) this.pSub.unsubscribe()
    if (this.ptSub) this.ptSub.unsubscribe()
    if (this.tSub) this.tSub.unsubscribe()
  }

}
