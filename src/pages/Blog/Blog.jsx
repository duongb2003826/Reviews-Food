import React, { useState, useEffect } from "react";
import LocationCard from "../../components/LocationCard/LocationCard";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import Footer from "../../components/Footer";
import ImageSlider from "../../components/ImageSlider";
import { Link } from "react-router-dom";
import { BLOG_SERVICE } from "../../utilities/users-api";
import { INIT_PAGING } from "../../utilities/common";
import BlogItem from "./BlogItem";
import { PagingPage } from "../../components/common/PagingCpn";

const BlogAllPage = ( { user } ) =>
{

	const [ dataList, setDataList ] = useState( [] );
	const [ paging, setPaging ] = useState( INIT_PAGING );
	useEffect( () =>
	{


		getDataList();
	}, [] );
	const getDataList = async ( filters ) =>
	{
		const response = await BLOG_SERVICE.getList( { ...filters, page_size: 1000, status: 1 } );
		console.log( "response --------> ", response )
		if ( response?.status == 200 )
		{
			setDataList( response.data || [] );
			setPaging( response?.meta || INIT_PAGING );
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
			<h1 className="mb-4 mt-4 text-5xl text-center font-bold">
				Tin tức
			</h1>
			<div className="flex flex-wrap gap-5 mt-14 mb-20 md:mx-32 mx-10">
				{
					dataList?.length > 0 ? (
						dataList.map( ( location ) => (
							<div
								key={ location._id }
								className="md:w-[20%] w-[100%] card mb-10 card-compact w-48 bg-base-100 shadow-xl"
							>
								<BlogItem data={ location } />
							</div>
						) )
					) : (
						<h2 className="mb-10">No blog Found</h2>
					)
				}
			</div>
			{/* <div className="mt-3 py-5 md:mx-32 mx-10" >
				<PagingPage paging={ paging }
					setPaging={ setPaging }
					onPageChange={ ( e ) =>
					{
						getDataList( { page: e, page_size: paging.page_size } )
					} } />
			</div> */}
			<Footer />
		</>
	);
};

export default BlogAllPage;
