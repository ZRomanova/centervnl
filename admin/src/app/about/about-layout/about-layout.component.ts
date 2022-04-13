import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import {GeneralService} from '../../shared/transport/general.service'

@Component({
  selector: 'app-about-layout',
  templateUrl: './about-layout.component.html',
  styleUrls: ['./about-layout.component.css']
})
export class AboutLayoutComponent implements OnInit, OnDestroy {

  loading = 2
  contacts: any
  homeText: string
  contactsForm: FormGroup
  textForm: FormGroup
  htModal = false
  cSub: Subscription
  hSub: Subscription

  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.generalService.fetch("CONTACTS").subscribe(data => {
      this.contacts = data
      this.contactsForm = new FormGroup({
        address: new FormControl(this.contacts.address),
        phone: new FormControl(this.contacts.phone),
        email: new FormControl(this.contacts.email),
      })
      this.loading--
    })
    this.generalService.fetch("HOME").subscribe(data => {
      this.homeText = data.text
      this.textForm = new FormGroup({
        text: new FormControl(this.homeText)
      })
      this.loading--
    })
  }
  openHtModal() {
    this.htModal = true
  }
  closeHtModal(event) {
    this.htModal = false
  }

  onSubmit() {
    this.cSub = this.generalService.update("CONTACTS", this.contactsForm.value).subscribe(value => {
      this.contacts = value
      this.hSub = this.generalService.update("HOME", {text: this.textForm.value.text}).subscribe(text => {
        this.homeText = text
      })
    })
  }

  ngOnDestroy() {
    if (this.cSub) this.cSub.unsubscribe()
    if (this.hSub) this.hSub.unsubscribe()
  }
}
