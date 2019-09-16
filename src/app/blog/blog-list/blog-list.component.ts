import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlogService } from '../blog.service';
import { Blog } from '../blod.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit, OnDestroy {

  blogList: Blog[] = [];
  totalBlog = 0;
  blogsPerPage = 2;
  currentPage = 1;
  pageSizeOption = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private blogSub: Subscription;
  private authSub: Subscription;
  constructor(public blogService: BlogService,
              private authService: AuthService) { }

  ngOnInit() {
    this.blogService.getBlogs(this.blogsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.blogSub = this.blogService.getBlogUpdateListener()
    .subscribe((blogData: {blogs: Blog[], blogCount: number}) => {
      this.blogList =  blogData.blogs;
      this.totalBlog = blogData.blogCount;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.blogsPerPage = pageData.pageSize;
    this.blogService.getBlogs(this.blogsPerPage, this.currentPage);
  }

  onDelete(blogId: string) {
    this.blogService.deleteBlog(blogId).subscribe(() => {
      this.blogService.getBlogs(this.blogsPerPage, this.currentPage);
    });
  }
  ngOnDestroy() {
    this.blogSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
