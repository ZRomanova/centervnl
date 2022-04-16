import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.css']
})
export class SaveButtonComponent {

  @Input() text = 'Сохранить'
  @Output() saveClick = new EventEmitter<null>()

  save() {
    this.saveClick.emit(null)
  }
}
