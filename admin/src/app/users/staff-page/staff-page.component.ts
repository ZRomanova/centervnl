import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Staff } from 'src/app/shared/interfaces';
import { TeamService } from 'src/app/shared/transport/team.service';

@Component({
  selector: 'app-staff-page',
  templateUrl: './staff-page.component.html',
  styleUrls: ['./staff-page.component.css']
})
export class StaffPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  loading = 2
  id: string
  user: Staff
  oSub: Subscription
  iSub: Subscription
  image: File
  imagePreview: string
  positions: string[] = []

  constructor(
    private teamService: TeamService,
    private activateRoute: ActivatedRoute,
    private router: Router) {
      this.id = this.activateRoute.snapshot.params['id'];
     }

  ngOnInit(): void {
    if (this.id === 'new') this.id = null
    if (this.id) {
      this.teamService.fetchById(this.id).subscribe(user => {
        this.user = user
        this.imagePreview = this.user.image
        this.data()
        this.loading --
      })
    } else {
      this.form = new FormGroup({
        name: new FormControl(null, Validators.required),
        surname: new FormControl(null, Validators.required),
        position: new FormControl(null),
        image: new FormControl(null),
        visible: new FormControl(true),
        description: new FormControl(null),
        education: new FormControl(null),
        path: new FormControl(null),
        degree: new FormControl(null),
      })
      this.loading --
    }
    this.teamService.fetchPositions().subscribe(positions => {
      this.positions = positions
      this.loading --
    })
  }

  data() {
    this.form = new FormGroup({
      name: new FormControl(this.user.name, Validators.required),
      surname: new FormControl(this.user.surname, Validators.required),
      position: new FormControl(this.user.position),
      image: new FormControl(this.user.image),
      visible: new FormControl(this.user.visible),
      description: new FormControl(this.user.description),
      education: new FormControl(this.user.education),
      path: new FormControl(this.user.path),
      degree: new FormControl(this.user.degree),
    })
  }

  back() {
    this.router.navigate(['users', 'team'])
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
    const data = {...this.form.value}
    if (this.id) {
      this.oSub = this.teamService.update(this.id, data).subscribe(result1 => {
        if (this.image) {
          this.iSub = this.teamService.upload(this.id, this.image).subscribe(result2 => {
            this.user = result2
            this.data()
            this.image = null
          })
        } else {
          this.user = result1
          this.data()
        }
      })
    } else {
      this.oSub = this.teamService.create(data).subscribe(result1 => {
        this.id = result1._id
        if (this.image) {
          this.iSub = this.teamService.upload(this.id, this.image).subscribe(result2 => {
            this.user = result2
            this.image = null
            this.router.navigate(['users', 'team', this.id])
          })
        } else {
          this.user = result1
          this.router.navigate(['users', 'team', this.id])
        }
      })
    }
  }


  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.iSub) this.iSub.unsubscribe()
  }
}
