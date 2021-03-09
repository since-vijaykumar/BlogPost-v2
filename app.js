//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const mongoose = require("mongoose");
// const ejs = require("ejs");
const app = express();

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// mongoose setup
// create mongodb connection
mongoose.connect("mongodb://localhost/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Successfully connected to DB.");
});

// create collection schema and collection
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res) {
  Blog.find({}, (err, blogs) => {
    // console.log(blogs);
    res.render("home", {
      home: "Home",
      homePageContents: homeStartingContent,
      posts: blogs
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    about: "About",
    aboutPageContents: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contact: "Contact",
    contactPageContents: contactContent
  });
});

app.get("/compose", (req, res) => {
  res.render("compose", {
    compose: "Compose"
  });
});

app.post("/compose", (req, res) => {
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };
  // posts.push(post);

  const newBlog = new Blog({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  newBlog.save(err => {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/post/:postName", (req, res) => {
  // let requestedTitle = lodash.lowerCase(req.params.postName);
  let requestedTitle = req.params.postName;

  Blog.findOne({_id: requestedTitle}, (err, blog) => {
    if (!err && blog) {
      //console.log("Blog clicked" + blog);
      res.render("post", {
        title: blog.title,
        content: blog.content
      });
    }
  });
  /*
  posts.forEach((post) => {
    if (lodash.lowerCase(post.title) === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
      // res.redirect("/post?title=" + post.title + "&content="+post.content);
    }
  }); */
});

app.get("/post", (req, res) => {
  res.render("post", {
    title: req.query.title,
    content: req.query.content
  });
});

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
