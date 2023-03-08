import { Component, OnInit } from '@angular/core';
import { FilesService } from 'src/app/shared/transport/files.service';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css']
})
export class GalleryListComponent implements OnInit {

  files: any[] = []

  currentItem = null

  constructor(
    private fileService: FilesService,
  ) { }

  ngOnInit(): void {
    this.fileService.fetch('gallery').subscribe(files => {
      this.files = files
      // console.log(files)
    }, error => {
      console.log(error.error)
    })
  }

  copyPath(text) {
    navigator.clipboard.writeText(text).then(function() {
    }, function(err) {
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
    Если файл загружен на диск, он будет отобрадаться во вкладке "Файлы на диске".
    Восстановить описание будет невозможно.`)

    if (decision) {
      this.fileService.delete('gallery', item.path).subscribe(result => {
        this.files = this.files.filter(el => el != item)
      })
    }
  }

}
