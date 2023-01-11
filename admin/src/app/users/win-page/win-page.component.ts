import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TransportService } from 'src/app/shared/transport/transport.service';

@Component({
  selector: 'app-win-page',
  templateUrl: './win-page.component.html',
  styleUrls: ['./win-page.component.css']
})
export class WinPageComponent implements OnInit {

  form: FormGroup
  loading = 1
  id: string
  oSub: Subscription
  iSub: Subscription
  file: File
  imagePreview: string
  item: any

  constructor(private transportService: TransportService,
    private router: Router,
    private activateRoute: ActivatedRoute ) { 
      this.id = this.activateRoute.snapshot.params['id'];
    }

    ngOnInit(): void {
      if (this.id === 'new') this.id = null
      if (this.id) {
        this.transportService.fetchById("wins", this.id).subscribe(item => {
          this.item = item
          this.data()
          this.loading --
        })
      } else {
        this.form = new FormGroup({
          name: new FormControl('', Validators.required),
          path: new FormControl(''),
          visible: new FormControl(true),
          description: new FormControl(null),
          image: new FormControl(null),
        })
        this.loading --
      }
    }

    data() {
      this.form = new FormGroup({
        name: new FormControl(this.item.name, Validators.required),
        path: new FormControl(this.item.path),
        visible: new FormControl(this.item.visible),
        description: new FormControl(this.item.description),
        image: new FormControl(this.item.image),
      })
      this.imagePreview = this.item.image
    }
  
    onFileUpload(event: any) {
      const file = event.target.files[0]
      this.file = file
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result.toString()
      }
      reader.readAsDataURL(file)
    }

    photoURL() {
      if (this.form.value.image) this.imagePreview = this.form.value.image
    }
  
    back() {
      this.router.navigate(['users', 'wins'])
    }

    onSubmit() {
      const data = this.form.value
      if (this.id) {
        this.oSub = this.transportService.update("wins", this.id, data).subscribe(result1 => {
          if (this.file) {
            this.iSub = this.transportService.upload("wins", this.id, this.file).subscribe(result2 => {
              this.item = result2
              this.id = this.item._id
              this.data()
              this.file = null
            })
          } else {
            this.item = result1
            this.id = this.item._id
            this.data()
          }
        })
      } else {
        this.oSub = this.transportService.create("wins", data).subscribe(result1 => {
          if (this.file) {
            this.iSub = this.transportService.upload("wins", result1._id, this.file).subscribe(result2 => {
              this.file = null
              this.item = result2
              this.id = this.item._id
              this.router.navigate(['users', 'wins', result2._id])
            })
          } else {
            this.item = result1
            this.id = this.item._id
            this.router.navigate(['users', 'wins', result1._id])
          }
        })
      }
    }
  
    ngOnDestroy(): void {
      if (this.oSub) this.oSub.unsubscribe()
      if (this.iSub) this.iSub.unsubscribe()
    }

}
