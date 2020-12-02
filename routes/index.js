
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = require('express').Router();
const {userModel, reportModel} = require('../models/users')
const images = require('../models/images');
const places = require('../models/places')

const uploader = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'placeImg/');
    },
    filename: async (req, file, cb)=> {
      const filename = new Date().valueOf() + path.extname(file.originalname)
      await images.create({filename})
      cb(null, filename);
    }
  }),
});

router.post('/addPlace', (req,res,next)=>{
    places.insertMany(req.body).then(r=>{
        res.send(true)
    }).catch(e=>{
        res.status(500).send(e)
    })
})

router.get('/findPlace', (req,res,next)=>{
    places.find().then(r=>{
       res.json(r)
    })
})

router.post('/join', (req, res, next)=>{
    userModel.create(req.body).then(r=>{
      res.json(r)
    })
})

router.post('/report/:id', (req, res, next)=>{
    const reports = new reportModel(req.body);
    userModel.updateOne({_id: req.params.id},{$push:{reports}}).then(r=>{
      res.send('success')
    }).catch(e=>{
      console.error(e)
      res.send('fail')
    })
})

router.post('/image', uploader.single('place'),(req, res, next)=>{
    console.log('File uploaded')
    res.redirect('/imgList')
})

router.get('/imgList', (req, res, next)=>{ 
    images.find().then(r=>{
      console.log(r)
      res.render('showImage', {images: r})
    })
})

module.exports = router;