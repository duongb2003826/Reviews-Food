import React, { useState, useEffect } from "react";
import LocationCard from "../../components/LocationCard/LocationCard";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import Footer from "../../components/Footer";
import ImageSlider from "../../components/ImageSlider";
import { Link, useParams } from "react-router-dom";
import { getCategoryList } from "../../utilities/users-api";

const LocationCategory = ( { user } ) =>
{
	const [ locations, setLocations ] = useState( [] );
	const [ filteredLocations, setFilteredLocations ] = useState( [] );

	const [ category, setCategory ] = useState( null );

	const { id } = useParams();
	useEffect( () =>
	{
		console.log('id-------------> ', id)
		if ( id )
		{
			let url = "/api/location/viewall?category_id="+id;
			fetch( url )
				.then( ( response ) => response.json() )
				.then( ( data ) =>
				{
					setLocations( data );
					setFilteredLocations( data );
				} );

			getCategories(id);
		}
	}, [ id ] );

	const getCategories = async ( id ) =>
	{
		console.log('category/'+id)
		const response = await getCategoryList();
		if ( response )
		{
			let cate = response?.find((item) => item._id == id);
			console.log('cate-------------> ', cate)
			setCategory( cate )
		}
	}
	console.log('category---==========> ', category)

	return (
		<>

		<div className="w-full mt-5 text-center">
			<h1 className=" text-3xl text-black"><strong>{category?.name}</strong></h1>
		</div>
			<div className="flex flex-wrap gap-5 mt-14 mb-20 ml-32">
				{
					filteredLocations?.length > 0 ? (
						filteredLocations.map( ( location ) => (
							<div
								key={ location._id }
								style={ { width: '19%' } }
								className="card card-compact w-48 bg-base-100 shadow-xl"
							>
								<LocationCard location={ location } user={ user } />
							</div>
						) )
					) : (
						<h2 className="mb-10">No Location Found</h2>
					)
				}

			</div>
			<Footer />
		</>
	);
};

export default LocationCategory;
