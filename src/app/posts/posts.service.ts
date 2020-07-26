
import {Post} from './posts.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class PostsService {

    public posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();
    constructor(private http: HttpClient, private router: Router){}


    getPosts(postsPerPage:number, currentPage:number){
      const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
      // this.http.get<{message: string, posts: Post[]}}>('http://localhost:3000/api/posts').subscribe( (postData) => {
      //   console.log(postData);
      //   this.posts = postData.posts;
      // });
        // return [...this.posts]; //create new array with old objects. This will not effect original array

        this.http.get<{message: string; posts: any}>('http://localhost:3000/api/posts' + queryParams)
        // need to map the _id from db to id in client
        .pipe( map( (postData) => {
          return postData.posts.map( post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            }
          })
        }))
        .subscribe( (convertedPosts) => {
          console.log("service", convertedPosts);

          this.posts = convertedPosts;
          this.postsUpdated.next([...this.posts]);
        },
        (error) => {
          console.log("DATA IS NOT PASSING THROUGH", error);

        });

        return [...this.posts];
    }

    getPostUpdateListener(){
      return this.postsUpdated.asObservable(); //object we can listen but cant emit
    }

    getPost(id: string) {
      // return {...this.posts.find(p => p.id === id)};
      return this.http.get<{_id: string, title: string, content:string}>('http://localhost:3000/api/posts/' + id);
    }

    addPost(title: string, content: string, image: File){
        // const post: Post = {id: null, title: title, content: content};

      const postData = new FormData();
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title); //title is a file name

      this.http.post< {message: string, post: Post}>('http://localhost:3000/api/posts', postData).subscribe( (resData) => {
          const post: Post =
          {
            id: resData.post.id,
            title: title,
            content: content,
            imagePath: resData.post.imagePath
          }
          const id = resData.post.id;
          post.id = id;
            console.log(resData.message);
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
            this.router.navigateByUrl('/');
        });


    }

    updatePost(id:string, title: string, content: string){
      const post = { id: id, title: title, content: content, imagePath: null};
      this.http.put("http://localhost:3000/api/posts/" + id, post).subscribe( (res) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex( p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigateByUrl('/');
      })
    }


    deletePost(postId: string){
      this.http.delete("http://localhost:3000/api/posts/" + postId).subscribe( ()=> {
        console.log("Deleted!!!");

        const updatedPosts = this.posts.filter( post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);

      })
    }
}
