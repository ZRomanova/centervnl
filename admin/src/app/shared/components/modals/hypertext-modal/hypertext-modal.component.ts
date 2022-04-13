import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hypertext-modal',
  templateUrl: './hypertext-modal.component.html',
  styleUrls: ['./hypertext-modal.component.css']
})
export class HypertextModalComponent {

  @Output() close = new EventEmitter<null>()
  constructor() { }

  cross() {
    this.close.emit(null)
  }

}
