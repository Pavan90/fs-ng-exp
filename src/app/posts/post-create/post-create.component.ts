import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {Post} from '../posts.model';
import {NgForm, FormGroup, FormControl, Validators} from '@angular/forms';
import {PostsService} from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

import {mimeType} from './mime-type.validator';

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
  form: FormGroup;
  imagePreview: string;

  constructor(public postService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {

    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content' : new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'image': new FormControl(null, {validators: [Validators.required],
        asyncValidators: [mimeType]  })

    });

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
          this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath: null};
          this.form.setValue({ //initializing form control values here
            'title': this.post.title,
            'content': this.post.content,
            'image': this.post.imagePath
          })
        })
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  // @Output() createPost = new EventEmitter<Post>();

  onImagePick(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity(); //this will validate the input
    console.log(file);
    console.log(this.form);
    const reader = new FileReader(); //file reader for image upload preview
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      console.log(this.imagePreview);

    }
    reader.readAsDataURL(file); //instructed to load the file

  }

  onSavePost(){
    if(this.form.invalid) {
      return;
    }
    // this.isLoading = true;

      // const post = {title: form.value.title, content: form.value.content};
    if(this.mode === 'create'){

      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
      // form.reset();
      } else {
        this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content);
      }
    this.form.reset();
  }


}


