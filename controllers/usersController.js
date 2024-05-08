const User = require( '../models/User' );
const Location = require( '../models/Location' )
const jwt = require( 'jsonwebtoken' );
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require( "bcrypt" );

const create = async ( req, res ) =>
{
	const { password, name } = req.body;
	if ( password.length < 3 )
	{
		return res.status( 400 ).json( { error: "your password is too short" } );
	};
	if ( password.length > 30 )
	{
		return res.status( 400 ).json( { error: "your password is too long" } );
	};
	if ( name.length > 100 )
	{
		return res.status( 400 ).json( { error: "your name is too long" } );
	};
	try
	{
		const user = await User.create( req.body );
		const payload = { user };
		const token = jwt.sign( payload, JWT_SECRET, { expiresIn: 60 * 60 } );
		res.status( 201 ).json( token );
	} catch ( error )
	{
		console.log( error );
		res.status( 500 ).json( error );
	};
};

const login = async ( req, res ) =>
{
	const { email, password } = req.body;
	try
	{
		const user = await User.findOne( { email } );
		if ( !user )
		{
			res.status( 401 ).json( { message: "User or password is invalid" } );
			return;
		};
		const match = await bcrypt.compare( password, user.password );
		if ( match )
		{
			const payload = { user };
			const token = jwt.sign( payload, JWT_SECRET, { expiresIn: 60 * 60 } );
			res.status( 200 ).json( token );
		} else
		{
			res.status( 401 ).json( { message: "User or password is invalid" } );
		};
	} catch ( error )
	{
		res.status( 500 ).json( error );
	};
};

const showBookmarks = async ( req, res ) =>
{
	const userId = req.params.id;
	if ( !userId )
	{
		return res.status( 400 ).json( { error: "User is missing" } );
	}
	try
	{
		const showBookmarks = await User.findById( userId ).populate( { path: 'bookmarks', options: { strictPopulate: false } } ).exec();
		res.json( { showBookmarks } );
	} catch ( error )
	{
		console.log( "Error:", error );
		res.status( 500 ).json( { error: "Server error" } );
	}
};

const getList = async ( req, res ) =>
{
	const page = req.query.page || 1; const page_size = req.query.page_size || 10;
	try
	{
		let condition = {};
		condition.role = { $ne: "ADMIN" };
		if ( req.query?.isRestaurant )
		{
			condition.isRestaurant = req.query?.isRestaurant;
		}
		if ( req.query?.status )
		{
			condition.status = req.query?.status;
		}
		// execute query with page and limit values
		const users = await User.find()
			.where( condition )
			.limit( page_size )
			.skip( ( page - 1 ) * page_size )
			.exec();

		// get total documents in the Posts collection
		const count = await User.count().where( condition );

		// return response with posts, total pages, and current page
		const meta = {
			total_page: Math.ceil( count / page_size ),
			total: count,
			page: parseInt( page ),
			page_size: parseInt( page_size )
		}
		const status = 200;
		const data = users
		res.json( {
			data,
			meta,
			status
		} );
	} catch ( error )
	{
		console.log( "Error:", error );
		res.status( 500 ).json( { error: "Server error" } );
	}
}

const update = async ( req, res ) =>
{

	try
	{
		const data = req.body;
		const user = await User.findOne( { _id: req.params.id } )
		if ( !user )
		{
			return res.status( 400 ).json( { message: "Not found user" } );
		}

		if ( data?.name?.length > 100 )
		{
			return res.status( 400 ).json( { message: "your name is too long" } );
		};
		console.log( data, { ...user, ...data } );
		const newUser = await User.findByIdAndUpdate( req.params.id, { ...data } );

		res.status( 201 ).json( {
			data: newUser,
			status: 200
		} );
	} catch ( error )
	{
		console.log( error );
		res.status( 500 ).json( error );
	};
};

const deleteUser = async ( req, res ) =>
{

	try
	{
		await User.deleteOne( { _id: req.params.id } )
		res.status( 201 ).json( {
			data: {},
			status: 200
		} );
	} catch ( error )
	{
		console.log( error );
		res.status( 500 ).json( error );
	};
};

module.exports = {
	create,
	login,
	showBookmarks,
	getList,
	update,
	deleteUser
};