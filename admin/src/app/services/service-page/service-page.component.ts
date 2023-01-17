import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Partner, Period, PriceList, Project, Service, Tag } from 'src/app/shared/interfaces';
import { PartnersService } from 'src/app/shared/transport/partners.service';
import { ProjectService } from 'src/app/shared/transport/project.service';
import { ServiceService } from 'src/app/shared/transport/service.service';
import { TagService } from 'src/app/shared/transport/tag.service';

@Component({
  selector: 'app-service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.css']
})
export class ServicePageComponent implements OnInit {

  form: FormGroup
  loading = 1
  id: string
  service: Service
  oSub: Subscription
  iSub: Subscription
  image: File
  imagePreview: string
  gallery: File[] = []
  galleryPreview: string[] = []
  htModal = false
  week = [
    {
      en:'monday',
      ru: 'ПН'
    },
    {
      en: 'tuesday',
      ru: 'ВТ'
    },
    {
      en: 'wednesday',
      ru: 'СР'
    },
    {
      en: 'thursday',
      ru: 'ЧТ'
    },
    {
      db: 'friday',
      ru: 'ПТ'
    },
    {
      en: 'saturday',
      ru: 'СБ'
    },
    {
      en: 'sunday',
      ru: 'ВС'
    }
  ]

  projects: Project[]
  projectsSelected: string[] = []
  tags: Tag[]
  tagsSelected: string[] = []
  partners: Partner[]
  partnersSelected: string[] = []

  pSub: Subscription
  ptSub: Subscription
  tSub: Subscription

  constructor(private activateRoute: ActivatedRoute,
    private projectsService: ProjectService,
    private tagsService: TagService,
    private servicesService: ServiceService,
    private partnersService: PartnersService,
    private datePipe: DatePipe,
    private router: Router ) { 
    this.id = this.activateRoute.snapshot.params['id']; }

