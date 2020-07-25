import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {Post} from '../posts.model';
import {NgForm} from '@angular/forms';
import {PostsService} from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'post-create',
  templateUrl: 'post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})

export class PostCreateComponent implements OnInit {

  private mode = 'create';
  private postId: string;
  public post: Post;
  isLoading = false;

  constructor(public postService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {

    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // start showing spinner before fetching posts
        this.isLoading = true;
        // this.post = this.postService.getPost(this.postId);
        this.postService.getPost(this.postId).subscribe(postData => {
          //stop showing spinner after fethcing posts
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        })
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  // @Output() createPost = new EventEmitter<Post>();

  onSavePost(form: NgForm){
    if(form.invalid) {
      return;
    }
    // this.isLoading = true;

      // const post = {title: form.value.title, content: form.value.content};
    if(this.mode === 'create'){

      this.postService.addPost(form.value.title, form.value.content);
      form.reset();
      } else {
        this.postService.updatePost(this.postId, form.value.title, form.value.content);
      }

  }

}


