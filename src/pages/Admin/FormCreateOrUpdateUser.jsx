import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { signUp, updateUser } from "../../utilities/users-api";
import { toast } from "react-toastify";
import SelectGroupTwo from "../../components/common/SelectGroupTwo";


const formData = {
	email: "",
	name: "",
	role: "USER",
	status: "1",
	password: "",
	isRestaurant: "",
}

// @ts-ignore
const FormCreateOrUpdateUser = ( { open, setOpen, detail, ...props } ) =>
{

	const cancelButtonRef = useRef( null )


	const [ form, setForm ] = useState( { ...formData } );
	const [ errorForm, setErrorForm ] = useState( { ...formData } );
	const [ statuses, setStatuses ] = useState( [
		{
			id: 1,
			name: 'Active'
		},
		{
			id: -1,
			name: 'Inactive'
		}
	] );



	const handleSubmit = async ( event ) =>
	{
		event.preventDefault();
		event.stopPropagation();
		let data = trimObjectValues( { ...form } );
		let objError = {
			...formData
		}
		let count = 0;
		if ( !data.name || data.name == '' )
		{
			objError.name = 'Name is required.'
			count++;
		}
		if ( !data.email || data.email == '' )
		{
			objError.email = 'email is required.'
			count++;
		}
		if ( !detail )
		{
			if ( !data.password || data.password == '' )
			{
				objError.password = 'Password is required.'
				count++;
			}
			if ( data?.password?.length < 8 || data?.password?.length > 12 )
			{
				objError.password = 'Password length is 8-12 characters.'
				count++;
			}
		}

		if ( count > 0 )
		{
			setErrorForm( objError );
			return;
		}

		let response = null;
		if ( detail || detail != null )
		{
			delete data.password;
			delete data.isRestaurant;
			delete data.role;

			response = await updateUser( detail._id, data );
		} else
		{

			response = await signUp( data );
		}

		console.log( '============ response: ', response );
		if ( ( detail && response.status == 200 ) || ( !detail && response ) )
		{
			toast.success( `${ detail ? 'Cập nhật thành công' : 'Tạo mới thành công' }` )
			setOpen( false );
			props.getDataList( { ...props.params } )
		} else
		{
			toast.error( response?.message || `${ detail ? 'Cập nhật thất bại' : 'Tạo mới thất bại' }` )

		}
	};
	function trimObjectValues ( obj )
	{
		for ( let key in obj )
		{
			if ( typeof obj[ key ] === 'string' )
			{
				obj[ key ] = obj[ key ].trim();
			}
		}
		return obj;
	}

	const resetForm = () =>
	{
		setForm( {
			...formData,
			isRestaurant: props?.isRestaurant,
			status: props?.isRestaurant == 'Restaurant' ? '2' : '1'
		} )
	}

	useEffect( () =>
	{
		if ( detail )
		{
			setForm( {
				email: detail?.email || "",
				name: detail?.name || "",
				role: detail?.role || "",
				status: detail?.status,
				password: "",
				isRestaurant: detail?.isRestaurant || props?.isRestaurant || "",
			} );

			if ( detail?.isRestaurant?.toLowerCase() == "restaurant" )
			{
				setStatuses( [
					{
						id: 1,
						name: 'Pending'
					},
					{
						id: -1,
						name: 'Rejected'
					},
					{
						id: 2,
						name: 'Approved'
					}
				] )
			} else
			{
				setStatuses( [
					{
						id: 1,
						name: 'Active'
					},
					{
						id: -1,
						name: 'Inactive'
					}
				] )
			}

		} else
		{
			resetForm();
			if ( props?.isRestaurant?.toLowerCase() == "restaurant" )
			{
				setStatuses( [
					{
						id: 2,
						name: 'Pending'
					},
					{
						id: -1,
						name: 'Rejected'
					},
					{
						id: 1,
						name: 'Approved'
					}
				] )
			} else
			{
				setStatuses( [
					{
						id: 1,
						name: 'Active'
					},
					{
						id: -1,
						name: 'Inactive'
					}
				] )
			}
		}

	}, [ open ] );


	// @ts-ignore
	// @ts-ignore
	return (
		<Transition.Root show={ open } as={ Fragment } appear>
			<Dialog as="div" className="relative z-10 inset-0 overflow-y-auto" initialFocus={ cancelButtonRef }
				onClose={ setOpen }>
				<Transition.Child
					as={ Fragment }
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div
						className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={ Fragment }
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel
								className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-lg">
								<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
									<div className="">
										<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
											<Dialog.Title as="h3"
												className="text-3xl mb-10 text-center font-semibold leading-6 text-gray-900">
												{ detail ? 'Cập nhật' : 'Thêm mới' }
											</Dialog.Title>
											<div className="mt-2">
												<form onSubmit={ handleSubmit }>
													<div className="mb-6">
														<label
															className="mb-2.5 block text-black ">
															Họ tên
														</label>
														<input
															type="text"
															value={ form.name }
															placeholder="Enter your full name"
															onChange={ ( e ) =>
															{
																let value = e && e.target.value || ""
																setForm( { ...form, name: value } )
															} }
															className={ `w-full rounded-lg border 
															${ errorForm.name != '' ? 'border-[red]' : 'border-stroke' }  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary` }
														/>
														{ errorForm.name != '' && <span className="text-[red] text-xl mt-3">{ errorForm.name }</span> }
													</div>

													<div className="mb-6">
														<label
															className="mb-2.5 block text-black ">
															Email
														</label>
														<input
															type="text"
															value={ form.email }
															placeholder="Enter your email"
															readOnly={ detail ? true : false }
															onChange={ ( e ) =>
															{
																if ( !detail )
																{
																	let value = e && e.target.value || ""
																	setForm( { ...form, email: value } )
																}
															} }
															className={ `w-full rounded-lg border 
															${ errorForm.email != '' ? 'border-[red]' : 'border-stroke' }  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary` }
														/>
														{ errorForm.email != '' && <span className="text-[red] text-xl mt-3">{ errorForm.email }</span> }
													</div>
													{ !detail && <div className="mb-6">
														<label
															className="mb-2.5 block text-black ">
															Pasword
														</label>
														<input
															type="password"
															value={ form.password }
															onChange={ ( e ) =>
															{
																let value = e && e.target.value || ""
																setForm( { ...form, password: value } )
															} }
															placeholder="8-12 Characters"
															className={ `w-full rounded-lg border 
															${ errorForm.password != '' ? 'border-[red]' : 'border-stroke' } 
															bg-transparent py-4 pl-6 pr-10  outline-none 
															focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary`}
														/>
														{ errorForm.password != '' && <span className="text-[red] text-xl mt-3">{ errorForm.password }</span> }

													</div> }
													<div className="mb-6">
														<SelectGroupTwo
															labelName={ 'Status' }
															options={ statuses }
															key_obj={ 'status' }
															value={ form.status }
															form={ form }
															setForm={ setForm }
														/>
													</div>


													<div
														className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
														<button
															type="submit"
															className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
														>
															{ detail ? 'Cập nhật' : 'Thêm mới' }
														</button>
														<button
															type="button"
															className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
															onClick={ () => setOpen( false ) }
															ref={ cancelButtonRef }
														>
															Huỷ bỏ
														</button>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default FormCreateOrUpdateUser;
