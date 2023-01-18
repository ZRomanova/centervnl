import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeneralService } from 'src/app/shared/transport/general.service';
import { TransportService } from 'src/app/shared/transport/transport.service';

const STEP = 100

@Component({
  selector: 'app-parents-list',
  templateUrl: './parents-list.component.html',
  styleUrls: ['./parents-list.component.css']
})
export class ParentsListComponent implements OnInit {

  limit = STEP
  offset = 0
  form: FormGroup
  oSub: Subscription
  items: any[]
  loading = 2
  noMore = false
  filter: any = {
    'fields_name': 1,
    'fields_age': 1,
    'fields_description': 1,
    'fields_visible': 1,
    'fields_gallery': 1,
  }


  constructor(private router: Router,
    private generalService: GeneralService, 
    private transportService: TransportService) { }

    ngOnInit(): void {
      this.generalService.fetch("PARENTS_CLUB").subscribe(data => {
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

      this.oSub = this.transportService.fetch("parents", params).subscribe(items => {
        this.items = items
        this.items.forEach(item => {
          item.dateStr = item.age
          if (item.gallery && item.gallery.length) item.image = item.gallery[0]
        })
        this.noMore = items.length < this.limit
        this.loading--
      })
    }

    onSubmit() {
      this.form.disable()
      this.generalService.update("PARENTS_CLUB", this.form.value).subscribe(value => {
        this.form.enable()
      })
    }
  
    loadMore(toEnd: boolean) {
      if (toEnd) this.offset += this.limit
      else this.offset -= this.limit
      this.loading++
      this.fetch()
    }

    edit(id) {
      this.router.navigate(['library', 'parents', id])
    }
  
    ngOnDestroy(): void {
      if (this.oSub) this.oSub.unsubscribe()
    }
}
