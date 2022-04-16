import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-multi-slider',
  templateUrl: './multi-slider.component.html',
  styleUrls: ['./multi-slider.component.css']
})
export class MultiSliderComponent implements OnInit {

  @Input() data = []
  @Input() page = 'Раздел'

  @Output() add = new EventEmitter<null>()
  @Output() edit = new EventEmitter<string>()
  @Output() delete = new EventEmitter<string>()
  @Output() visible = new EventEmitter<any>()

  items = []
  start = []
  active = 0
  deletingItem: any

  constructor() {
  }

  ngOnInit(): void {
    this.makeArray()
  }

  makeArray() {
    const chunkArray = (arr, cnt) => arr.reduce((prev, cur, i, a) => !(i % cnt) ? prev.concat([a.slice(i, i + cnt)]) : prev, []);
    this.items = chunkArray(this.data, 3)
  }

  next() {
    if (this.active == this.items.length - 1) this.active = 0
    else this.active ++
  }

  back() {
    if (this.active == 0) this.active = this.items.length - 1
    else this.active --
  }

  plus() {
    this.add.emit()
  }

  pen(id) {
    this.edit.emit(id)
  }

  trash(box) {
    this.deletingItem = {...box, title: this.page}
  }

  eye(box) {
    box.visible = !box.visible
    this.visible.emit(box)
  }

  closeDeletingModal(result) {
    if (result) {
      this.delete.emit(this.deletingItem._id)
      const box = this.data.find(el => el._id == this.deletingItem._id)
      const index = this.data.indexOf(box)
      this.data.splice(index, 1)
      this.makeArray()
    } 
    this.deletingItem = null
  }

}
