import { useState, useEffect } from "react";
import { AddLocation, AddReviewLocation, getCategoryList } from "../../utilities/users-api";
import { toast } from "react-toastify";
import SelectGroupTwo from "./FormSelect";
import React from "react";
import { Star, StarFill } from 'react-bootstrap-icons';


const VoteForm = ( { isReview, setIsReview, user, ...props } ) =>
{
	const [ form, setForm ] = useState( {
		content: "",
		rating: "",
		status: 1,

	} );

	useEffect( () =>
	{
		if ( isReview )
		{
			setForm( {
				content: "",
				rating: "",
				status: 1,
				// author_id: props?.data?.ownUser,
				// location_id: props?.data?._id,
				// user_id: user?._id,
			} )
		}
	}, [ isReview ] )

	const [ error, setError ] = useState( {} );

	const [ errorMenu, setErrorMenu ] = useState( [] )

	const handleChangeInput = ( type, text ) =>
	{
		setForm( {
			...form,
			[ type ]: text,
		} );
		// validation();
	};

	const validation = () =>
	{
		let objErr = {};
		let count = 0
		for ( const [ key, value ] of Object.entries( form ) )
		{
			console.log( `-------key: ${ key }-----value: ${ value }` )
			
			if ( !value )
			{
				objErr[ key ] = "Please full fill data";
				count++;
				continue;
			}
			if ( key == 'content' && form.content?.length < 4)
			{
				objErr[ key ] = "Content at least 4 characters";
				count++;
				continue;
			}
			if ( key == 'rating' && Number(form.rating) < 0)
			{
				objErr[ key ] = "Must be choose at least 1 star";
				count++;
				continue;
			}
		}
		setError( objErr );
		return count;
	};

	const handleSubmit = async () =>
	{
		let count = validation();

		if(count == 0) {
			if(Number(form.rating) == 0) {
				setError( { api: "Min rating value is 1" } );
				return;
			}
			try
			{
				let dataForm = {...form, rating: Number(form.rating)}
				const response = await fetch( `/api/reviews/${ props.data._id }`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify( { ...dataForm, user } ),
				} );
				if ( !response.ok )
				{
					throw new Error( "Failed to add review" );
				}
				const data = await response.json();
				if ( data )
				{
					toast.success( "Add success review" );
					setIsReview( false );
					// window.location.reload();
				} else {
					setError( { api: "Review failed" } );
	
				}
			} catch ( error )
			{
				console.error( error );
				setError( { api: error.message } );
			}
		}
	};


	return (
		<div
			id="default-modal"
			tabIndex={ 0 }
			aria-hidden="true"
			className="overflow-y-auto overflow-x-hidden fixed  justify-center items-center content-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full z-[100000]"
		>
			<div className="relative p-4 w-full max-w-2xl max-h-full m-auto">
				{/* Modal content */ }
				<div className="relative bg-white rounded-lg shadow dark:bg-gray-700" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
					{/* Modal header */ }
					<div
						className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
						<h3 className="text-2xl text-black font-semibold text-gray-900 dark:text-white">
							Review location
						</h3>
						<button
							type="button"
							onClick={ () => setIsReview( false ) }
							className="text-gray-400 text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
							data-modal-hide="default-modal"
						>
							<svg
								className="w-3 h-3"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={ 2 }
									d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
								/>
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
					</div>
					{/* Modal body */ }
					<div className="p-4 md:p-5 space-y-4">
						<h3 className="text-xl text-black text-center font-semibold text-gray-900 dark:text-white">
							{ props.data?.locationName }
						</h3>
						<div className="mb-5 w-full flex items-center justify-center review ">

							{
								[ ...Array( 5 ) ].map( ( item, index ) =>
								{
									if ( index < props.rating )
									{
										return (
											<StarFill key={ index }
												className={ `star text-2xl active ${ index > 0 ? 'ml-2' : '' }` }
												onClick={ () =>
												{
													handleChangeInput( 'rating', index + 1 )
												} }
											/>
										);
									}
									return (
										<StarFill key={ index }
											className={ `star text-2xl
											${ index > 0 ? 'ml-2' : '' } ${ index < Number( form?.rating || 0 ) ? 'active' : '' }` }
											onClick={ () =>
											{
												handleChangeInput( 'rating', index + 1 )
											} }
										/>
									);
								} )
							}
							{ error?.rating && (
								<p className="text-[red]">{ error?.rating }</p>
							) }
						</div>


						<div className="mb-5 w-full">
							<label className="block mb-2 text-black text-sm font-medium text-gray-900 dark:text-white">
								Content
							</label>
							<textarea
								className="textarea textarea-primary w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
								value={ form.content }
								minLength={ 4 }
								maxLength={ 100 }
								rows={ 5 }

								onChange={ ( event ) => handleChangeInput( "content", event.target.value ) }
							/>
							{ error?.content && (
								<p className="text-[red]">{ error?.content }</p>
							) }
						</div>
					</div>
					{ error?.api && (
						<p className="text-[red] p-4 md:p-5">{ error?.api }</p>
					) }

					{/* Modal footer */ }
					<div
						className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
						<button
							data-modal-hide="default-modal"
							type="button"
							onClick={ handleSubmit }
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							Submit
						</button>
						<button
							data-modal-hide="default-modal"
							type="button"
							className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div >
	);
};

export default VoteForm;
