import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlogService } from '../blog.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Blog } from '../blod.model';

@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css']
})
export class BlogCreateComponent implements OnInit {
  private mode = 'create';
  private blogId: string;
  blog: Blog;

  constructor(private blogService: BlogService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('blogId')) {
        this.mode = 'edit';
        this.blogId = paramMap.get('blogId');
        this.blogService.getBlog(this.blogId)
          .subscribe(blogData => {
            this.blog = {
              id: blogData._id,
              title: blogData.title,
              content: blogData.content,
              doc: blogData.dateOfPost,
              creator: blogData.creator,
              createdBy: blogData.createdBy
            };
          });
      } else {
        this.mode = 'create';
        this.blogId = null;
      }
    });
  }

  onPostBlog(form: NgForm) {
    if (form.invalid) {
      return;
    }

    if(this.mode === 'create') {
      this.blogService.onPost(form.value.title, form.value.content);
    } else {
      this.blogService.updateBlog(
        this.blogId,
        form.value.title,
        form.value.content,
      );
    }
    form.resetForm();
  }

}
