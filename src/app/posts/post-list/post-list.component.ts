import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {Post} from '../posts.model';
import {PostsService} from '../posts.service';

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
  private postsSub:Subscription;

ngOnInit() {
  this.isLoading = false;
  this.postService.getPosts();

  this.postsSub =  this.postService.getPostUpdateListener().subscribe( (post: Post[]) => {
    this.isLoading = false;
    console.log('post from post list compo', post);
    this.grabbedPost = post;
  });

}

onDelete(postId: string){
  this.postService.deletePost(postId);
}

ngOnDestroy(){
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
