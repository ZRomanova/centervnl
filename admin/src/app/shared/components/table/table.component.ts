import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() data = []
  @Input() noAdd
  @Input() columns = [2, 2, 5]
  @Input() title = ['Название', 'Дата', 'Описание']
  @Input() offset = 0
  @Output() edit = new EventEmitter<string>()
  @Output() create = new EventEmitter<null>()

  constructor() { }

  ngOnInit(): void {
  }

  pen(id) {
    this.edit.emit(id)
  }

  plus() {
    this.create.emit()
  }

}
