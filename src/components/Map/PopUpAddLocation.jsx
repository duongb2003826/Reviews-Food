import { useState, useEffect } from "react";
import { AddLocation, getCategoryList } from "../../utilities/users-api";
import { toast } from "react-toastify";
import SelectGroupTwo from "./FormSelect";
import { SUB_CATE } from "../../utilities/common";
const PopUpAddLocation = ( { isShowCreate, setIsShowCreate, user, ...props } ) =>
{
	const [form, setForm] = useState({
		locationName: "",
		address: "",
		image: "",
		description: "",
		website: "",
		latitude: "",
		openingTime: "", // Thêm trường giờ mở cửa
		closingTime: "",
		longitude: "",
		postalCode: "",
		category_id: "",
		sub_category: "",
		ownUser: user._id,
		menus: [],
	});



	const [ menu, setMenu ] = useState( [
		{
			nameFood: "",
			description: "",
			linkFood: "",
			price: 0
		},
	] );

	const [ error, setError ] = useState( "" );

	const [ errorMenu, setErrorMenu ] = useState( [] )
	const [showSubCategory, setShowSubCategory] = useState(false);
	
	const handleChangeInput = ( type, text ) =>
	{
		setForm( {
			...form,
			[ type ]: text,
		} );
		// validation();
		setShowSubCategory(true);
	};
	console.log( user )

	const validation = () =>
	{
		let objErr = {};
		for ( const [ key, value ] of Object.entries( form ) )
		{
			if ( key === 'postalCode' && value.length !== 6 )
			{
				objErr[ key ] = "postalCode == 6 character";
			}
			if ( key === 'website' && !value.startsWith( "https" ) )
			{
				objErr[ key ] = "Please website start width https"
			}
			if ( !value )
			{
				objErr[ key ] = "Please full fill data";
			}

			if ( value.length > 0 && value.length < 6 )
			{
				objErr[ key ] = "Text than more 6 charactor";
			}
		}
		setError( objErr );
	};

	const validationMenu = () =>
	{
		let ListError = []
		let isValid = true;
		menu.forEach( ( element, index ) =>
		{
			let objectError = {}
			if ( !element.nameFood )
			{
				objectError.nameFood = "Please enter"
				isValid = false
			}
			if ( !element.linkFood )
			{
				objectError.linkFood = "Please enter"
				isValid = false
			}
			if ( !element.description )
			{
				objectError.description = "Please enter"
				isValid = false
			}
			if ( !element.price )
			{
				objectError.price = "Please enter"
				isValid = false
			}
			ListError[ index ] = ( objectError )
		} );
		setErrorMenu( ListError )
		return isValid

	}

	const handleSubmit = async () =>
	{
		validation();
		const validate = validationMenu();


		if ( validate )
		{
			let data = { ...form };
			if ( data.category_id != "" )
			{
				data.category = props.categories?.find( ( item ) => item._id == data.category_id );
				let dataSub = subCategories.filter( item => item.checked )?.map( item => item.code )?.join( ',' );
				if ( dataSub && dataSub != '' )
				{
					data.sub_category = dataSub;
				} else
				{
					toast.error( "Please choose sub category" );
					return
				}

			} else
			{
				toast.error( "Please choose category" );
				return;
			}
			const res = await AddLocation( {
				...data,
				menus: menu
			} );
			if ( res )
			{
				toast.success( "Add success location" );
			}
			setIsShowCreate( false );
		}
	};

	const handleChangeFormMenu = ( key, value, index ) =>
	{
		setMenu( ( prevMenu ) =>
		{
			const updatedMenu = [ ...prevMenu ]; // Create a copy of the menu array
			updatedMenu[ index ] = { ...updatedMenu[ index ], [ key ]: value }; // Update the specified property
			return updatedMenu; // Return the updated array
		} );

		validationMenu()
	};

	const handleAddNewItemMenu = () =>
	{
		setMenu( ( prevMenu ) => [
			...prevMenu,
			{
				nameFood: "",
				description: "",
				linkFood: "",
				price: 0
			},
		] );
	};

	const removeItem = ( index ) =>
	{
		setMenu( ( prevMenu ) =>
		{
			const updatedMenu = [ ...prevMenu ]; // Create a copy of the menu array
			updatedMenu.splice( index, 1 ); // Remove the item at the specified index
			return updatedMenu; // Return the updated array
		} );
	};



	// const getCategories = async () => {
	// 	const response = await getCategoryList();
	// 	if(response) {
	// 		setCategories(response)
	// 	}
	// }
	const [ subCategories, setSubcategories ] = useState( [] );


	useEffect( () =>
	{
		if ( form.category_id )
		{
			let category = props.categories?.find( item => item._id == form.category_id );
			let key = category?.name == 'Đồ ăn' && 'FOOD' || 'DRINK'
			let sub = SUB_CATE.filter( item => item.type == key );
			setSubcategories( sub || [] )
		}
	}, [ form.category_id ] )

	const handleCheckBox = (e, index) => {
		// e.preventDefault();
		const updatedSubCategories = subCategories.map((item, i) => {
		  if (index === i) {
			return {
			  ...item,
			  checked: !item.checked // Đảo ngược trạng thái checked khi checkbox được nhấp
			};
		  }
		  return item;
		});
	  
		setSubcategories(updatedSubCategories);
	  
		// Lọc ra các phần tử đã được chọn và lưu vào mảng một chiều chỉ chứa tên
		const selectedSubCategories = updatedSubCategories
		  .filter(item => item.checked)
		  .map(item => item.name)
		  .join(',');
	  
		// Cập nhật giá trị của trường sub_category trong state form
		setForm({
		  ...form,
		  sub_category: selectedSubCategories
		});
	  };
	  


	return (
		<div
			id="default-modal"
			tabIndex={ 0 }
			aria-hidden="true"
			className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full z-[100000]"
		>
			<div className="relative p-4 w-full max-w-2xl max-h-full m-auto">
				{/* Modal content */ }
				<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
					{/* Modal header */ }
					<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white" style={{ fontFamily: 'Verdana' }}>
							Hãy tạo địa điểm mới!
						</h3>

						<button
							type="button"
							onClick={() => setIsShowCreate(false)}
							className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
									strokeWidth={2}
									d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
								/>
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
					</div>
					<div className="p-4 md:p-5 space-y-4">
						<div className="flex items-center justify-center gap-5">
							<div className="mb-5 w-full">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
									Tên địa điểm:
								</label>
								<input
									type="text"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required
									value={form.locationName}
									onChange={(e) =>
										handleChangeInput("locationName", e.target.value)
									}
								/>
								{error?.locationName && (
									<p className="text-[red]">{error?.locationName}</p>
								)}
							</div>
							<div className="mb-5 w-full">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
									Ảnh đại diện:
								</label>
								<input
									type="text"
									value={form.image}
									onChange={(e) => handleChangeInput("image", e.target.value)}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required
								/>
								{error?.image && <p className="text-[red]">{error?.image}</p>}
							</div>
						</div>
						<div className="flex items-center justify-center gap-5">
							<div className="mb-5 w-full">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
									Mô tả:
								</label>
								<textarea
									value={form.description}
									onChange={(e) =>
										handleChangeInput("description", e.target.value)
									}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-32 resize-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required
								/>
								{error?.description && (
									<p className="text-[red]">{error?.description}</p>
								)}
							</div>
						</div>
						<div className="flex items-center justify-center gap-5">
							<div className="mb-5 w-full">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
									Latitude
								</label>
								<input
									type="text"
									value={form.latitude}
									onChange={(e) =>
										handleChangeInput("latitude", e.target.value)
									}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required
								/>
								{error?.latitude && (
									<p className="text-[red]">{error?.latitude}</p>
								)}
							</div>
							<div className="mb-5 w-full">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
									Longitude
								</label>
								<input
									type="text"
									value={form.longitude}
									onChange={(e) =>
										handleChangeInput("longitude", e.target.value)
									}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required
								/>
								{error?.longitude && (
									<p className="text-[red]">{error?.longitude}</p>
								)}
							</div>
						</div>
						<div className="flex items-center justify-center gap-5">
							<div className="mb-5 w-full">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
									postalCode
								</label>
								<input
									type="text"
									value={form.postalCode}
									onChange={(e) =>
										handleChangeInput("postalCode", e.target.value)
									}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required
								/>
								{error?.postalCode && (
									<p className="text-[red]">{error?.postalCode}</p>
								)}
							</div>
							<div className="mb-5 w-full">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
									Địa chỉ:
								</label>
								<input
									type="text"
									value={form.address}
									onChange={(e) => handleChangeInput("address", e.target.value)}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required
								/>
								{error?.address && (
									<p className="text-[red]">{error?.address}</p>
								)}
							</div>
						</div>
						<div className="mb-5 w-full">
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
								Website
							</label>
							<input
								type="text"
								value={form.website}
								onChange={(e) => handleChangeInput("website", e.target.value)}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								required
							/>
							{error?.website && <p className="text-[red]">{error?.website}</p>}
						</div>
						<div className="mb-5 w-full">
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
								Nhóm
							</label>
							<SelectGroupTwo
								// title={ 'Phân loại' }
								options={props.categories}
								key_obj={'category_id'}
								value={form.category_id}
								form={form}
								setForm={handleChangeInput}
							/>
							{showSubCategory && (
								<>
									<label className="text-gray-900 dark:text-white text-sm font-medium" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
										Phân loại
									</label>
									<br />
									<div className="relative">
										<input
											type="text"
											// value={form.sub_category}
											onChange={(e) => setForm({ ...form, sub_category: e.target.value })}
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											required
										/>
										{form.sub_category && (
											<div className="absolute top-0 left-0 mt-2 ml-2 flex gap-2">
												{form.sub_category.split(',').map((item, index) => (
													<button
														key={index}
														className="bg-green-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg w-auto h-5 flex justify-center items-center"
													>
														{item}
													</button>
												))}
											</div>
										)}
									</div>




									<div className="mt-2 flex flex-wrap gap-5">
										{subCategories.map((item, index) =>
											<div className="flex items-center" key={index}>
												<input
													type="checkbox"
													value={item.code || ''}
													checked={item.checked}
													onChange={(e) => handleCheckBox(e, index)}
													className="bg-gray-50 border mr-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
													required
												/>
												<span onClick={(e) => handleCheckBox(e, index)} className="text-gray-900 dark:text-white text-nowrap">{item.name}</span>
											</div>
										)}
									</div>


								</>
							)}
						</div>

						{/* Thêm input cho giờ mở cửa và giờ đóng cửa */}
						<div className="flex items-center justify-center gap-5">
							<div className="mb-5 w-full">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
									Thời gian mở cửa:
								</label>
								<input
									type="time"
									value={form.openingTime}
									onChange={(e) =>
										handleChangeInput("openingTime", e.target.value)
									}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required
								/>
								{error?.openingTime && (
									<p className="text-[red]">{error?.openingTime}</p>
								)}
							</div>
							<div className="mb-5 w-full">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
									Thời gian đóng cửa:
								</label>
								<input
									type="time"
									value={form.closingTime}
									onChange={(e) =>
										handleChangeInput("closingTime", e.target.value)
									}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									required
								/>
								{error?.closingTime && (
									<p className="text-[red]">{error?.closingTime}</p>
								)}
							</div>
						</div>

						{/* Add menu */}
						<div className="flex items-center justify-between">
							<h1 className="font-bold text-gray-900 dark:text-white">Menu</h1>
							<svg
								onClick={handleAddNewItemMenu}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>
						</div>

						{menu?.length > 0 &&
							menu?.map((item, index) => (
								<div className="border-2 p-4 rounded-md relative" key={index}>
									<div className="flex gap-4">
										<div className="w-full">
											<label
												className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
												Name Food
											</label>
											<input
												type="text"
												value={menu[index].nameFood}
												onChange={(e) =>
													handleChangeFormMenu(
														"nameFood",
														e.target.value,
														index
													)
												}
												className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
												required
											/>
											{errorMenu[index]?.nameFood && (
												<p className="text-[red]">{errorMenu[index]?.nameFood}</p>
											)}
										</div>
										<div className="w-full">
											<label
												className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
												Link Image
											</label>
											<input
												type="text"
												value={menu[index].linkFood}
												onChange={(e) =>
													handleChangeFormMenu(
														"linkFood",
														e.target.value,
														index
													)
												}
												className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
												required
											/>
											{errorMenu[index]?.linkFood && (
												<p className="text-[red]">{errorMenu[index]?.linkFood}</p>
											)}
										</div>
									</div>
									<div className="flex gap-4">

										<div className="mb-5 w-full">
											<label
												className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
												Description
											</label>
											<input
												type="text"
												value={menu[index].description}
												onChange={(e) =>
													handleChangeFormMenu(
														"description",
														e.target.value,
														index
													)
												}
												className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
												required
											/>
											{errorMenu[index]?.description && (
												<p className="text-[red]">{errorMenu[index]?.description}</p>
											)}
										</div>
										<div className="mb-5 w-full">
											<label
												className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
												Price
											</label>
											<input
												type="number"
												value={menu[index].price}
												onChange={(e) =>
													handleChangeFormMenu(
														"price",
														e.target.value,
														index
													)
												}
												className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
												required
											/>
											{errorMenu[index]?.price && (
												<p className="text-[red]">{errorMenu[index]?.price}</p>
											)}
										</div>
									</div>
									{menu.length > 1 && (
										<div
											className="action border-2 w-fit rounded-md absolute top-[-15px] right-[20px] bg-white cursor-pointer"
											onClick={() => removeItem(index)}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M5 12h14"
												/>
											</svg>
										</div>
									)}
								</div>
							))}
					</div>
					{/* Modal footer */ }
					<div
						className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
						<button
							data-modal-hide="default-modal"
							type="button"
							onClick={ handleSubmit }
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							I accept
						</button>
						<button
							data-modal-hide="default-modal"
							type="button"
							className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
						>
							Decline
						</button>
					</div>
				</div>
			</div>
		</div >
	);
};

export default PopUpAddLocation;
