import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import {GeneralService} from '../../shared/transport/general.service'
import {PartnersService} from '../../shared/transport/partners.service'
import {TagService} from '../../shared/transport/tag.service'
import {Partner, Staff, Tag} from '../../shared/interfaces'
import { Router } from '@angular/router';

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
  pSub: Subscription
  hSub: Subscription
  tSub: Subscription
  gSub: Subscription
  partners: Partner[]
  team: Staff[]
  tagForm = false
  currentTag = null
  tags: Tag[]
  tagSort: any[] = []
  activeTagsPage = 0
  gallery: any[]

  constructor(private generalService: GeneralService, 
    private partnersService: PartnersService, 
    private tagsService: TagService, 
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
    this.generalService.fetch("HOME").subscribe(data => {
      this.homeText = data.text
      this.textForm = new FormGroup({
        text: new FormControl(this.homeText)
      })
      this.loading--
    })
    this.pSub = this.partnersService.fetch().subscribe(partners => {
      this.partners = partners
    })
    this.tSub = this.tagsService.fetch().subscribe(tags => {
      this.tags = tags
      this.tagSort = this.makeArray(this.tags)
    })
    this.gSub = this.generalService.fetch("GALLERY").subscribe(data => {
      this.gallery = data ? data : []
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

  onSubmit() {
    this.contactsForm.disable()
    this.textForm.disable()
    this.cSub = this.generalService.update("CONTACTS", this.contactsForm.value).subscribe(value => {
      this.contacts = value
      this.hSub = this.generalService.update("HOME", {text: this.textForm.value.text}).subscribe(text => {
        this.homeText = text
        this.contactsForm.enable()
        this.textForm.enable()
      })
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

  openTagForm(tag) {
    this.currentTag = tag
    this.tagForm = true
  }

  closeTagForm(tag) {
    if (tag) {
      if (this.currentTag) {
        const index = this.tags.indexOf(this.tags.find(t => t._id == this.currentTag._id))
        this.tags[index] = tag
        this.tagSort = this.makeArray(this.tags)
      } else {
        this.tags.push(tag)
        this.tagSort = this.makeArray(this.tags)
      }
    }
    this.currentTag = null
    this.tagForm = false
  }


  nextTags() {
    if (this.activeTagsPage == this.tagSort.length - 1) this.activeTagsPage = 0
    else this.activeTagsPage ++
  }

  backTags() {
    if (this.activeTagsPage == 0) this.activeTagsPage = this.tagSort.length - 1
    else this.activeTagsPage --
  }

  ngOnDestroy() {
    if (this.cSub) this.cSub.unsubscribe()
    if (this.hSub) this.hSub.unsubscribe()
    if (this.gSub) this.gSub.unsubscribe()
    if (this.tSub) this.tSub.unsubscribe()
    if (this.cSub) this.cSub.unsubscribe()
  }
}
