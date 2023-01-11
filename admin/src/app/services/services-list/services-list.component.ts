import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Service } from 'src/app/shared/interfaces';
import { GeneralService } from 'src/app/shared/transport/general.service';
import { ServiceService } from 'src/app/shared/transport/service.service';

const STEP = 100

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent implements OnInit {

  limit = STEP
  offset = 0
  form: FormGroup
  now: Date
  oSub: Subscription
  services: Service[]
  loading = 2
  noMore = false
  filter: any = {
    'fields_date': 1,
    'fields_name': 1,
    'fields_description': 1,
    'fields_visible': 1,
    'fields_image': 1
  }

  constructor( private servicesService: ServiceService,
    private generalService: GeneralService, 
    private datePipe: DatePipe,
    private router: Router) { }

  ngOnInit(): void {
    this.now = new Date()
    this.generalService.fetch("EVENTS").subscribe(data => {
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

    this.oSub = this.servicesService.fetch(params).subscribe(services => {
      this.services = services
      this.services.forEach(service => {
        if (service.date) {
          if (service.date.single && service.date.single.find(d => new Date(d) > this.now)) {
            service.dateStr = "Открыта"
          }
          else if (!!service.date.period && service.date.period.find(p =>  ((new Date(p.start) <= this.now) && (!p.end || new Date(p.end) > this.now) && p.visible))) {
              service.dateStr = "Открыта"
          } else {
            service.dateStr = "Закрыта"
          }
        } else {
          service.dateStr = "Закрыта"
        }
      })
      this.noMore = services.length < this.limit
      this.loading--
    })
  }

  createService(event) {
    this.router.navigate(['services', 'new'])
  }

  editService(id) {
    this.router.navigate(['services', id])
  }

  loadMore(toEnd: boolean) {
    if (toEnd) this.offset += this.limit
    else this.offset -= this.limit
    this.loading = 1
    this.fetch()
  }

  onSubmit() {
    this.form.disable()
    this.generalService.update("EVENTS", this.form.value).subscribe(value => {
      this.form.enable()
    })
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }

}
