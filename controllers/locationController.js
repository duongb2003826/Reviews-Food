const Location = require('../models/Location');
const User = require("../models/User");

const mongoose = require('mongoose');

const showMap = async (req, res) => {
    try {
        const locations = await Location.find({});
        res.json(locations);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error retrieving locations from database.'});
    }
}

const createLocation = async (req, res) => {
    try {
        const bodyParams = req.body;
        console.info("===========[] ===========[bodyParams] : ",bodyParams);
        const newLocation = await Location.create({...bodyParams});
        console.info("===========[] ===========[newLocation] : ",newLocation);
        res.status(200).send({message: 'Success', data: newLocation});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error retrieving locations from database.', message: error.message});
    }
}
const updateLocation = async (req, res) => {
    try {
        const bodyParams = req.body;
        console.log(bodyParams);

        // Using await to ensure the update operation completes before sending the response
        const updatedLocation = await Location.findByIdAndUpdate(bodyParams.idUpdate, {...bodyParams});

        if (!updatedLocation) {
            // If no location is found with the specified id, send a 404 Not Found response
            return res.status(404).json({error: 'Location not found.'});
        }

        // Sending a success message along with the updated location
        res.status(200).json({message: 'Location updated successfully.', updatedLocation});
    } catch (error) {
        console.error(error);
        // Sending a 500 Internal Server Error response for any unexpected errors
        res.status(500).json({error: 'Error updating location.'});
    }
}


