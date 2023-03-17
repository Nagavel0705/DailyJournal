//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const { username, password, port } = require('./config');

const homeStartingContent = `Welcome to Your Journal!

This is a place for you to document your daily thoughts, feelings, and experiences. Use it as a space to reflect on your day, track your progress, or simply jot down your ideas.

To get started, simply hit compose.

We encourage you to use your journal as a tool for self-reflection and growth. Take some time each day to sit down and write about your experiences. You might be surprised at what you discover about yourself!

If you have any questions or feedback, don't hesitate to get in touch with us. We're here to help you make the most of your daily journaling practice.

Happy writing!`;

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const mongoose = require('mongoose');
async function main(){

  await mongoose.connect('mongodb+srv://' + username + ':' + password + '@cluster0.1uj78k1.mongodb.net/blogDB');

  const postSchema = {
    title: String,
    content: String
  }

  const Post = mongoose.model("Post", postSchema);

  app.get("/", async function(req, res){
    const findItems = await Post.find();
    res.render("home", {startingContent: homeStartingContent, posts: findItems});  
  });
  
  app.get("/about", function(req, res){
    res.render("about", {aboutContent: aboutContent});
  });
  
  app.get("/contact", function(req, res){
    res.render("contact", {contactContent: contactContent});
  });
  
  app.get("/compose", function(req, res){
    res.render("compose");
  });
  
  app.post("/compose", async function(req, res){
    const post = new Post({
      title: req.body.postTitle,
      content : req.body.postBody
    })
  
    await post.save();
  
    res.redirect("/");
  
  });
  
  app.get("/posts/:postId", async function(req, res){
    console.log(req.params);
    const requestedID = req.params.postId;

    let storedID = await Post.findOne({_id: requestedID});    
    res.render("post", {
      title: storedID.title,
      content: storedID.content
    });
  
  });

  app.post("/delete", async function(req, res){
    const idToBeDeleted = req.body.del;
    await Post.deleteOne({_id: idToBeDeleted});
    res.redirect("/");
  })
  
  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
}

main();