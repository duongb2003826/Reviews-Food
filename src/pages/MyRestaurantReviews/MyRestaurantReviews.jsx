import { useState, useEffect } from "react";
import LocationCard from "../../components/LocationCard/LocationCard";
import { useNavigate, useParams } from "react-router-dom";
import PopUpAddLocation from "../../components/Map/PopUpAddLocation";
import CardRestaurant from "../../components/LocationCard/CardRestaurant";
import { UpdateLocation, getCategoryList } from "../../utilities/users-api";
import React from "react";
import { StarIcons } from "../../components/Map/star";
import { toast } from "react-toastify";

const MyRestaurantReview = ( { user } ) =>
{
	const [ listData, setListData ] = useState( [] );
	const [ location, setLocation ] = useState( null );
	const navigate = useNavigate();
	const [ isShowCreate, setIsShowCreate ] = useState( false );
	const { id } = useParams();

	useEffect( () =>
	{
		if ( !user )
		{
			navigate( "/" );
		} else
		{
			if ( user.isRestaurant !== "Restaurant" )
			{
				navigate( "/" );
			}
			const fetchMyRestaurantReview = async () =>
			{
				try
				{
					const response = await fetch( `/api/location/${ id }` );
					const data = await response.json();
					setLocation( data );
					let listReviews = data.reviews || [];
					setListData( listReviews );
				} catch ( error )
				{
					console.log( "Error fetching reviews:", error );
				}
			};
			fetchMyRestaurantReview();
		}
	}, [ id ] );

	const formatDate = ( dateString ) =>
	{
		const options = { year: "numeric", month: "short", day: "numeric" };
		const date = new Date( dateString );
		return date.toLocaleDateString( "en-US", options );
	};

	const handleUpdateReview = async ( e, status, id ) =>
	{
		e.preventDefault();
		if ( location )
		{
			try
			{
				let reviews = listData.map((item, index) => {
					if(index == id) {
						item.status = status
					}
					return item;
				});
				
				const data = { ...location };

				const res = await UpdateLocation( {
					...data,
					reviews: reviews,
					idUpdate: location._id
				} );
				if ( res )
				{
					toast.success( "Update success location" );
					setListData(reviews);
					
				}
			} catch ( e )
			{

			}
		}
	}


	return (
		<div>
			<div
				className="hero h-80"
				style={ {
					backgroundImage: `url("https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
				} }
			>
				<div className="hero-overlay bg-base-200 bg-opacity-50"></div>
				<div className="hero-content text-white">
					<div className="mb-2">
						<br />
						<p className="mb-4 text-5xl text-center font-bold text-black" style={{ fontFamily: 'Cambria', fontSize: '56px' }}>
							Review { location?.locationName }
						</p>
					</div>
				</div>
			</div>

			<div className="m-20">
				<div className="max-w-full overflow-x-auto">
					{
						listData?.length > 0 ? (
							<table className="w-full table-auto" style={{ fontFamily: 'Cambria',  }}>
								<thead>
									<tr className="bg-gray-2 text-left dark:bg-meta-4">
										<th className="min-w-[150px] py-4 px-4 font-medium text-black ">
											User
										</th>
										<th className="min-w-[150px] py-4 px-4 font-medium text-black ">
											Content
										</th>
										<th className="min-w-[150px] py-4 px-4 font-medium text-black ">
											Rating
										</th>
										<th className="min-w-[120px] py-4 px-4 font-medium text-black ">
											Status
										</th>
										<th className="min-w-[150px] py-4 px-4 font-medium text-black ">
											Ngày tạo
										</th>
										<th className="py-4 px-4 font-medium text-black  justify-center flex">
											Thao tác
										</th>
									</tr>
								</thead>
								<tbody>
									{ listData.map( ( item, key ) => (
										<tr key={ key }>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black">
													{ item.userName }
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black">
													{ item.content }
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<StarIcons vote_number={ Number( item.rating ) } />
											</td>

											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p
													className={ `inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium 
													${ item.status === 1
															? 'bg-warning text-warning'
															: ( item.status === -1
																? 'bg-rose-700 text-[red]'
																: 'bg-success text-success' )
														}` }
												>
													{ item.status == 1 ? 'Pending' : ( item.status == -1 ?"Rejected" : "Approved"   ) }
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												<p className="text-black">
													{ formatDate( item.createdAt ) }
												</p>
											</td>
											<td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
												{ item.status == 1 && <div className="flex items-center space-x-3.5 justify-center">
													<button className="bg-lime-500 hover:bg-lime-700 text-white p-2  border-lime-700 rounded"
														onClick={ ( e ) => handleUpdateReview( e, 2, key ) }
													>
														Approved
													</button>
													<button className="bg-rose-500 hover:bg-rose-700 text-white p-2  border-rose-700 rounded"
														onClick={ ( e ) => handleUpdateReview( e, -1, key ) }>
														Rejected
													</button>
												</div> }
											</td>
										</tr>
									) ) }
								</tbody>
							</table>
						) : <p className="text-center text-2xl" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>No reviews</p>
					}
				</div>

			</div>
		</div>
	);
};

export default MyRestaurantReview;
