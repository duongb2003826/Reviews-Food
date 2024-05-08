import React, { useEffect, useState } from 'react';
import { INIT_PAGING } from '../../utilities/common';
import { deleteUser, getListUser, updateUser } from '../../utilities/users-api';
import FormCreateOrUpdateUser from './FormCreateOrUpdateUser';
import { toast } from 'react-toastify';
import { FaBan } from "react-icons/fa";
import { TiTickOutline } from "react-icons/ti";
import { PagingPage } from '../../components/common/PagingCpn';

const UserPage = ( { user, isRestaurant } ) =>
{
	const [ open, setOpen ] = useState( false );
	const [ dataList, setDataList ] = useState( [] );
	const [ paging, setPaging ] = useState( INIT_PAGING );
	const [ detail, setDetail ] = useState( null );

	const triggerModalForm = ( item ) =>
	{
		setOpen( !open );
		setDetail( item );
	}

	useEffect( () =>
	{
		if ( !open )
		{
			setDetail( null )
		}
	}, [ open ] );

	const getDataList = async ( filters ) =>
	{
		const response = await getListUser( { ...filters, isRestaurant: isRestaurant } );
		console.log( "response user--------> ", response )
		if ( response?.status == 200 )
		{
			setDataList( response.data || [] );
			setPaging( response?.meta || INIT_PAGING );
		}
	}

	const handleDelete = async ( event, id ) =>
	{
		event.preventDefault();
		const response = await deleteUser( id );
		console.log( "response user--------> ", response )
		if ( response?.status == 200 )
		{
			toast.success( `Xóa thành công` )
			await getDataList( { page: 1, page_size: INIT_PAGING.page_size, isRestaurant: isRestaurant } );
		} else
		{
			toast.success( `Xóa thất bại` )
		}
	}

	const handleUpdateStatus = async ( event, id, status ) =>
	{
		event.preventDefault();
		const response = await updateUser( id, { status: status } );
		console.log( "response user--------> ", response )
		if ( response?.status == 200 )
		{
			toast.success( `Cập nhật thành công` )
			await getDataList( { page: 1, page_size: INIT_PAGING.page_size, isRestaurant: isRestaurant } );
		} else
		{
			toast.success( `Cập nhật thất bại` )
		}
	}

	const updateData = async ( item ) =>
	{
		setOpen( !open );
		setDetail( item );
		console.log( '-------------- update: ', item );
	}

	useEffect( () =>
	{
		getDataList( { ...paging } )
	}, [ isRestaurant ] );

	return (
		<>
			<div
				className="hero h-80"
				style={ {
					backgroundImage: `url("https://images.pexels.com/photos/5779170/pexels-photo-5779170.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
				} }
			>
			</div>
			<p className="mb-4 mt-14 text-5xl text-center font-bold" style={{ fontFamily: 'Cambria', fontSize: '45px', fontWeight: 'bold' }}>
				{ isRestaurant == 'Restaurant' ? 'DOANH NGHIỆP' : 'NGƯỜI DÙNG' }
			</p>
			<FormCreateOrUpdateUser open={ open } setOpen={ setOpen }
				detail={ detail } getDataList={ getDataList } 
				params={ paging } isRestaurant={ isRestaurant }
			/>
			<div className="flex flex-col gap-10 mx-32 mt-14" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
				<div className="rounded-sm px-5 pt-6 pb-2.5 shadow-default  sm:px-7.5 xl:pb-1">
					<div className={ 'mb-3 flex justify-end' }>
						<div
							onClick={ () => triggerModalForm( null ) }
							className="inline-flex items-center justify-center bg-primary py-2 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-5 xl:px-5 rounded-md cursor-pointer"
						>
							Thêm mới
						</div>
					</div>
					<div className="max-w-full overflow-x-auto">
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
										Thao tác
									</th>
								</tr>
							</thead>
							<tbody>
								{ dataList.map( ( item, key ) => (
									<tr key={ key }>
										<td className="border-b border-[#eee] py-5 px-4 pl-9  xl:pl-11">
											<div className={ 'flex' }>
												<div onClick={ () => updateData( item ) } className={ 'cursor-pointer hover:text-sky-500' }>
													<h5 className="font-medium text-black hover:text-sky-500">
														{ item.name }
													</h5>

												</div>
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
												className={ `inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${  item.status == 1 
													? 'bg-success text-success'
													: item.status == -1
														? 'bg-rose-600 text-[red]'
														: 'bg-warning text-warning'
													}` }
											>
												{ isRestaurant == 'User' && ( item.status == 1 ? 'Active' : 'Inactive' ) }
												{ isRestaurant == 'Restaurant' && ( item.status == 1 ? 'Approved' : ( item.status == -1 ? 'Rejected' : 'Pending' ) ) }

											</p>
										</td>
										<td className="border-b border-[#eee] py-5 px-4 ">
											<div className="flex items-center space-x-3.5 justify-center">
												<button className="hover:text-primary" onClick={ ( e ) => handleDelete( e, item._id ) }>
													<svg
														className="fill-current"
														width="18"
														height="18"
														viewBox="0 0 18 18"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
															fill=""
														/>
														<path
															d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
															fill=""
														/>
														<path
															d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
															fill=""
														/>
														<path
															d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
															fill=""
														/>
													</svg>
												</button>
												{ isRestaurant == 'Restaurant' && item.status == 2 && <>
													<FaBan className='text-xl hover:text-[red] cursor-pointer' onClick={ ( e ) => handleUpdateStatus( e, item._id, -1 ) } />
													<TiTickOutline className='text-2xl border cursor-pointer rounded-full hover:text-green-500 hover:border-green-500'
														onClick={ ( e ) => handleUpdateStatus( e, item._id, 1 ) }
													/>
												</> }
											</div>
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
			</div>
		</>
	);
};

export default UserPage;
