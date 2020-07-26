import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {Post} from '../posts.model';
import {PostsService} from '../posts.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit, OnDestroy{

  constructor(public postService: PostsService){

  }
  isLoading = false;
  grabbedPost: Post[] = [];
  totalPosts = 10;
  postsPerPage = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub:Subscription;

ngOnInit() {
  this.isLoading = false;
  this.postService.getPosts(this.postsPerPage, this.currentPage);

  this.postsSub =  this.postService.getPostUpdateListener().subscribe( (post: Post[]) => {
    this.isLoading = false;
    console.log('post from post list compo', post);
    this.grabbedPost = post;
  });

}

onChangePage(pageData: PageEvent){
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.postsPerPage = pageData.pageSize;
  console.log(pageData);
  this.postService.getPosts(this.postsPerPage, this.currentPage);

}

onDelete(postId: string){
  this.postService.deletePost(postId);
}

ngOnDestroy() {
  this.postsSub.unsubscribe();
}

  // posts = [ {
  //   title: 'first post',
  //   content: 'first post content'
  // },
  // {
  //   title: 'second post',
  //   content: 'second post content'
  // },
  // {
  //   title: 'third post',
  //   content: 'third post content'
  // }];


}
