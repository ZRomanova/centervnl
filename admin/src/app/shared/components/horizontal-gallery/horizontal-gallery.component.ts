import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-horizontal-gallery',
  templateUrl: './horizontal-gallery.component.html',
  styleUrls: ['./horizontal-gallery.component.css']
})
export class HorizontalGalleryComponent {

  @Input() data = []
  @Output() delete = new EventEmitter<number>()

  trash(i) {
    this.delete.emit(i)
  }

}
