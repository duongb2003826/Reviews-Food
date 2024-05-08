const Blog = require( "../models/Blog" );

const create = async ( req, res ) =>
{
	
	try
	{
		const data = await Blog.create( req.body );
		res.status( 201 ).json( {
			status: 200,
			data: data
		} );
	} catch ( error )
	{
		console.log( error );
		res.status( 500 ).json( {message: error?.message, status: 400} );
	};
};

const getList = async ( req, res ) =>
{
	const page = req.query.page || 1; const page_size = req.query.page_size || 10;
	try
	{
		let condition = {};
		if (req.query?.name) {
			condition.name = {$regex : '.*'+ req.query.name.trim() + '.*'};
		}
		if ( req.query?.status )
		{
			condition.status = req.query?.status;
		}
		// execute query with page and limit values
		const users = await Blog.find()
			.where( condition )
			.limit( page_size )
			.skip( ( page - 1 ) * page_size )
			.exec();

		// get total documents in the Posts collection
		const count = await Blog.count().where( condition );

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
		const user = await Blog.findOne( { _id: req.params.id } )
		if ( !user )
		{
			return res.status( 400 ).json( { message: "Not found blog" } );
		}

		if ( data?.name?.length > 300 )
		{
			return res.status( 400 ).json( { message: "your name is too long" } );
		};
		const newUser = await Blog.findByIdAndUpdate( req.params.id, { ...data } );

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
		await Blog.deleteOne( { _id: req.params.id } )
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

const show = async ( req, res ) =>
	{
	
		try
		{
			
			res.status( 201 ).json( {
				data: await Blog.findById( { _id: req.params.id } ),
				status: 200
			} );
		} catch ( error )
		{
			console.log( error );
			res.status( 500 ).json( {message: error.message} );
		};
	};

module.exports = {
	create,
	getList,
	update,
	show,
	deleteUser
};