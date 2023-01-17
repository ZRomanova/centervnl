import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeneralService } from 'src/app/shared/transport/general.service';
import { TransportService } from 'src/app/shared/transport/transport.service';

const STEP = 100

@Component({
  selector: 'app-smi-list',
  templateUrl: './smi-list.component.html',
  styleUrls: ['./smi-list.component.css']
})
export class SmiListComponent implements OnInit, OnDestroy {

  limit = STEP
  offset = 0
  form: FormGroup
  oSub: Subscription
  posts: any[]
  loading = 2
  noMore = false
  filter: any = {
    'fields_date': 1,
    'fields_name': 1,
    'fields_visible': 1
  }
  constructor(private transportService: TransportService,
    private generalService: GeneralService, 
    private datePipe: DatePipe,
    private router: Router) { }

  ngOnInit(): void {
    this.generalService.fetch("SMI").subscribe(data => {
      this.form = new FormGroup({
        text: new FormControl(data ? data.text : null)
      })
      this.loading--
    })
    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.transportService.fetch("press", params).subscribe(posts => {
      this.posts = posts
      this.posts.forEach(post => {
        post.dateStr = `${this.datePipe.transform(post.date, 'dd.MM.yyyy')}`
      })
      this.noMore = posts.length < this.limit
      this.loading--
    })
  }

  goToPost(id) {
    this.router.navigate(['blog', 'smi', id])
  }

  loadMore(toEnd: boolean) {
    if (toEnd) this.offset += this.limit
    else this.offset -= this.limit
    this.loading++
    this.fetch()
  }

  onSubmit() {
    this.form.disable()
    this.generalService.update("SMI", this.form.value).subscribe(value => {
      this.form.enable()
    })
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }

}
