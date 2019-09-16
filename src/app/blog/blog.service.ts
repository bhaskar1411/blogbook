import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blog } from './blod.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/blog/';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private blogs: Blog[] = [];
  private blogsUpdated = new Subject<{blogs: Blog[], blogCount: number}>();

  constructor(private http: HttpClient,
              private router: Router) { }

  getBlogs(blogsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${blogsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, blogs: any, maxBlogs: number}>
    (BACKEND_URL + queryParams)
    .pipe(map((blogData) => {
      return {blogs: blogData.blogs.map(blog => {
        return {
          title: blog.title,
          content: blog.content,
          doc: blog.dateOfPost,
          id: blog._id,
          creator: blog.creator,
          createdBy: blog.createdBy
        };
      }), maxBlogs: blogData.maxBlogs};
    }))
    .subscribe(transformData => {
      this.blogs = transformData.blogs;
      this.blogsUpdated.next({
        blogs: [...this.blogs],
        blogCount: transformData.maxBlogs
      });
    });
  }

  getBlogUpdateListener() {
    return this.blogsUpdated.asObservable();
  }

  getBlog(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      dateOfPost: number,
      creator: string,
      createdBy: string
    }>(BACKEND_URL + id);
  }

  onPost(blogtitle: string, blogcontent: string){
    const blogData: Blog = {
      id: null,
      title: blogtitle,
      content: blogcontent,
      doc: null,
      creator: null,
      createdBy: null
    };

    this.http.post<{message: string}>
    (BACKEND_URL, blogData)
    .subscribe((blogRes) => {
      console.log(blogRes.message);
      this.router.navigate(['/list']);
    });
  }

  updateBlog(id: string, title: string, content: string) {
    const blog: Blog = {
      id: id,
      title: title,
      content: content,
      doc: null,
      creator: null,
      createdBy: null
    };
    this.http.put(BACKEND_URL + id, blog)
    .subscribe((response) => {
      // console.log(response);
      this.router.navigate(['/list']);
    });
  }

  deleteBlog(blogId: string) {
    return this.http.delete<{message: string}>
    (BACKEND_URL + blogId);
  }
}
