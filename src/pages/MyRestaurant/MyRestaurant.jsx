import { useState, useEffect } from "react";
import LocationCard from "../../components/LocationCard/LocationCard";
import { useNavigate } from "react-router-dom";
import PopUpAddLocation from "../../components/Map/PopUpAddLocation";
import CardRestaurant from "../../components/LocationCard/CardRestaurant";
import { getCategoryList } from "../../utilities/users-api";

const MyRestaurant = ( { user } ) =>
{
	const [ listRestaurant, setListRestaurant ] = useState( [] );
	const navigate = useNavigate();
	const [ isShowCreate, setIsShowCreate ] = useState( false );
	console.log( "user--------> ", user )

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
			const fetchMyRestaurant = async () =>
			{
				try
				{
					const response = await fetch( `/api/location/list-restaurant/${ user._id }` );
					const data = await response.json();

					setListRestaurant( data );
				} catch ( error )
				{
					console.log( "Error fetching bookmarks:", error );
				}
			};
			fetchMyRestaurant();
			getCategories();
		}
	}, [ user ] );

	const [ categories, setCategories ] = useState( [] );

	const getCategories = async () =>
	{
		const response = await getCategoryList();
		if ( response )
		{
			setCategories( response )
		}
	}

	return (
		<div>
			<div
				className="hero h-80"
				style={ {
					backgroundImage: `url("https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
				} }
			>
				<div className="hero-overlay bg-base-200 bg-opacity-50"></div>
				<div className="hero-content text-black">
					<div className="mb-2">
						<br />
						<p className="mb-4 text-5xl text-center font-bold" style={{ fontFamily: 'Cambria', fontSize: '66px' }}>
							My Restaurant
						</p>
					</div>
				</div>
			</div>

			<div className="m-20" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
				{
					user?.status == 1 && <a
						className={ `tab bg-[red] text-white rounded-lg mr-3` }
						onClick={ () => setIsShowCreate( true ) }
					>
						Add Location
					</a>
				}

				<div className="flex flex-wrap justify-center gap-20 mt-14 mb-20">
					{ listRestaurant.length > 0 ? (
						<>
							{ listRestaurant.map( ( location ) => (
								<div
									key={ location._id }
									style={ { width: '19%' } }
									className="card card-compact w-50 bg-base-100 shadow-xl"
								>
									<CardRestaurant location={ location } user={ user } categories={ categories } showReview={ true } />
								</div>
							) ) }
						</>
					) : (
						<h2>No Restaurant</h2>
					) }
				</div>
			</div>
			{ isShowCreate && (
				<PopUpAddLocation
					isShowCreate={ isShowCreate }
					categories={ categories }
					setIsShowCreate={ setIsShowCreate }
					user={ user }
				/>
			) }
		</div>
	);
};

export default MyRestaurant;
