import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LocationReviews from "../LocationReviews/LocationReviews";
import LocationMap from "../../components/Map/LocationMap";
import Footer from "../../components/Footer";
import { StarFill } from "react-bootstrap-icons";
import VoteForm from "../../components/Map/voteForm";
import { BLOG_SERVICE } from "../../utilities/users-api";

const BlogDetail = ( { user } ) =>
{
	const { id } = useParams();
	const [ dataList, setDataList ] = useState( null );


	useEffect( () =>
	{

		if ( id )
		{
			getDataList( id );
		}


	}, [ id ] );


	const getDataList = async ( id ) =>
	{
		const response = await BLOG_SERVICE.show( id );
		console.log( "response --------> ", response )
		if ( response?.status == 200 )
		{
			setDataList( response.data );
		}
	}
	return (
		<div className="md:mx-32 mx-10">
			<div className="w-10/12 text-justify mt-10 flex items-center justify-between">
				<h1 className="text-4xl font-bold">{ dataList?.name }</h1>
			</div>
			<div className="flex items-center mb-4">
				<i className="text-gray-600 ">Created at: { new Date( dataList?.createdAt ).toLocaleDateString() }</i>
			</div>
			<br />
			<div className="my-10">
				<p className="mb-10">{ dataList?.description }</p>
				<img
					src={ dataList?.image }
					className="h-full w-full object-contain rounded-lg mx-auto"
					style={{ maxWidth:'500px', maxHeight: '500px' }}
				/>
			</div>
			<div className="text-justify py-6 my-8 rounded-lg">
				<h1 className="text-2xl font-bold mb-10">Description </h1>
				<p > { dataList?.content }</p>
			</div>
			<Footer />
		</div>
	);
};

export default BlogDetail;