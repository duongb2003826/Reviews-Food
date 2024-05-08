import React, { useEffect, useState } from "react";

const SelectGroupTwo= (props) => {
	const [selectedOption, setSelectedOption] = useState("");
	const [isOptionSelected, setIsOptionSelected] = useState(false);


	const changeTextColor = () => {
		setIsOptionSelected(true);
	};

	return (
		<div>
			{props.title && <label className="mb-3 block text-xl text-sm font-medium text-black dark:text-white">
				{props.title || 'Select Option'}
			</label>}

			<div className="relative z-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
				<select
					value={props.value || ''}
					onChange={(e) => {
						if(props.key_obj) {
							props.setForm( props.key_obj, e.target.value )
						} else {
							setSelectedOption(e.target.value);
							changeTextColor();
						}
						
					}}
					className={`relative z-20 w-full appearance-none rounded 
					border border-stroke bg-transparent px-5 py-3 outline-none 
					transition focus:border-primary active:border-primary 
					dark:border-form-strokedark dark:bg-form-input 
					${isOptionSelected ? "text-black dark:text-white" : ""
						}`}
				>
					<option value="" disabled className="text-body dark:text-bodydark p-2 ">
						Chọn {props.title}
					</option>
					{props?.options?.length > 0 && props.options.map((item, key) => {
						return (<option key={key} value={item._id} className="text-body text-black p-2">
							{item.name}
						</option>
						)
					})}
				</select>

				<span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g opacity="0.8">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
								fill="#637381"
							></path>
						</g>
					</svg>
				</span>
			</div>
		</div>
	);
};

export default SelectGroupTwo;