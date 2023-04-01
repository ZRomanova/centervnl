import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TransportService } from 'src/app/shared/transport/transport.service';

@Component({
  selector: 'app-smi-page',
  templateUrl: './smi-page.component.html',
  styleUrls: ['./smi-page.component.css']
})
export class SmiPageComponent implements OnInit {

  form: FormGroup
  loading = 1
  id: string
  oSub: Subscription

  constructor(private transportService: TransportService,
    private router: Router,
    private activateRoute: ActivatedRoute ) { 
      this.id = this.activateRoute.snapshot.params['id'];
    }

    ngOnInit(): void {
      if (this.id === 'new') this.id = null
      if (this.id) {
        this.transportService.fetchById("press", this.id).subscribe(item => {
          this.form = new FormGroup({
            name: new FormControl(item.name, Validators.required),
            url: new FormControl(item.url, Validators.required),
            visible: new FormControl(item.visible),
            date: new FormControl(item.date),
          })
          this.loading --
        })
      } else {
        this.form = new FormGroup({
          name: new FormControl('', Validators.required),
            url: new FormControl('', Validators.required),
            visible: new FormControl(true),
            date: new FormControl(null)
        })
        this.loading --
      }
    }
  
  
    back() {
      this.router.navigate(['blog', 'smi'])
    }

    onSubmit() {
      if (this.id) {
        this.oSub = this.transportService.update("press", this.id, this.form.value).subscribe()
      } else {
        this.oSub = this.transportService.create("press", this.form.value).subscribe(el => {
          this.id = el._id
          this.router.navigate(['blog', 'smi', this.id])
          
        })
      }
    }
  
    ngOnDestroy(): void {
      if (this.oSub) this.oSub.unsubscribe()
    }

}
