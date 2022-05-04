import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/transport/users.service';
import { TeamService } from 'src/app/shared/transport/team.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  loading = 1
  id: string
  user: User
  oSub: Subscription
  iSub: Subscription

  constructor(private usersService: UsersService,
    private teamService: TeamService,
    private activateRoute: ActivatedRoute,
    private router: Router) {
      this.id = this.activateRoute.snapshot.params['id'];
     }

  ngOnInit(): void {
    this.usersService.fetchById(this.id).subscribe(user => {
      this.user = user
      this.data()
      this.loading --
    })
  }

  data() {
    this.form = new FormGroup({
      name: new FormControl(this.user.name, Validators.required),
      surname: new FormControl(this.user.surname, Validators.required),
      email: new FormControl(this.user.email, Validators.required),
      patronymic: new FormControl(this.user.patronymic),
      info: new FormControl(this.user.info),
      sex: new FormControl(this.user.sex, Validators.required),
      isAdmin: new FormControl(this.user.isAdmin)
    })
  }

  back() {
    this.router.navigate(['users'])
  }

  onSubmit(add = false) {
    const data = {...this.form.value}
    this.oSub = this.usersService.update(this.id, data).subscribe(result => {
      this.user = result
      if (add) {
        this.teamService.add(this.id, {
          name: this.form.value.name,
          surname: this.form.value.surname,
          image: this.user.photo,
          visible: false
        }).subscribe(staff => {
          this.router.navigate(['users', 'team', staff._id])
        })
      }
    })
  }

  toTeam() {
    this.router.navigate(['users', 'team', this.user.team])
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }
}
