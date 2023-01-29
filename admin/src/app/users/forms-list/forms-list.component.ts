import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransportService } from 'src/app/shared/transport/transport.service';

const STEP = 100

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.css']
})
export class FormsListComponent implements OnInit {

  limit = STEP
  offset = 0
  items: any[]
  loading = 1
  noMore = false

  constructor(private transportService: TransportService,
    private router: Router) { }

    ngOnInit(): void {
      this.fetch()
    }

    private fetch() {
      const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      })
  
      this.transportService.fetch("forms", params).subscribe(items => {
        items.forEach(item => {
          item.name = item.answers.find(ans => ans.code == "name")?.answer
          item.email = item.answers.find(ans => ans.code == "email")?.answer
          item.tel = item.answers.find(ans => ans.code == "tel")?.answer
        })
        this.items = items
        this.noMore = items.length < this.limit
        this.loading--
      })
    }

    goToItem(id) {
      this.router.navigate(['users', 'forms', id])
    }
  
    loadMore(toEnd: boolean) {
      if (toEnd) this.offset += this.limit
      else this.offset -= this.limit
      this.loading++
      this.fetch()
    }

}