    ngOnInit(): void {
      if (this.id == 'new') this.id = null
      if (this.id) {
        this.servicesService.fetchById(this.id).subscribe(service => {
          this.service = service
          this.imagePreview = this.service.image
          this.data()
          // this.tagsSelected = this.service.tags ? this.service.tags : []
          // this.partnersSelected = this.service.partners ? this.service.partners : []
          // this.projectsSelected = this.service.projects ? this.service.projects: []
          this.loading --
        })
      } else {
        this.form = new FormGroup({
          name: new FormControl('', Validators.required),
          path: new FormControl(''),
          visible: new FormControl(true),
          image: new FormControl(''),
          peopleLimit: new FormControl(null),
          gallery: new FormArray([]),
          description: new FormControl(''),
          address: new FormControl(''),
          priceList: new FormArray([this.createPriceListFormGroup({price: 0})]),
          date: new FormGroup({
            single: new FormArray([]),
            period: new FormArray([])
          })
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
    }
  
    data() {
      this.form = new FormGroup({
        name: new FormControl(this.service.name, Validators.required),
        path: new FormControl(this.service.path),
        visible: new FormControl(this.service.visible),
        image: new FormControl(this.service.image),
        peopleLimit: new FormControl(this.service.peopleLimit),
        gallery: new FormArray(this.service.gallery.map(el => new FormControl(el))),
        description: new FormControl(this.service.description),
        address: new FormControl(this.service.address),
        priceList: new FormArray(this.service.priceList.map(pl => this.createPriceListFormGroup(pl))),
        date: new FormGroup({
          single: new FormArray(this.service.date.single.map(d => new FormControl(this.datePipe.transform(d, 'yyyy-MM-ddTHH:mm'), Validators.required))),
          period: new FormArray(this.service.date.period.map(p => this.createPeriodFormGroup(p)))
        })
      })
    }

    private createPriceListFormGroup(item: PriceList): FormGroup {
      return new FormGroup({
        name: new FormControl(item.name),
        description: new FormControl(item.description),
        price: new FormControl(item.price, Validators.required),
      })
    }

    private intToStringDate(num: number) {
      const hour = 1000 * 60 * 60 
      const minute = 1000 * 60
      let resH: any = Math.floor(num / hour) 
      let resM: any = Math.round((num - resH * hour) / minute)
      if (resH < 10) resH = "0" + resH
      if (resM < 10) resM = "0" + resM
      return `${resH}:${resM}`
    }

    private stringToIntDate(str: string) {
      const hours  = str.split(':')[0]
      const minutes  = str.split(':')[1]
      return (1000 * 60 * 60 * +hours) + (1000 * 60 * +minutes)
    }

    private createPeriodFormGroup(period: Period): FormGroup {
      return new FormGroup({
        start: new FormControl(this.datePipe.transform(period.start, 'yyyy-MM-dd'), Validators.required),
        end: new FormControl(period.end ? this.datePipe.transform(period.end, 'yyyy-MM-dd') : null),
        time: new FormControl(typeof period.time == 'number' ? this.intToStringDate(period.time) : period.time),
        visible: new FormControl(period.visible),
        day: new FormControl(period.day, Validators.required)
      })
    }

    plusToPriceList() {
      const pl = this.form.get('priceList') as FormArray
      pl.push(this.createPriceListFormGroup({price: 0}))
    }

    deletePriceListItem(i) {
      const pl = this.form.get('priceList') as FormArray
      pl.removeAt(i)
    }

    plusSingleDate() {
      const dateFG = this.form.controls.date as FormGroup
      const single = dateFG.get('single') as FormArray
      single.push(new FormControl(null))
    }

    deleteSingleDate(i) {
      const dateFG = this.form.controls.date as FormGroup
      const single = dateFG.get('single') as FormArray
      single.removeAt(i)
    }

    plusPeriod() {
      const newPeriod: Period = {
        start: new Date(),
        visible: true,
        end: null,
        day: ''
      }
      const dateFG = this.form.controls.date as FormGroup
      const periods = dateFG.get('period') as FormArray
      periods.push(this.createPeriodFormGroup(newPeriod))
    }

    deletePeriodDate(i) {
      const dateFG = this.form.controls.date as FormGroup
      const periods = dateFG.get('period') as FormArray
      periods.removeAt(i)
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
    }
  
    plusToGallery() {
      const gallery = this.form.get('gallery') as FormArray
      gallery.push(new FormControl(''))
    }
  
    deleteURLByIndex(i) {
      const gallery = this.form.get('gallery') as FormArray
      gallery.removeAt(i)
    }
  
    photoURL() {
      if (this.form.value.image) this.imagePreview = this.form.value.image
    }
  
    deletePhotoByIndex(i: number) {
      this.galleryPreview.splice(i, 1)
      this.gallery.splice(i, 1)
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
    // clickPartner(id) {
    //   let index = this.partnersSelected.indexOf(id)
    //   if (index > -1) this.partnersSelected.splice(index, 1)
    //   else this.partnersSelected.push(id)
    // }
  
    onSubmit() {
      const dateFG = this.form.controls.date as FormGroup
      const periods = dateFG.get('period') as FormArray
      for (let item of periods.value) {
        item.time = this.stringToIntDate(item.time)
      }
      const data = {...this.form.value, tags: this.tagsSelected, projects: this.projectsSelected, partners: this.partnersSelected}
      if (this.id) {
        this.oSub = this.servicesService.update(this.id, data).subscribe(result1 => {
          if (this.image || this.gallery.length) {
            this.iSub = this.servicesService.upload(this.id, this.image, this.gallery).subscribe(result2 => {
              this.service = result2
              this.id = this.service._id
              this.gallery = []
              this.data()
              this.image = null
            })
          } else {
            this.service = result1
            this.id = this.service._id
            this.data()
          }
        })
      } else {
        this.oSub = this.servicesService.create(data).subscribe(result1 => {
          if (this.image || this.gallery.length) {
            this.iSub = this.servicesService.upload(result1._id, this.image, this.gallery).subscribe(result2 => {
              this.image = null
              this.gallery = []
              this.service = result2
              this.id = this.service._id
              this.router.navigate(['services', result1._id])
            })
          } else {
            this.service = result1
            this.id = this.service._id
            this.router.navigate(['services', result1._id])
          }
        })
      }
    }
  
    back() {
      this.router.navigate(['services'])
    }
  
    ngOnDestroy(): void {
      if (this.oSub) this.oSub.unsubscribe()
      if (this.iSub) this.iSub.unsubscribe()
      if (this.pSub) this.pSub.unsubscribe()
      if (this.ptSub) this.ptSub.unsubscribe()
      if (this.tSub) this.tSub.unsubscribe()
    }

}
