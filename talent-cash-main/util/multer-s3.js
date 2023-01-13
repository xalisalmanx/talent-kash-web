
const multer = require("multer");

const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
var config = require("../config");

let s3 = new S3Client({
  region: 'ap-northeast-1',
  credentials: {
    accessKeyId: config.s3AccessKeyId,
    secretAccessKey: config.s3SecretAccessKey,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

module.exports  = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'talentcash-storage-data',
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {

      var fileOriginalName = file.originalname;
      var newFileName = Date.now() + "-" + fileOriginalName.split(' ').join('-');
      if(file.fieldname == 'video'){
        var fullPath = 'videos/'+ newFileName;
      }
      else if(file.fieldname == 'song'){ 
        var fullPath = 'songs/'+ newFileName;
      }
      else{
        var fullPath = 'images/'+ newFileName;
      }
      
      cb(null, fullPath)
    }
  })
})