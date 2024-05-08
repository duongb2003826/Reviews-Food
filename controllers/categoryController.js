const Category = require('../models/Category');

const getLists = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).send(categories);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const create = async (req, res) => {
    const {name, image} = req.body;

    try {
        const category = await Category.create(req.body);
        res.status(200).json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            res.status(401).json({message: "User or password is invalid"});
            return;
        }
        ;
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const payload = {user};
            const token = jwt.sign(payload, JWT_SECRET, {expiresIn: 60 * 60});
            res.status(200).json(token);
        } else {
            res.status(401).json({message: "User or password is invalid"});
        }
        ;
    } catch (error) {
        res.status(500).json(error);
    }
    ;
};

const showBookmarks = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({error: "User is missing"});
    }
    try {
        const showBookmarks = await User.findById(userId).populate({
            path: 'bookmarks',
            options: {strictPopulate: false}
        }).exec();
        res.json({showBookmarks});
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({error: "Server error"});
    }
};

module.exports = {
    create,
    login,
    getLists
};