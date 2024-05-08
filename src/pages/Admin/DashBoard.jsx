import React, { useEffect, useState } from 'react';
import { INIT_PAGING } from '../../utilities/common';
import { deleteUser, getListUser, statistic, updateUser } from '../../utilities/users-api';
import CardDataStats from '../../components/common/CardDataStats';
import { IoBusinessOutline, IoBusinessSharp } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { PagingPage } from '../../components/common/PagingCpn';




const DashboardPage = ( { user, isRestaurant } ) =>
{
	console.log( user )
	const [ data, setData ] = useState( {
		users: null,
		total_company: null,
		companies: []
	} );

	console.log( 1 )
	const [ params, setParams ] = useState( {
		month: null,
	} );
	const [ paging, setPaging ] = useState( INIT_PAGING );

	const getDataList = async ( filters ) =>
	{
		const response = await statistic( { ...filters } );
		console.log( "response user--------> ", response )
		if ( response?.status == 200 )
		{
			setData( response.data || [] );
			setPaging( response?.meta || INIT_PAGING );
		}
	}

	useEffect( () =>
	{
		getDataList( { ...INIT_PAGING } )
	}, [] )

	const calculateTotalLocation = () => {
        let total = 0;
        data?.companies.forEach((item) => {
            total += item.total_location || 0;
        });
        return total;
    };

	return (
		<>
			<div
				className="hero h-80"
				style={ {
					backgroundImage: `url("https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
				} }
			>
			</div>
			<p className="mb-4 mt-10 text-5xl text-center font-bold" style={{ fontFamily: 'Cambria', fontSize: '45px', fontWeight: 'bold' }}>
				QUẢN LÝ DOANH NGHIỆP
			</p>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6 2xl:gap-7.5 mx-32 mt-14">

				<CardDataStats title="Total User" total={ data?.users?.total || 0 + "" }>
					<FaRegUserCircle className="fill-primary text-2xl" style={{fontSize: '35px'}}/>
				</CardDataStats>
				<CardDataStats title="User this month" total={ data?.users?.current || 0 + "" }>

					<CiUser className="fill-primary text-2xl" style={{fontSize: '35px'}}/>
				</CardDataStats>
				<CardDataStats title="Total Business" total={ ( paging?.total || 0 ) + "" }>
					<IoBusinessOutline className='text-warning text-2xl' style={{fontSize: '35px'}}/>
				</CardDataStats>
				<CardDataStats title="Total Restaurant" total={calculateTotalLocation()}>
					<IoBusinessSharp className='text-warning text-2xl'style={{fontSize: '35px'}}/>
				</CardDataStats>
			</div>
			<div className='mx-32 mt-10'>
				<p className="mb-4 mt-4 text-3xl text-center font-bold" style={{ fontFamily: 'Cambria', fontSize: '36px', fontWeight: 'bold' }}>
					Danh sách doanh nghiệp
				</p>
				<div className="max-w-full overflow-x-auto" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
					<table className="w-full table-auto">
						<thead>
							<tr className="bg-gray-2 text-left">
								<th className="min-w-[220px] py-4 px-4 font-medium text-black  xl:pl-11">
									Name
								</th>
								<th className="min-w-[150px] py-4 px-4 font-medium text-black ">
									Email
								</th>
								<th className="min-w-[150px] py-4 px-4 font-medium text-black ">
									Ngày tạo
								</th>
								<th className="min-w-[120px] py-4 px-4 font-medium text-black ">
									Trạng thái
								</th>
								<th className="py-4 px-4 font-medium text-black  justify-center flex">
									Total restaurant
								</th>
							</tr>
						</thead>
						<tbody>
							{ data?.companies.map( ( item, key ) => (
								<tr key={ key }>
									<td className="border-b border-[#eee] py-5 px-4 pl-9  xl:pl-11">
										<div className={ 'flex' }>
											<h5 className="font-medium text-black hover:text-sky-500">
												{ item.name }
											</h5>
										</div>
									</td>
									<td className="border-b border-[#eee] py-5 px-4 ">
										<p className="text-sm">{ item.email }</p>
									</td>
									<td className="border-b border-[#eee] py-5 px-4 ">
										<p className="text-sm">{ new Date( item.createdAt ).toLocaleDateString() }</p>
									</td>
									<td className="border-b border-[#eee] py-5 px-4 ">
										<p
											className={ `inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${ ( item.status == 1 && isRestaurant == 'User' ||
												item.status == 2 && isRestaurant == 'Restaurant'
											)
												? 'bg-success text-success'
												: item.status == -1
													? 'bg-rose-600 text-[red]'
													: 'bg-warning text-warning'
												}` }
										>
											{ isRestaurant == 'User' && ( item.status == 1 ? 'Active' : 'Inactive' ) }
											{ isRestaurant == 'Restaurant' && ( item.status == 1 ? 'Pending' : ( item.status == 2 ? 'Approved' : 'Rejected' ) ) }

										</p>
									</td>
									<td className="border-b border-[#eee] py-5 px-4 ">
										<p className="text-sm text-center">{ item.total_location }</p>

									</td>
								</tr>
							) ) }
						</tbody>
					</table>
				</div>
				<div className="mt-3 py-5" >
					<PagingPage paging={ paging }
						setPaging={ setPaging }
						onPageChange={ ( e ) =>
						{
							getDataList( { page: e, page_size: paging.page_size } )
						} } />
				</div>
			</div>
		</>
	);
};

export default DashboardPage;
