import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import PopUpUpdateLocation from "../Map/PopUpUpdateLocation";
import img1 from '../../assets/location.png'

const CardRestaurant = ( { location, user, ...props } ) =>
{

	const [ isShowCreate, setIsShowCreate ] = useState( false );
	const [ item, setItem ] = useState( "" )

	const handleDeleteRestaurant = async ( id ) =>
	{
		const response = await fetch(
			`/api/location/remove-restaurant/${ id }`,
			{
				method: 'DELETE',
				headers: {
					"Content-Type": "application/json",
				}
			}
		);

		if ( response )
		{
			toast.success( 'Delete success' );
			setTimeout( function ()
			{
				window.location.reload();
			}, 2000 );
		}

	}

	const handleUpdate = async ( id ) =>
	{
		fetch( `/api/location/detail-restaurant/${ id }` )
			.then( ( response ) => response.json() )
			.then( ( data ) =>
			{
				setItem( data )
				setIsShowCreate( true )
			} );

	}

	const isOpen = (openingTime, closingTime) => {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		let currentTime = hours + ":" + minutes;

		// Kiểm tra nếu phía sau giờ là PM thì cộng thêm 12 giờ
		if (currentTime.includes("PM")) {
			const hourString = currentTime.split(":")[0];
			const hour = parseInt(hourString, 10);
			if (hour !== 12) {
				currentTime = (hour + 12) + ":" + minutes;
			}
		}

		if (currentTime >= openingTime && currentTime <= closingTime) {
			return true;
		} else {
			return false;
		}
		};


		const displayOpeningTime = () => {
			const openingTime = location.openingTime;
			const closingTime = location.closingTime;
			const nextTime = `${closingTime} CH`; // Assuming closing time is PM

			if (isOpen(openingTime, closingTime)) {
				return (
					<p className="text-green-500">
						Open: {openingTime} SA - {nextTime}
					</p>
				);
			} else {
				return (
					<p className="text-red-500">
						Closed: {openingTime} SA - {nextTime}
					</p>
				);
			}
		};

	return (

		<div className="flex flex-col w-auto h-80 lg:flex-row">
			<div className="card card-compact bg-base-100 shadow-3xl hover:-translate-y-2 transition duration-200" style={ { width: '100%' } } >
				<figure>
					<img
						src={ location.image }
						style={ { width: '100%' } }
						alt="Location Image"
						className="w-full h-44 opacity-90 object-cover"
					/>
				</figure>
				<div className="card-body flex-wrap flex-row flex-col h-48 overflow-hidden" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
					<Link key={ location._id } to={ `/location/${ location._id }` }>
						<h2 className="card-title text-md line-clamp-1">
							{ location.locationName }
						</h2>
					</Link>
					<div className="text-sm flex items-center gap-2">
						{location.sub_category && (
							location.sub_category.split(',').map((subCategory, index) => (
								<button key={index} style={{ backgroundColor: 'lightgray', color: 'gray', borderRadius: '10px', width: 'auto', minWidth: '60px', fontFamily: 'Cambria', fontSize: '13px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}>
									{subCategory}
								</button>
							))
						)}
						</div>
						<div className="text-sm flex items-center gap-0">
							{displayOpeningTime()}
						</div>
					<div className="flex justify-between gap-2">
						{
							user?.status == 1 && <button
								className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-2 border border-amber-700 rounded"
								onClick={ () => handleUpdate( location._id ) }>
								Edit
							</button>
						}

						<button
							className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-2 px-2 ư"
							onClick={ () => handleDeleteRestaurant( location._id ) }>
							Delete
						</button>
						{ props.showReview && <Link key={ location._id } to={ `/user/my-restaurant-reviews/${ location._id }` }
							className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-2 border border-amber-700 rounded"
							onClick={ () => handleUpdate( location._id ) }>
							Review
						</Link> }

					</div>
					<div className="flex justify-between gap-2">

					</div>

				</div>
			</div>
			{ isShowCreate && (
				<PopUpUpdateLocation
					isShowCreate={ isShowCreate }
					setIsShowCreate={ setIsShowCreate }
					categories={ props.categories }
					user={ user }
					item={ item }
				/>
			) }
		</div>
	);
};

export default CardRestaurant;
