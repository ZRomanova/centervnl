import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransportService } from 'src/app/shared/transport/transport.service';

@Component({
  selector: 'app-forms-page',
  templateUrl: './forms-page.component.html',
  styleUrls: ['./forms-page.component.css']
})
export class FormsPageComponent implements OnInit {

  loading = 1
  id: string
  item: any

  constructor(private router: Router,
    private transportService: TransportService,
    private activateRoute: ActivatedRoute) {
    this.id = this.activateRoute.snapshot.params['id'];
   }

  ngOnInit(): void {

    this.transportService.fetchById("forms", this.id).subscribe(item => {
      this.item = item
      this.loading--
    })
  }

  back() {
    this.router.navigate(['users', 'forms'])
  }
}
