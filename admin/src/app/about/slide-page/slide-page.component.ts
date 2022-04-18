import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeneralService } from 'src/app/shared/transport/general.service';

@Component({
  selector: 'app-slide-page',
  templateUrl: './slide-page.component.html',
  styleUrls: ['./slide-page.component.css']
})
export class SlidePageComponent implements OnInit {

  form: FormGroup
  loading = 1
  id: string
  slide: any
  oSub: Subscription
  image: File
  imagePreview: string

  constructor(private activateRoute: ActivatedRoute,
    private generalService: GeneralService,
    private router: Router ) { 
    this.id = this.activateRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.id) {
      this.generalService.fetch("GALLERY").subscribe(gallery => {
        let slide = gallery ? gallery.find(el => el._id == this.id) : {}
        this.slide = slide
        if (this.slide.image) this.imagePreview = this.slide.image
        this.form = new FormGroup({
          name: new FormControl(this.slide.name),
          description: new FormControl(this.slide.description),
          url: new FormControl(this.slide.url),
          visible: new FormControl(this.slide.visible),
          image: new FormControl(this.slide.image),
        })
        this.loading --
      })
    } else {
      this.form = new FormGroup({
        name: new FormControl(''),
        description: new FormControl(''),
        url: new FormControl(''),
        visible: new FormControl(true),
        image: new FormControl(''),
      })
      this.loading --
    }
  }

  back() {
    this.router.navigate(['general'])
  }

  changeIMG() {
    if (this.form.value.image) this.imagePreview = this.form.value.image
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

  onSubmit() {
    if (this.id) {
      this.oSub = this.generalService.updateSlide(this.id, this.form.value, this.image).subscribe(slide => {
        this.router.navigate(['general'])
      })
    } else {
      this.oSub = this.generalService.createSlide(this.form.value, this.image).subscribe(slide => {
        this.router.navigate(['general'])
      })
    }
    
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }

}
