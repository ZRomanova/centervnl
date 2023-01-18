import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LibItem } from 'src/app/shared/interfaces';
import { LibraryService } from 'src/app/shared/transport/library.service';

const STEP = 100

@Component({
  selector: 'app-library-list',
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.css']
})
export class LibraryListComponent implements OnInit {

  limit = STEP
  offset = 0
  oSub: Subscription
  items: LibItem[]
  loading = 1
  noMore = false
  filter: any = {
    'fields_date': 1,
    'fields_name': 1,
    'fields_description': 1,
    'fields_visible': 1,
    'fields_image': 1,
  }


  constructor(private router: Router,
    private libraryService: LibraryService,
    private datePipe: DatePipe) { }

    ngOnInit(): void {
      this.fetch()
    }
  
    private fetch() {
      const params = Object.assign({}, this.filter, {
        offset: this.offset,
        limit: this.limit
      })

      this.oSub = this.libraryService.fetch(params).subscribe(items => {
        this.items = items
        this.items.forEach(item => {
          item.dateStr = this.datePipe.transform(item.date, 'dd.MM.yyyy')
        })
        this.noMore = items.length < this.limit
        this.loading--
      })
    }
  
    loadMore(toEnd: boolean) {
      if (toEnd) this.offset += this.limit
      else this.offset -= this.limit
      this.loading++
      this.fetch()
    }

    edit(id) {
      this.router.navigate(['library', id])
    }
  
    ngOnDestroy(): void {
      if (this.oSub) this.oSub.unsubscribe()
    }
}
