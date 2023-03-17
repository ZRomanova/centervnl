import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Partner, Program, Project, Tag } from 'src/app/shared/interfaces';
import { PartnersService } from 'src/app/shared/transport/partners.service';
import { ProgramService } from 'src/app/shared/transport/program.service';
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
  programs: Program[]
  oSub: Subscription
  iSub: Subscription
  image: File
  imagePreview: string
  gallery: File[] = []
  galleryPreview: string[] = []
  filter: any = {
    'fields_name': 1
  }
  // htModal = false

  pSub: Subscription

  constructor(private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private projectsService: ProjectService,
    private programsService: ProgramService,
    private router: Router ) { 
    this.id = this.activateRoute.snapshot.params['id']; }

  ngOnInit(): void {
    if (this.id == 'new') this.id = null
    if (this.id) {
      this.projectsService.fetchById(this.id).subscribe(project => {
        this.project = project
        this.imagePreview = this.project.image

        this.data()
        this.loading --
      })
    } else {
      this.form = new FormGroup({
        name: new FormControl('', Validators.required),
        path: new FormControl(''),
        visible: new FormControl(true),
        is_grant: new FormControl(true),
        image: new FormControl(''),
        gallery: new FormArray([]),
        description: new FormControl(''),
        period: new FormGroup({
          start: new FormControl(null),
          end: new FormControl(null)
        }),
        programs: new FormArray([]),
        content: new FormArray([]),
        video: new FormControl(null),
      })
      this.loading --
    }
    this.programsService.fetch(this.filter).subscribe(programs => {
      this.programs = programs
    })
  }

  data() {
    this.form = new FormGroup({
      name: new FormControl(this.project.name, Validators.required),
      path: new FormControl(this.project.path),
      visible: new FormControl(this.project.visible),
      is_grant: new FormControl(this.project.is_grant),
      image: new FormControl(this.project.image),
      gallery: new FormArray(this.project.gallery.map(el => new FormControl(el))),
      description: new FormControl(this.project.description),
      period: new FormGroup({
        start: new FormControl(this.project.period.start ? this.datePipe.transform(this.project.period.start, 'yyyy-MM-dd', 'UTC +3') : null),
        end: new FormControl(this.project.period.end ? this.datePipe.transform(this.project.period.end, 'yyyy-MM-dd', 'UTC +3') : null)
      }),
      programs: new FormArray(!this.project.programs ? [] : this.project.programs.map(program => {
        return new FormGroup({
          program: new FormControl(program.program, Validators.required),
          description: new FormControl(program.description),
          form: new FormControl(!!program.form),
        })
      })),
      video: new FormControl(this.project.video),
      content: new FormArray(!this.project.content ? [] : this.project.content.map(el => {
        return new FormGroup({
          url: new FormControl(el.url, Validators.required),
          text: new FormControl(el.text),
        })
      }))
    })
  }

  programsFilter(id) {
     return this.programs.filter((item) => !this.form.value.programs.find(p => p.program == item._id) || item._id == id)
    //  return items
  }

  // openHtModal() {
  //   this.htModal = true
  // }
  // closeHtModal(event) {
  //   this.htModal = false
  // }

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
    // console.log(this.gallery, this.galleryPreview)
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

  plusToProgram() {
    const gallery = this.form.get('programs') as FormArray
    gallery.push(new FormGroup({
      program: new FormControl(null, Validators.required),
      description: new FormControl(''),
    }))
  }

  deleteProgramByIndex(i) {
    const array = this.form.get('programs') as FormArray
    array.removeAt(i)
  }

  plusToContent() {
    const gallery = this.form.get('content') as FormArray
    gallery.push(new FormGroup({
      url: new FormControl(null, Validators.required),
      text: new FormControl(null),
    }))
  }

  deleteContentByIndex(i) {
    const array = this.form.get('content') as FormArray
    array.removeAt(i)
  }

  onSubmit() {
    const data = this.form.value
    if (this.id) {
      this.oSub = this.projectsService.update(this.id, data).subscribe(result1 => {
        if (this.image || this.gallery.length) {
          this.iSub = this.projectsService.upload(this.id, this.image, this.gallery).subscribe(result2 => {
            this.project = result2
            this.id = this.project._id
            this.data()
            this.gallery = []
            this.galleryPreview = []
            this.image = null
          })
        } else {
          this.project = result1
          this.id = this.project._id
          this.data()
        }
      })
    } else {
      this.oSub = this.projectsService.create(data).subscribe(result1 => {
        if (this.image || this.gallery.length) {
          this.iSub = this.projectsService.upload(result1._id, this.image, this.gallery).subscribe(result2 => {
            this.image = null
            this.project = result2
            this.gallery = []
            this.galleryPreview = []
            this.id = this.project._id
            this.router.navigate(['projects', this.id])
          })
        } else {
          this.project = result1
          this.id = this.project._id
          this.router.navigate(['projects', this.id])
        }
      })
    }
  }

  back() {
    this.router.navigate(['programs', 'projects'])
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.iSub) this.iSub.unsubscribe()
  }

}
