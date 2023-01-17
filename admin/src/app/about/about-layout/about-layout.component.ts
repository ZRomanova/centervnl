import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import {GeneralService} from '../../shared/transport/general.service'
import {PartnersService} from '../../shared/transport/partners.service'
import {TagService} from '../../shared/transport/tag.service'
import {DocsService} from '../../shared/transport/documents.service'
import {Doc, Partner, Staff, Tag} from '../../shared/interfaces'
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-layout',
  templateUrl: './about-layout.component.html',
  styleUrls: ['./about-layout.component.css']
})
export class AboutLayoutComponent implements OnInit, OnDestroy {

  loading = 4
  contacts: any
  contactsForm: FormGroup
  partnersForm: FormGroup
  htModal = false
  cSub: Subscription
  pSub: Subscription
  hSub: Subscription
  tSub: Subscription
  gSub: Subscription
  dSub: Subscription
  partners: Partner[]
  team: Staff[]
  // tagForm = false
  // currentTag = null
  // tags: Tag[]
  // tagSort: any[] = []
  gallery: any[]

  constructor(private generalService: GeneralService, 
    private partnersService: PartnersService, 
    private router: Router) { }

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
    this.generalService.fetch("PARTNERS").subscribe(data => {
      this.partnersForm = new FormGroup({
        text: new FormControl(data ? data.text : '')
      })
      this.loading--
    })
    this.pSub = this.partnersService.fetch().subscribe(partners => {
      this.partners = partners
      this.loading--
    })
    // this.tSub = this.tagsService.fetch().subscribe(tags => {
    //   this.tags = tags
    //   this.tagSort = this.makeArray(this.tags)
    // })
    // this.dSub = this.docsService.fetch().subscribe(docs => {
    //   this.docs = docs
    //   this.docsSort = this.makeArray(this.docs)
    // })
    this.gSub = this.generalService.fetch("GALLERY").subscribe(data => {
      this.gallery = data ? data : []
      this.loading--
    })
  }
  openHtModal() {
    this.htModal = true
  }
  closeHtModal(event) {
    this.htModal = false
  }

  makeArray(arrFrom) {
    const chunkArray = (arr, cnt) => arr.reduce((prev, cur, i, a) => !(i % cnt) ? prev.concat([a.slice(i, i + cnt)]) : prev, []);
    return chunkArray(arrFrom, 3)
  }

  onSubmitContacts() {
    this.contactsForm.disable()
    this.generalService.update("CONTACTS", this.contactsForm.value).subscribe(value => {
      this.contacts = value
      this.contactsForm.enable()
    })
  }
  
  onSubmitPartners() {
    this.partnersForm.disable()
    this.generalService.update("PARTNERS", this.partnersForm.value).subscribe(value => {
      this.partnersForm.enable()
    })
  }

  deletePartner(id) {
    this.partnersService.delete(id).subscribe()
  }

  visiblePartner(data) {
    this.partnersService.update(data._id, data).subscribe()
  }

  createPartner() {
    this.router.navigate(['partner'])
  }

  editPartner(id) {
    this.router.navigate(['partner', id])
  }

  deleteSlide(id) {
    this.generalService.deleteSlide(id).subscribe()
  }

  visibleSlide(data) {
    this.generalService.updateSlide(data._id, data).subscribe()
  }

  createSlide() {
    this.router.navigate(['slide'])
  }

  editSlide(id) {
    this.router.navigate(['slide', id])
  }

  // openTagForm(tag) {
  //   this.currentTag = tag
  //   this.tagForm = true
  // }

  // openDocForm(id) {
  //   this.router.navigate(['documents', id])
  // }

  // closeTagForm(tag) {
  //   if (tag) {
  //     if (this.currentTag) {
  //       const index = this.tags.indexOf(this.tags.find(t => t._id == this.currentTag._id))
  //       this.tags[index] = tag
  //       this.tagSort = this.makeArray(this.tags)
  //     } else {
  //       this.tags.push(tag)
  //       this.tagSort = this.makeArray(this.tags)
  //     }
  //   }
  //   this.currentTag = null
  //   this.tagForm = false
  // }

  // backTags() {
  //   if (this.activeTagsPage == 0) this.activeTagsPage = this.tagSort.length - 1
  //   else this.activeTagsPage --
  // }

  // nextTags() {
  //   if (this.activeTagsPage == this.tagSort.length - 1) this.activeTagsPage = 0
  //   else this.activeTagsPage ++
  // }

  ngOnDestroy() {
    if (this.gSub) this.gSub.unsubscribe()
    if (this.tSub) this.tSub.unsubscribe()
    if (this.cSub) this.cSub.unsubscribe()
    if (this.dSub) this.dSub.unsubscribe()
  }
}
