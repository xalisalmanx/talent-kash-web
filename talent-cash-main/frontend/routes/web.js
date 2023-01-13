const express = require('express');
const router = express.Router();

var app = express();
app.use(express.json());


const homeController = require("../controllers/frontend/homeController.js");


router.get('/',homeController.index);
router.get('/videos',homeController.videos);
router.get('/video/:videoId',homeController.specificVideo);
router.get('/video-details',homeController.videoDetail);
router.get('/profile',homeController.profile);
router.get('/login',homeController.login);

router.get('/terms-and-conditions',homeController.tandc);
router.get('/privacy-policy',homeController.privacy_policy);
router.get('/about-us',homeController.about);

router.get('/app/about-us',homeController.about);
router.get('/app/privacy-policy',homeController.privacy_policy);
router.get('/app/terms-and-conditions',homeController.tandc);

router.get('/apple-app-site-association',homeController.apple);

router.get('/jazzCashCheckoutForIOS/:amount/:coins/:userId',homeController.jazzCashCheckoutForIOS);
router.post('/payWithJazzCash',homeController.payWithJazzCash);
router.get('/jazzcashSuccess',homeController.jazzcashSuccess);
router.get('/jazzcashError',homeController.jazzcashError);


module.exports = router;