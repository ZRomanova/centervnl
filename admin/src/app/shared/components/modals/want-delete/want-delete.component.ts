import { Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-want-delete',
  templateUrl: './want-delete.component.html',
  styleUrls: ['./want-delete.component.css']
})
export class WantDeleteComponent  {

  @Input() title = ''
  @Input() text = ''

  @Output() result = new EventEmitter<boolean>()

  close(isDelete) {
    this.result.emit(isDelete)
  }

}
