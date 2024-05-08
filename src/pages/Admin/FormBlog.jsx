import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { BLOG_SERVICE, signUp, updateUser } from "../../utilities/users-api";
import { toast } from "react-toastify";
import SelectGroupTwo from "../../components/common/SelectGroupTwo";


const formData = {
	content: "",
	name: "",
	description: "",
	status: "1",
	image: ""
}

// @ts-ignore
const FormBlog = ( { open, setOpen, detail, ...props } ) =>
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
		if ( !data.image || data.image == '' )
		{
			objError.image = 'image is required.'
			count++;
		}

		if ( count > 0 )
		{
			setErrorForm( objError );
			return;
		}

		let response = null;
		if ( detail || detail != null )
		{
			response = await BLOG_SERVICE.update( detail._id, data );
		} else
		{
			response = await BLOG_SERVICE.create( data );
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
		setForm( { ...formData } )
	}

	useEffect( () =>
	{
		if ( detail )
		{
			setForm( {
				content: detail?.content || '',
				name: detail?.name || '',
				description: detail?.description || '',
				status: detail?.status || '1',
				image: detail?.image || ''
			} );

		} else
		{
			resetForm();
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
										<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
											<Dialog.Title as="h3"
												className="text-3xl mb-10 text-center font-semibold leading-6 text-gray-900">
												{ detail ? 'Cập nhật' : 'Thêm mới' }
											</Dialog.Title>
											<div className="mt-2">
												<form onSubmit={ handleSubmit }>
													<div className="mb-6">
														<label
															className="mb-2.5 block text-black ">
															Title
														</label>
														<input
															type="text"
															value={ form.name }

															placeholder="Enter name"
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
															Image
														</label>
														<input
															type="text"
															value={ form.image }
															placeholder="Enter name"
															onChange={ ( e ) =>
															{
																let value = e && e.target.value || ""
																setForm( { ...form, image: value } )
															} }
															className={ `w-full rounded-lg border 
															${ errorForm.image != '' ? 'border-[red]' : 'border-stroke' }  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary` }
														/>
														{ errorForm.image != '' && <span className="text-[red] text-xl mt-3">{ errorForm.image }</span> }
													</div>

													
													<div className="mb-6">
														<label
															className="mb-2.5 block text-black ">
															Short description
														</label>
														<textarea
															rows={ 3 }
															value={ form.description }
															placeholder="Enter your description"
															onChange={ ( e ) =>
															{
																if ( !detail )
																{
																	let value = e && e.target.value || ""
																	setForm( { ...form, description: value } )
																}
															} }
															className={ `w-full rounded-lg border 
															${ errorForm.description != '' ? 'border-[red]' : 'border-stroke' }  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary` }
														/>
														{ errorForm.description != '' && <span className="text-[red] text-xl mt-3">{ errorForm.description }</span> }
													</div>
													<div className="mb-6">
														<label
															className="mb-2.5 block text-black ">
															Content
														</label>
														<textarea
															rows={ 5 }
															value={ form.content }
															placeholder="Enter your content"

															onChange={ ( e ) =>
															{
																if ( !detail )
																{
																	let value = e && e.target.value || ""
																	setForm( { ...form, content: value } )
																}
															} }
															className={ `w-full rounded-lg border 
															${ errorForm.content != '' ? 'border-[red]' : 'border-stroke' }  bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input  dark:focus:border-primary` }
														/>
														{ errorForm.content != '' && <span className="text-[red] text-xl mt-3">{ errorForm.content }</span> }
													</div>

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

export default FormBlog;
