import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LibItem } from 'src/app/shared/interfaces';
import { LibraryService } from 'src/app/shared/transport/library.service';

@Component({
  selector: 'app-library-page',
  templateUrl: './library-page.component.html',
  styleUrls: ['./library-page.component.css']
})
export class LibraryPageComponent implements OnInit {

  form: FormGroup
  loading = 1
  id: string
  oSub: Subscription
  item: LibItem
  image: File
  imagePreview: string

  constructor(private libraryService: LibraryService,
    private datePipe: DatePipe,
    private router: Router,
    private activateRoute: ActivatedRoute ) { 
      this.id = this.activateRoute.snapshot.params['id'];
    }

    ngOnInit(): void {
      if (this.id === 'new') this.id = null
      if (this.id) {
        this.libraryService.fetchById(this.id).subscribe(item => {
          this.item = item
          this.imagePreview = this.item.image
          this.data()
          this.loading --
        })
      } else {
        this.form = new FormGroup({
          name: new FormControl('', Validators.required),
          path: new FormControl(''),
          visible: new FormControl(true),
          date: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required),
          image: new FormControl(null),
          description: new FormControl(null),
          content: new FormArray([])
        })
        this.loading --
      }
    }

    data() {
      this.form = new FormGroup({
        name: new FormControl(this.item.name, Validators.required),
        path: new FormControl(this.item.path),
        visible: new FormControl(this.item.visible),
        date: new FormControl(this.datePipe.transform(this.item.date, 'yyyy-MM-dd')),
        description: new FormControl(this.item.description),
        image: new FormControl(this.item.image),
        content: new FormArray(this.item.content.map(el => {
          return new FormGroup({
            type: new FormControl(el.type, Validators.required),
            url: new FormControl(el.url, Validators.required),
            text: new FormControl(el.text),
          })
        }))
      })
    }

    photoURL() {
      if (this.form.value.image) this.imagePreview = this.form.value.image
    }

    plusToContent() {
      const gallery = this.form.get('content') as FormArray
      gallery.push(new FormGroup({
        url: new FormControl(null, Validators.required),
        type: new FormControl(null, Validators.required),
        text: new FormControl(null),
      }))
    }
  
    deleteContentByIndex(i) {
      const array = this.form.get('content') as FormArray
      array.removeAt(i)
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
  
    back() {
      this.router.navigate(['library'])
    }

    onSubmit() {

      if (this.id) {
        this.oSub = this.libraryService.update(this.id, this.form.value).subscribe(result1 => {
          if (this.image) {
            this.libraryService.upload(this.id, this.image).subscribe(result2 => {
              this.item = result2
              this.image = null
              // this.id = this.item._id
              this.data()
              // this.gallery = []
              
            })
          } else {
            this.item = result1
            // this.id = this.item._id
            this.data()
          }
        })
      } else {
        this.oSub = this.libraryService.create(this.form.value).subscribe(result1 => {
          this.item = result1
          this.id = this.item._id
          this.data()
          if (this.image) {
            this.libraryService.upload(result1._id, this.image).subscribe(result2 => {
              this.image = null
              this.item = result2
              // this.gallery = []
              this.data()
              this.router.navigate(['library', this.id])
            })
          } else {
            this.router.navigate(['library', this.id])
          }
        })
      }
    }
  
    ngOnDestroy(): void {
      if (this.oSub) this.oSub.unsubscribe()
    }

}
