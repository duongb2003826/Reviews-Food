const moment = require( "moment" );
const User = require( "../models/User" );
const Location = require( "../models/Location" );

const daysInMonth = ( year, month ) => new Date( year, month, 0 ).getDate();
exports.monthlyStatistics = async ( req, res ) =>
{
	// destructure page and limit and set default values
	const page = req.query.page || 1; const page_size = req.query.page_size || 10;
	try
	{
		// execute query with page and limit values

		let condition = {};
		if ( req.query?.month )
		{
			let start_date = moment().month( req.query?.month - 1 ).startOf( 'month' ).format( 'yyyy-MM-DD HH:mm:ss' );
			let end_date = moment().month( req.query?.month - 1 ).endOf( 'month' ).format( 'yyyy-MM-DD HH:mm:ss' );
			condition = {
				createdAt: {
					$gte: new Date(start_date),
					$lte: new Date(end_date)
				}
			}
		} else
		{
			let start_date = moment().startOf( 'month' ).format( 'yyyy-MM-DD HH:mm:ss' );
			let end_date = moment().endOf( 'month' ).format( 'yyyy-MM-DD HH:mm:ss' );
			condition = {
				createdAt: {
					$gte: new Date(start_date),
					$lte: new Date(end_date)
				}
			}
		}
		console.log(condition)

		// console.log( '-------- KET: ', arrListDayMapping );
		const total_user = await User.count().where( {
			isRestaurant: 'User'
		} )
		// .where(condition);
		const total_user_in_month = await User.count().where( {
			isRestaurant: 'User',
			...condition
			// ...condition 
		}
		);
		let total_company = {
			company_pending: await User.count().where( {
				isRestaurant: 'Restaurant',
				status: 1
			} ),
			company_approved: await User.count().where( {
				isRestaurant: 'Restaurant',
				status: 2
			} ),
			company_rejected: await User.count().where( {
				isRestaurant: 'Restaurant',
				status: -1
			} ),
		};

		let users = await User.find()
			.where( { isRestaurant: 'Restaurant' } )
			.limit( page_size )
			.skip( ( page - 1 ) * page_size )
			.exec();
		let dataUser = [];

		// get total documents in the Posts collection
		const count = await User.count().where( { isRestaurant: 'Restaurant' } );
		if ( users?.length > 0 )
		{

			for ( let item of users )
			{
				let total_location = await Location.count().where({ownUser: item._id}) || 0;
				dataUser.push({...item._doc, total_location: total_location});
			}
		}

		// return response with posts, total pages, and current page
		const meta = {
			total_page: Math.ceil( count / page_size ),
			total: count,
			page: parseInt( page ),
			page_size: parseInt( page_size )
		}



		const status = 200;
		const data = {
			users: {
				total: total_user,
				current: total_user_in_month
			},
			total_company,
			companies: dataUser
		}
		res.json( {
			data,
			meta,
			status
		} );
	} catch ( err )
	{
		console.error( err );
	}
};
