import React, { useEffect, useState } from "react";
import SelectGroupTwo from "../../components/common/SelectGroupTwo";
import { SUB_CATE } from "../../utilities/common";
import img1 from '../../assets/location.png'

const CategoryFilter = ({ handleFilter, handleFilterLocation, setSearchItem, ...props }) => {
	const [locationType, setLocationType] = useState("");
	const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
	const [searchPostalCode, setSearchPostalCode] = useState([]);
	const [form, setForm] = useState({ ...props.params });

	const handleRadioChange = (event) => {
		setForm({ ...form, locationType: event.target.value });
		// handleFilter( { locationType: event.target.value, selectedAgeGroups } );
	};

	const handleCheckboxChange = (event) => {
		const ageGroup = event.target.value;
		if (selectedAgeGroups.includes(ageGroup)) {
			setSelectedAgeGroups(
				selectedAgeGroups.filter((group) => group !== ageGroup)
			);
		} else {
			setSelectedAgeGroups([...selectedAgeGroups, ageGroup]);
		}
		handleFilter({
			locationType,
			selectedAgeGroups: [...selectedAgeGroups, ageGroup],
		});
	};

	const handleReset = (event) => {
		event.preventDefault();
		// setLocationType( "" );
		// setSelectedAgeGroups( [] );
		// handleFilter( {
		// 	locationType: "",
		// 	selectedAgeGroups: [],
		// } );
		// setSearchItem( [] )
		setForm(
			{
				locationType: "",
				locationName: "",
				category_id: "",
				sub_category: "",
				ownUser: ""
			}
		);
		props.setParams({
			locationType: "",
			locationName: "",
			category_id: "",
			sub_category: "",
			ownUser: ""
		});
		props.getDataList({
			locationType: "",
			locationName: "",
			category_id: "",
			sub_category: "",
			ownUser: ""
		})

	};

	const handleSearch = (e) => {
		e.preventDefault();

		let sub = subCategories.filter(item => item.checked)?.map(item => item.code)?.join(',')

		// handleFilterLocation( searchPostalCode )
		props.setParams({ ...form, sub_category: sub })
		props.getDataList({ ...form, sub_category: sub })
	}

	const [subCategories, setSubcategories] = useState([]);


	useEffect(() => {
		if (form.category_id) {
			let category = props.categories?.find(item => item._id == form.category_id);
			let key = category?.name == 'Đồ ăn' && 'FOOD' || 'DRINK'
			let sub = SUB_CATE.filter(item => item.type == key);
			setSubcategories(sub || [])
			console.log("change cate-----> ", sub)
		}
	}, [form.category_id]);

	const handleCheckBox = (e, index) => {
		// e.preventDefault();
		let sub = subCategories.map((item, i) => {
			if (index == i) {
				item.checked = !item.checked;
			}
			return item;
		});

		setSubcategories(sub)

	}

	return (
		<>
			<div className="" style={{ fontFamily: 'Cambria' }}>
				<p className="text-2xl mb-0">
					<strong>Filter by</strong>
				</p>
				<div className="mt-5">
					<p className="font-bold mb-4" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
						Tìm từ khóa:
					</p>
					<input
						className="input input-sm input-bordered input-primary w-full max-w-xs"
						type="text"
						placeholder="Enter text name location"
						value={form.locationName}
						onChange={(e) => setForm({ ...form, locationName: e.target.value })}

					/>
				</div>
				<div className="mt-5">
					<SelectGroupTwo
						labelName={
							<label style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
								Nhóm:
							</label>

						}
						options={props.categories}
						show_image={true}
						key_obj={'category_id'}
						value={form.category_id}
						form={form}
						setForm={setForm}
					/>
					{form.category_id && <>
						<p className="font-bold mt-5" style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
							Thể loại:
						</p>
						<div className="mt-2 grid grid-cols-2 flex">
							{subCategories.map((item, index) => (
								<div className="flex items-center" key={index} style={{ textAlign: 'left' }}>
									<input
										type="checkbox"
										value={item.code || ''}
										checked={item.checked}
										onChange={(e) => handleCheckBox(e, index)}
										className="bg-gray-50 border mr-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										required
									/>
									<span onClick={(e) => handleCheckBox(e, index)} className="text-nowrap">{item.name}</span>
								</div>
							))}
						</div>




					</>}
				</div>
				<div className="mt-5">
					<SelectGroupTwo
						labelName={
							<label style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
								Owner:
							</label>
						}
						options={props.ownUser}
						show_image={true}
						key_obj={'ownUser'}
						value={form.ownUser}
						form={form}
						setForm={setForm}
					/>
				</div>

				<div className="flex justify-between mt-5">
					<button
						className="btn ml-2 mr-6 btn-primary btn-sm text-black"
						type="submit"
						onClick={(e) => handleSearch(e)}
						style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}
					>
						Tìm kiếm
					</button>
					<button
						type="submit"
						onClick={handleReset}
						className="btn ml-2 mr-6 btn-secondary btn-sm text-black"
						style={{ fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}
					>
						Reset
					</button>
				</div>
			</div>
		</>
	);
};

export default CategoryFilter;