const viewAll = async (req, res) => {
    try {
		console.log('category_id-------> ', req.query);
		let conditions = {};
		if(req.query?.category_id && req.query?.category_id != "") {
			conditions.category_id = req.query.category_id
		}
		if(req.query?.locationName && req.query?.locationName != "") {
			conditions.locationName = {$regex: req.query?.locationName, $options: 'i'}
		}
		if(req.query?.ownUser && req.query?.ownUser != "") {
			conditions.ownUser = req.query.ownUser
		}
		
		if(req.query?.sub_category && req.query?.sub_category != "") {
			let sub = req.query?.sub_category.split(',');
			if(sub?.length > 0) {
				let or = sub.reduce((newItem, item) => {
					newItem.push({sub_category: {$regex: item, $options: 'i'}});
					return newItem;
				}, []);
				conditions = {
					...conditions, $or: or
				}
			}
		}
		console.log("condition---------> ", JSON.stringify(conditions))
        const locations = await Location.find(conditions);
		
        res.status(200).send(locations);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const postCode = async (req, res) => {
    try {
        const pReq = req.params.postCode;
        const checkType = Number(pReq)
        let filter = {};

        if (checkType && typeof checkType !== 'string') {
            console.log('number');
            filter = await Location.find({postalCode: req.params.postCode});
        } else {
            // Assuming `locationName` has a text index
            let textSearch = req.params.postCode;
            console.info("===========[] ===========[req.params.postCode] : ",req.params.postCode);
            // filter = await Location.find({nameLocation: { $regex: '.*' + textSearch + '.*' } });
            // filter = await Location.find({nameLocation: req.params.postCode});
            filter = await Location.find({locationName: {$regex: textSearch, $options: 'i'}});
        }
        console.info("===========[] ===========[filter] : ",filter);
        res.status(200).send(filter);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};


const show = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id)
        res.status(200).send(location);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

const addBookmark = async (req, res) => {
    const user = await User.findById(req.body._id);
    if (user.bookmarks.find(b => b.toString() === req.params.id)) {
        return res.status(400).json({message: 'Location has already been added to your Bookmarks'});
    }
    try {
        const userId = req.body._id;
        const newBookmark = await User.findByIdAndUpdate(userId, {$push: {"bookmarks": req.params.id}}).exec();
        return res.status(200).json({message: 'Location has been added to your Bookmarks.'});
    } catch (error) {
        console.log('error:', error);
        return res.status(400).json({error: error.message});
    }
};

const deleteBookmark = async (req, res) => {
    try {
        const user = await User.findById(req.body._id);
        const userId = req.body._id;
        if (user.bookmarks.find(b => b.toString() == req.params.id)) {
            const deleteBookmark = await User.findByIdAndUpdate(userId, {$pull: {"bookmarks": req.params.id}}).exec();
            return res.status(201).json({message: 'Remove bookmark from list'});
        }
    } catch (error) {
        console.log('error:', error);
        return res.status(400).json({error: error.message});
    }
};

const addBookmarkCard = async (req, res) => {
    const user = await User.findById(req.body._id);
    if (user.bookmarks.find(b => b.toString() === req.body.locationId)) {
        return res.status(400).json({message: 'Location has already been added to your Bookmarks'});
    }
    try {
        const userId = req.body._id;
        const newBookmark = await User.findByIdAndUpdate(userId, {$push: {"bookmarks": req.body.locationId}}).exec();
        return res.status(200).json({message: 'Location has been added to your Bookmarks.'});
    } catch (error) {
        console.log('error:', error);
        return res.status(400).json({error: error.message});
    }
};


const deleteBookmarkCard = async (req, res) => {
    try {
        const user = await User.findById(req.body._id);
        const userId = req.body._id;
        if (user.bookmarks.find(b => b.toString() == req.body.locationId)) {
            const deleteBookmark = await User.findByIdAndUpdate(userId, {$pull: {"bookmarks": req.body.locationId}}).exec();
            return res.status(201).json({message: 'Remove bookmark from list'});
        }
    } catch (error) {
        console.log('error:', error);
        return res.status(400).json({error: error.message});
    }
};
const myRestaurant = async (req, res) => {
    try {

        const locations = await Location.find({}).populate('ownUser');
        const filter = locations.filter((item) => item.ownUser?._id == req.params.idUser)

        res.status(200).send(filter);
    } catch (error) {
        console.error("Error occurred while fetching locations:", error);
        res.status(400).json({error: error.message});
    }
}

const detailRestaurant = async (req, res) => {
    try {

        const locations = await Location.findOne({_id: req.params.idRestaurant}).populate('ownUser');
        res.status(200).send(locations);
    } catch (error) {
        console.error("Error occurred while fetching locations:", error);
        res.status(400).json({error: error.message});
    }
}

const searchLocation = async (req, res) => {
    try {
        const text = req.params.text;
        const locations = await Location.find({locationName: {$regex: text, $options: 'i'}}).populate('ownUser');
        res.status(200).send(locations);
    } catch (error) {
        console.error("Error occurred while fetching locations:", error);
        res.status(400).json({error: error.message});
    }
}

const deleteRestaurant = async (req, res) => {
    try {
        const location = await Location.deleteOne({_id: req.params.idRestaurant})

        if (location) {
            res.status(200).send(location);
        }
    } catch (error) {
        console.error("Error occurred while fetching locations:", error);
        res.status(400).json({error: error.message});
    }
}

const getDataRestaurant = async (req, res) => {
    try {
        const locations = await Location.find({}).select('_id locationName address latitude longitude reviews menus');

        const newArray = locations.map((item) => {
            const averageMenuPrice = item.menus.length > 0 ?
                item.menus.reduce((accumulator, menu) => accumulator + menu.price, 0) / item.menus.length :
                0;

            const averageRating = item.reviews.length > 0 ?
                item.reviews.reduce((accumulator, r) => accumulator + r.rating, 0) / item.reviews.length : 0;

            return {
                ...item.toObject(),
                averageMenu: averageMenuPrice,
                averageRating: averageRating
            };
        });

        res.status(200).send(newArray);
    } catch (error) {
        console.error("Error occurred while fetching locations:", error);
        res.status(400).json({error: error.message});
    }
}


module.exports = {
    showMap,
    viewAll,
    show,
    addBookmark,
    deleteBookmark,
    addBookmarkCard,
    deleteBookmarkCard,
    createLocation,
    postCode,
    myRestaurant,
    deleteRestaurant,
    detailRestaurant,
    updateLocation,
    getDataRestaurant,
    searchLocation
};