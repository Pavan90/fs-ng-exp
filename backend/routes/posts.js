const express = require('express');
const router = express.Router();

const Post = require('../models/post'); // model created in mongoose db models -> post.js file.




router.post('', (req, res, next) => {
  const post = new Post( {
    title: req.body.title,
    content: req.body.content
  });
  console.log(post);
  // save() method provided by the mongoose package to save data to the cloud
  post.save().then( createdPostid => {
    res.status(201).json( {
      message: 'post added successfully',
      postId: createdPostid._id
    });
  })

})

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id}, post).then( result => {
    res.sendStatus(200).json( {message: "Update Successful"});
  })
})

router.get('', (req, res, next) => {

  Post.find().then(  (documents) => {
    console.log(documents);
    res.status(200).json( {
      message: 'Posts Fetch Success!!',
      posts: documents
    })
  }).catch( ()=> {
    console.log("ERROR ACCESSING DOCUMENTS");
  })


});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then( post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json( {message: 'Post Not Found'});
    }
  })
})


router.delete("/:id", (req, res, next)=> {
  console.log(req.params.id);
  Post.deleteOne( {_id: req.params.id}).then( result => { // check the query documentation from mongoose for deleteone
    console.log(result);
    res.status(200).json( {message: 'Post Deleted'});

  })
});

module.exports = router;
