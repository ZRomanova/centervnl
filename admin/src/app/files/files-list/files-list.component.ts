import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FilesService } from 'src/app/shared/transport/files.service';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.css']
})
export class FilesListComponent implements OnInit {

  files: any[] = []

  @ViewChild('uploads') fileInput: ElementRef

  constructor(
    private fileService: FilesService,
  ) { }

  ngOnInit(): void {
    this.fileService.fetch('server').subscribe(files => {
      this.files = files
      // console.log(files)
    }, error => {
      console.log(error.error)
    })
  }

  clickUploadButton() {
    this.fileInput.nativeElement.click()
  }

  uploadFiles(event) {
    let files = event.target.files
    event.preventDefault()
    this.fileService.upload(files).subscribe(result => {
      this.files = result.concat(this.files)
      files = null
    })
  }

  copyPath(text) {
    navigator.clipboard.writeText(text).then(function () {
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  deleteFile(item) {
    const decision = window.confirm(`
    Вы уверены, что хотите удалить файл? 
    Если файл используется на сайте, он перестанет отображаться. 
    Восстановить будет невозможно.`)

    if (decision) {
      this.fileService.delete('server', item.url).subscribe(result => {
        this.files = this.files.filter(el => el != item)
      })
    }
  }

  toggleGallery(item) {
    let obs$
    if (item.gallery) {
      obs$ = this.fileService.delete('gallery', item.url)
    } else {
      obs$ = this.fileService.create({ type: 'ФОТО', path: item.url })
    }
    obs$.subscribe(result => item.gallery = !item.gallery)
  }

}
