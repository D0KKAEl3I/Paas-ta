
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')
const session = require('express-session')
const router = require('express').Router();
const { Router } = require('express');

const { userModel, reportModel } = require('../models/users')
const images = require('../models/images');
const { placeModel, commentModel } = require('../models/places');
const { CONNREFUSED } = require('dns');

router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

const uploader = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'placeImg/');
        },
        filename: async (req, file, cb) => {
            const filename = new Date().valueOf() + path.extname(file.originalname)
            await images.create({ filename })
            cb(null, filename);
        }
    }),
});

router.post('/signup', (req, res, next) => {
    const { password, ...body } = req.body;

    if (password.length < 8) {
        res.status(500).json({ error: "비밀번호는 최소 8자 이상입니다." })
    } else {
        const salt = uuidv4();
        crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, key) => {
            if (err) {
                res.status(500).json(err)
            } else {
                userModel.create({ hash_password: key.toString("hex"), salt, ...body }).then((r) => {
                    res.json(r)
                }).catch(e => {
                    res.status(500).json(e);
                })
            }
        })
    }
})

router.post('/signin', (req, res) => {
    userModel.findOne({ id: req.body.id }).then(r => {
        if (r) {
            if (r.hash_password == crypto.pbkdf2Sync(req.body.password, r.salt, 10000, 64, 'sha512').toString('hex')) {
                req.session._id = r._id;
                req.session.id = r.id;
                req.session.username = r.username;
                req.session.first_name = r.first_name;
                req.session.last_name = r.last_name;
                res.json(req.session);
            } else {
                res.status(401).json({ error: "비밀번호가 올바르지 않습니다" })
            }
        } else {
            res.status(404).json({ error: "사용자를 찾을 수 없습니다." })
        }
    })
})

router.post('/add-place', (req, res, next) => {
    placeModel.insertMany(req.body).then(r => {
        res.send(true)
    }).catch(e => {
        console.log(e)
        res.status(500).send(e)
    })
})

router.get('/find-place', (req, res, next) => {
    placeModel.find().then(r => {
        res.json(r)
    })
})

router.post('/join', (req, res, next) => {
    userModel.create(req.body).then(r => {
        res.json(r)
    })
})

router.get('/lookup-place/:_id', (req, res, next) => {
    placeModel.findOne({ _id: req.params._id }).populate('comments.user', '_id username').then(r => {
        res.json(r);
    })
})

router.post('/add-comment/:_id', (req, res, next) => {
    const comment = new commentModel({ user: req.session._id, ...req.body });
    placeModel.updateOne({ _id: req.params._id }, { $push: { comments: comment } }).then(r => {
        res.json(true)
    })
})

router.post('/report', (req, res, next) => {
    const reports = new reportModel(req.body);
    userModel.updateOne({ _id: req.session._id }, { $push: { reports } }).then(r => {
        res.send('success')
    }).catch(e => {
        console.error(e)
        res.send('fail')
    })
})

router.post('/image', uploader.single('place'), (req, res, next) => {
    console.log('File uploaded')
    res.redirect('/imgList')
})

router.get('/imgList', (req, res, next) => {
    images.find().then(r => {
        console.log(r)
        res.render('showImage', { images: r })
    })
})

module.exports = router;