import React, { useState, useEffect } from "react";
import LocationCard from "../../components/LocationCard/LocationCard";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import Footer from "../../components/Footer";
import ImageSlider from "../../components/ImageSlider";
import { Link } from "react-router-dom";
import { getListUser } from "../../utilities/users-api";

const ViewAll = ( { user } ) =>
{
	const [ filteredLocations, setFilteredLocations ] = useState( [] );
	const [ filters, setFilters ] = useState( {
		locationType: "",
		selectedAgeGroups: [],
	} );
	const [ searchPostalCode, setSearchPostalCode ] = useState( [] );
	const [ categories, setCategories ] = useState( [] );
	const [ ownUser, setOwnerUser ] = useState( [] );

	const [ params, setParams ] = useState( {
		locationType: "",
		locationName: "",
		category_id: "",
		ownUser: ""
	} );

	useEffect( () =>
	{
		getDataList( params )
		getCategories();
		getOwnerUsers()
	}, [] );

	const getDataList = async ( filters ) =>
	{
		console.log(filters)
		const query = new URLSearchParams( { ...filters } ).toString();
		let url = "/api/location/viewall?" + query;
		await fetch( url )
			.then( ( response ) => response.json() )
			.then( ( data ) =>
			{
				setFilteredLocations( data );
			} );
	}
	const getCategories = () =>
	{
		let url = "api/category/lists";
		fetch( url )
			.then( ( response ) => response.json() )
			.then( ( data ) =>
			{
				let dataCate = data?.map( item =>
				{
					item.id = item._id;
					return item

				} )
				setCategories( dataCate );
			} );
	}

	const getOwnerUsers = async () =>
	{
		const response = await getListUser( {
			page: '1',
			page_size: '1000',
			isRestaurant: 'Restaurant',
		} );
		if ( response?.status == 200 )
		{
			let dataCate =  response.data?.map( item =>
				{
					item.id = item._id;
					return item

				} )
			setOwnerUser( dataCate || [] );
		}
	}


	return (
		<>
			<ImageSlider
				images={ [
					"https://cdn.pastaxi-manager.onepas.vn/content/uploads/articles/lentkdau/mauthietkenhahangdep/2.jpg",
					"https://phongcachmoc.vn/upload/images/tin-tuc/20%20mau%20nha%20hang%20dep/update-07-2022/Sushi-World-Ton-That-Thiep-10.JPG",
					"https://ipos.vn/wp-content/uploads/2019/08/thiet-ke-nha-hang-5.jpg",
					"https://posapp.vn/wp-content/uploads/2020/09/%C4%91%E1%BB%93ng-b%E1%BB%99-n%E1%BB%99i-th%E1%BA%A5t.jpg",
				] }
			/>

			<div className="md:flex md:mx-auto mx-10  mt-14">
				<div className="md:w-[18%] m-10">
					<CategoryFilter
						// handleFilter={ handleFilter }
						// searchPostalCode={ searchPostalCode }
						params={ params }
						setParams={ setParams }
						getDataList={ getDataList }
						categories={ categories }
						ownUser={ ownUser }
					// setSearchItem={ setSearchPostalCode }
					// handleFilterLocation={ handleFilterLocation } 
					/>
				</div>
				<div className="md:w-[70%] m-10">			
					<div className="flex flex-wrap gap-5 mb-20 justify-center md:justify-start">
						{
							filteredLocations?.length > 0 ? (
								filteredLocations.map( ( location ) => (
									<div
										key={ location._id }
										// style={ { width: '20%' } }
										className="card card-compact w-60 bg-base-100 shadow-xl mb-10"
									>
										<LocationCard location={ location } user={ user } />
									</div>
								) )
							) : (
								<h2 className="mb-10 text-center">No Location Found</h2>
							)
						}

					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default ViewAll;
