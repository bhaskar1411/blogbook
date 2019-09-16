const Blog = require("../models/blog");

exports.createBlog = (req, res, next) => {
  const blogData = new Blog({
    title: req.body.title,
    content: req.body.content,
    dateOfPost: new Date(),
    creator: req.userData.userId,
    createdBy: req.userData.name
  });
 // console.log(req.userData);
  blogData.save().then(blogCreated => {
    res.status(201).json({
      message: "Blog created successfully!!"
    });
  })
}


exports.getBlogs = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const blogQuery = Blog.find();
  let fetchedBlog;
  if (pageSize && currentPage) {
    blogQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  blogQuery.then(documents => {
    fetchedBlog = documents;
    return Blog.countDocuments();
  })
  .then(count => {
    res.status(200).json({
      message: "Fetched successfully!!",
      blogs: fetchedBlog,
      maxBlogs: count
    });
  });
}

exports.getBlog = (req, res, next) => {
  Blog.findById({_id: req.params.id}).then(blog => {
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({message: 'Blog not found!!'});
    }
  });
}

exports.updateBlog = (req, res, next) => {
  const blog = new Blog({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    dateOfPost: new Date(),
    creator: req.userData.userId,
    createdBy: req.userData.name
  });
  Blog.updateOne({_id: req.params.id, creator: req.userData.userId}, blog).then(result => {
    if(result.nModified > 0) {
      res.status(200).json({
        message: "Blog updated successfully!!"
      });
    } else {
      res.status(401).json({
        message: "Not authorized to update"
      });
    }
  });
}

exports.deleteBlog = (req, res, next) => {
  Blog.deleteOne({_id: req.params.id, creator: req.userData.userId})
  .then( result => {
    if (result.n  > 0) {
      res.status(200).json({
        message: "Blog deleted successfully!!"
      });
    } else {
      res.status(401).json({
        message: "Not authorized to delete the blog"
      });
    }
  });
}
