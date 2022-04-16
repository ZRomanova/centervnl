import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tag } from 'src/app/shared/interfaces';
import { TagService } from 'src/app/shared/transport/tag.service';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.css']
})
export class AddTagComponent implements OnInit {

  @Input() tag = null
  @Output() close = new EventEmitter<Tag | null>()

  form: FormGroup

  constructor(private tagsService: TagService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('')
    })
    if (this.tag) {
      this.form.patchValue({
        name: this.tag.name,
        description: this.tag.description
      })
    }
  }

  finish(result: boolean) {
    if (result) {
      let sub
      if (!this.tag) {
        sub = this.tagsService.create(this.form.value)
      } else {
        sub = this.tagsService.update(this.tag._id, this.form.value)
      }
      sub.subscribe(tag => {
        this.close.emit(tag)
      }, error => this.close.emit(null))
    } else {
      this.close.emit(null)
    }
  }

}
