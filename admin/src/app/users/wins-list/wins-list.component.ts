import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeneralService } from 'src/app/shared/transport/general.service';
import { TransportService } from 'src/app/shared/transport/transport.service';

const STEP = 100

@Component({
  selector: 'app-wins-list',
  templateUrl: './wins-list.component.html',
  styleUrls: ['./wins-list.component.css']
})
export class WinsListComponent implements OnInit, OnDestroy {

  limit = STEP
  offset = 0
  form: FormGroup
  oSub: Subscription
  items: any[]
  loading = 2
  noMore = false
  filter: any = {
    'fields_description': 1,
    'fields_name': 1,
    'fields_image': 1,
    'fields_visible': 1
  }

  constructor(private transportService: TransportService,
    private generalService: GeneralService, 
    private router: Router) { }

    ngOnInit(): void {
      this.generalService.fetch("WINS").subscribe(data => {
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
  
      this.oSub = this.transportService.fetch("wins", params).subscribe(items => {
        this.items = items
        this.noMore = items.length < this.limit
        this.loading--
      })
    }

    goToItem(id) {
      this.router.navigate(['users', 'wins', id])
    }
  
    loadMore(toEnd: boolean) {
      if (toEnd) this.offset += this.limit
      else this.offset -= this.limit
      this.loading++
      this.fetch()
    }
  
    onSubmit() {
      this.form.disable()
      this.generalService.update("WINS", this.form.value).subscribe(value => {
        this.form.enable()
      })
    }
  
    ngOnDestroy(): void {
      if (this.oSub) this.oSub.unsubscribe()
    }

}
