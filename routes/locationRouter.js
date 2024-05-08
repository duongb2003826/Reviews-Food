const express = require("express");
const locationController = require('../controllers/locationController')
const router = express.Router();
const authMiddleware = require('../config/checkToken')

router.get('/', locationController.showMap);
router.get('/viewall', locationController.viewAll);
router.get('/restaurant', locationController.getDataRestaurant)
router.get('/:id', locationController.show);
router.get('/post-code/:postCode', locationController.postCode);
router.post('/:id/addBookmark', authMiddleware, locationController.addBookmark)
router.post('/create-location', locationController.createLocation)
router.delete('/:id/addBookmark', authMiddleware, locationController.deleteBookmark)
router.post("/locationcard/addBookmarkCard", authMiddleware, locationController.addBookmarkCard);
router.delete("/locationcard/addBookmarkCard", authMiddleware, locationController.deleteBookmarkCard);

router.put('/update-location', locationController.updateLocation)
router.get('/list-restaurant/:idUser', locationController.myRestaurant);
router.delete('/remove-restaurant/:idRestaurant', locationController.deleteRestaurant);
router.get('/detail-restaurant/:idRestaurant', locationController.detailRestaurant);

router.get('/search-restaurant/:text', locationController.searchLocation);

module.exports = router;