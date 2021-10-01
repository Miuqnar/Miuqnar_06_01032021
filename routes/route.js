const express = require('express');
const router = express.Router();

const auth      = require('../middleware/auth');
const multer    = require('../middleware/multer_config');
const sauceCtrl = require('../controllers/sauceCtrl');


router.get   ('/', auth, sauceCtrl.getAllSauces);
router.post  ('/', auth, multer, sauceCtrl.postObjectCreate);
router.get   ('/:id', auth, sauceCtrl.getOneSauce);
router.put   ('/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post  ('/:id/like', auth, sauceCtrl.likeSauceAndDislike);

module.exports = router;