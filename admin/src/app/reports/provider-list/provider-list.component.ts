import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Report, Doc } from 'src/app/shared/interfaces';
import { DocsService } from 'src/app/shared/transport/documents.service';
import { GeneralService } from 'src/app/shared/transport/general.service';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.css']
})
export class ProviderListComponent implements OnInit, OnDestroy {

  reports: Report[]
  loading = 2
  oSub: Subscription
  cSub: Subscription
  form: FormGroup
  htModal = false
  docs: Doc[]
  docsSort: any[] = []
  activeDocsPage = 0

  constructor(private generalService: GeneralService,
    private docsService: DocsService,
    private router: Router) { }

  ngOnInit(): void {

    this.generalService.fetch("PROVIDERS").subscribe(data => {
      if (!data) data = {text: ''}
      this.form = new FormGroup({
        text: new FormControl(data.text)
      })
      this.loading--
    })
    this.docsService.fetch('providers').subscribe(docs => {
      this.docs = docs
      this.docsSort = this.makeArray(this.docs)
      this.loading--
    })
  }

  openDocForm(id) {
    this.router.navigate(['docs/provider', id])
  }

  makeArray(arrFrom) {
    const chunkArray = (arr, cnt) => arr.reduce((prev, cur, i, a) => !(i % cnt) ? prev.concat([a.slice(i, i + cnt)]) : prev, []);
    return chunkArray(arrFrom, 3)
  }

  onSubmit() {
    // this.form.disable()
    this.cSub = this.generalService.update("PROVIDERS", this.form.value).subscribe(value => {
      this.form.patchValue(value)
      // this.form.enable()
    })
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
    if (this.cSub) this.cSub.unsubscribe()
  }
}
