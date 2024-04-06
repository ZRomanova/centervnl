import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilesService } from 'src/app/shared/transport/files.service';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css']
})
export class GalleryListComponent implements OnInit {

  files: any[] = []
  form: FormGroup
  currentItem = null

  constructor(
    private fileService: FilesService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      url: new FormControl(null, Validators.required)
    })
    this.fileService.fetch('gallery').subscribe(files => {
      this.files = files
      // console.log(files)
    }, error => {
      console.log(error.error)
    })
  }

  copyPath(text) {
    navigator.clipboard.writeText(text).then(function () {
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  toggleEdit(item) {
    if (this.currentItem && this.currentItem._id == item._id) {
      this.fileService.update(item._id, item).subscribe(result => {
        item = result
        this.currentItem = null
      })
    } else if (!this.currentItem) this.currentItem = item
    else {
      this.fileService.update(this.currentItem._id, this.currentItem).subscribe(result => {
        this.currentItem = item
      })
    }
  }

  deleteItem(item) {
    const decision = window.confirm(`
    Вы уверены, что хотите удалить файл? 
    Файл перестанет отображаться в галерее, но будет отображаться в других местах на сайте, где используется. 
    Если файл загружен на диск, он будет отображаться во вкладке "Файлы на диске".
    Восстановить описание будет невозможно.`)

    if (decision) {
      this.fileService.delete('gallery', item.path).subscribe(result => {
        this.files = this.files.filter(el => el != item)
      })
    }
  }

  addByUrl() {
    if (this.form.valid) {
      this.fileService.create({ type: 'ФОТО', path: this.form.value.url }).subscribe(result => {
        this.files.push(result)
        this.form.reset()
      })
    }
  }

}
