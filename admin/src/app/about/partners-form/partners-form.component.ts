import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Partner } from 'src/app/shared/interfaces';
import { PartnersService } from 'src/app/shared/transport/partners.service';

@Component({
  selector: 'app-partners-form',
  templateUrl: './partners-form.component.html',
  styleUrls: ['./partners-form.component.css']
})
export class PartnersFormComponent implements OnInit, OnDestroy {

  form: FormGroup
  loading = 1
  id: string
  partner: Partner
  oSub: Subscription
  iSub: Subscription
  image: File

  constructor(private activateRoute: ActivatedRoute,
    private partnersService: PartnersService,
    private router: Router ) { 
    this.id = this.activateRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.id) {
      this.partnersService.fetchById(this.id).subscribe(partner => {
        this.partner = partner
        this.form = new FormGroup({
          name: new FormControl(this.partner.name, Validators.required),
          url: new FormControl(this.partner.url),
          visible: new FormControl(this.partner.visible),
          image: new FormControl(this.partner.image),
        })
        this.loading --
      })
    } else {
      this.form = new FormGroup({
        name: new FormControl('', Validators.required),
        url: new FormControl(''),
        visible: new FormControl(true),
        image: new FormControl('') //
      })
      this.loading --
    }
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file
  }

  back() {
    this.router.navigate(['general'])
  }

  onSubmit() {
    if (this.id) {
      this.oSub = this.partnersService.update(this.id, this.form.value).subscribe(partner1 => {
        if (this.image) {
          this.iSub = this.partnersService.upload(this.id, this.image).subscribe(partner2 => {
            this.partner = partner2
            this.image = null
          })
        } else {
          this.partner = partner1
        }
      })
    } else {
      this.oSub = this.partnersService.create(this.form.value).subscribe(partner1 => {
        if (this.image) {
          this.iSub = this.partnersService.upload(partner1._id, this.image).subscribe(partner2 => {
            this.image = null
            this.router.navigate(['partner', partner1._id])
          })
        } else {
          this.router.navigate(['partner', partner1._id])
        }
      })
    }
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.iSub) this.iSub.unsubscribe()
  }

}
