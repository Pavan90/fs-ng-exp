const express = require('express');
const router = express.Router();

const multer = require('multer');
const Post = require('../models/post'); // model created in mongoose db models -> post.js file.

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isvalid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isvalid){
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});


router.post('', multer({storage:storage}).single("image")  ,(req, res, next) => {
  // multer will process single file image and pass image in the request body
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "images/" + req.file.filename //this is the path we store db
  });
  console.log(post);
  // save() method provided by the mongoose package to save data to the cloud
  post.save().then( createdPostid => {
    res.status(201).json( {
      message: 'post added successfully',
      // post: {
      //   id: createdPostid._id,
      //   title: createdPostid.title,
      //   content: createdPostid.content,
      //   imagePath: createdPostid.imagePath
      // } //or down below code

      post : {
        ...createdPostid,
        id: createdPostid._id
      }
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

router.get('', (req, res, next) => { //fetching the posts here
  console.log(req.query);
  const pageSize = +req.query.pageSize; // plus is to convert to number if its a string
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  if(pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage + 1))
      .limit(pageSize);
  }

  postQuery.find().then(  (documents) => {
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
