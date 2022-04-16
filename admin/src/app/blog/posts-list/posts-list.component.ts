import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/interfaces';
import { PostService } from 'src/app/shared/transport/post.service';

const STEP = 25

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {

  limit = STEP
  offset = 0

  oSub: Subscription
  posts: Post[]
  loading = false
  noMore = false
  filter: any = {
    'fields_date': 1,
    'fields_name': 1,
    'fields_description': 1,
    'fields_visible': 1,
    'fields_image': 1
  }

  constructor(private postsService: PostService,
    private datePipe: DatePipe,
    private router: Router) { }

  ngOnInit(): void {
    this.loading = true

    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.postsService.fetch(params).subscribe(posts => {
      this.posts = posts
      this.posts.forEach(post => {
        post.dateStr = `${this.datePipe.transform(post.date, 'dd.MM.yyyy')}`
      })
      this.noMore = posts.length < this.limit
      this.loading = false
    })
  }

  createPost(event) {
    this.router.navigate(['blog', 'new'])
  }

  editPost(id) {
    this.router.navigate(['blog', id])
  }

  loadMore(toEnd: boolean) {
    if (toEnd) this.offset += this.limit
    else this.offset -= this.limit
    this.loading = true
    this.fetch()
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }

}
