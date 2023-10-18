import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Doc } from 'src/app/shared/interfaces';
import { DocsService } from 'src/app/shared/transport/documents.service';

@Component({
  selector: 'app-provider-page',
  templateUrl: './provider-page.component.html',
  styleUrls: ['./provider-page.component.css']
})
export class ProviderPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  loading = 1
  id: string
  doc: Doc
  oSub: Subscription
  fSub: Subscription
  file: File

  constructor(private docsService: DocsService,
    private router: Router,
    private activateRoute: ActivatedRoute ) { 
      this.id = this.activateRoute.snapshot.params['id'];
    }

    ngOnInit(): void {
      if (this.id === 'new') this.id = null
      if (this.id) {
        this.docsService.fetchById(this.id, 'providers').subscribe(doc => {
          this.doc = doc
          this.form = new FormGroup({
            name: new FormControl(this.doc.name, Validators.required),
            description: new FormControl(this.doc.description),
            visible: new FormControl(this.doc.visible),
            file: new FormControl(this.doc.file),
          })
          this.loading --
        })
      } else {
        this.form = new FormGroup({
          name: new FormControl('', Validators.required),
          description: new FormControl(''),
          visible: new FormControl(true),
          file: new FormControl('') //
        })
        this.loading --
      }
    }
  
    onFileUpload(event: any) {
      const file = event.target.files[0]
      this.file = file
    }
  
    back() {
      this.router.navigate(['docs/provider'])
    }

    onSubmit() {
      if (this.id) {
        this.oSub = this.docsService.update(this.id, this.form.value, 'providers').subscribe(doc1 => {
          if (this.file) {
            this.fSub = this.docsService.upload(this.id, this.file, 'providers').subscribe(doc2 => {
              this.doc = doc2
              this.file = null
            })
          } else {
            this.doc = doc1
          }
        })
      } else {
        this.oSub = this.docsService.create(this.form.value, 'providers').subscribe(doc1 => {
          if (this.file) {
            this.fSub = this.docsService.upload(doc1._id, this.file, 'providers').subscribe(doc2 => {
              this.file = null
              this.router.navigate(['docs/provider', doc1._id])
            })
          } else {
            this.router.navigate(['docs/provider', doc1._id])
          }
        })
      }
    }
  
    ngOnDestroy(): void {
      if (this.oSub) this.oSub.unsubscribe()
      if (this.fSub) this.fSub.unsubscribe()
    }

}
