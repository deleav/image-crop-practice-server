var express = require('express');
var fs = require('fs');
var im = require('imagemagick');
var router = express.Router();
// var multer = require('multer');

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + '.jpg');
//   }
// })

// // var upload = multer({ storage: storage });
// var upload = multer({ storage: storage }).single('avatar');

router.get('/', function( req, res, next ) {
  res.render('upload', { title: 'Pictures' });
});

router.get('/img', function( req, res, next ) {
  console.log( req.query );
  var w = req.query.w;
  var h = req.query.h;
  if ( w && h ) {
    im.convert(['./public/uploads/avatar.jpg', '-resize', `${w}x${h}`, `./public/uploads/avatar-${w}x${h}.jpg`],
      function(err, stdout){
        if (err) throw err;
        console.log('stdout:', stdout);
        return res.status(200).send({
          status: 200,
          img: `http://localhost:9000/uploads/avatar-${w}x${h}.jpg`
        });
      });
  }
  else if ( fs.existsSync( './public/uploads/avatar.jpg' ) )
    return res.status(200).send({
      status: 200,
      img: 'http://localhost:9000/uploads/avatar.jpg'
    });
  else
    return res.status( 500 ).send('File not found');
});

router.post('/upload', function(req, res, next) {
  // console.log( req.body );
  var img = req.body.img;
  var base64Data = req.body.img.replace(/^data:image\/jpeg;base64,/, "");
  require("fs").writeFile("./public/uploads/avatar.jpg", base64Data, 'base64', function(err) {
    if (err)
      res.status(500).send('save image failed');
    res.send( 'OK' );
  });
  // upload(req, res, function (err) {
  //     if (err) {
  //         console.log('err >>> ', err)
  //         return
  //     }
  //     console.log('res >>> ', req.body)
  //     var reqContent = 'OK<br>req.body:<pre>' + JSON.stringify(req.body) + '</pre><br><br>file info:<pre>'+ JSON.stringify(req.file)+'</pre>';
  //     res.send(reqContent);
  //     // console.log( req.body );
  //     // res.send(req.body);
  // })

  // for (var pair of req.body.entries()) {
  //     console.log(pair[0]+ ', ' + pair[1]);
  // }
  // console.log( req.body );
  // res.render('upload', { title: 'Pictures' });
})


module.exports = router;