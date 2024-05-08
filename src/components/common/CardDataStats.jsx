import React from "react";


const CardDataStats = (props) => {
	return (
		<div className="flex gap-10 items-center rounded-sm border border-stroke bg-white px-7 py-6 shadow-default ">
			<div className="flex h-auto w-auto  items-center justify-center rounded-full bg-meta-2">
				{props.children}
			</div>
			<div className="mt-4 flex items-end justify-between">
				<div>
					<h4 className="text-title-md font-bold text-black ">
						{props.total}
					</h4>
					<span className="text-sm font-medium" style={{ fontFamily: 'Cambria', fontSize: '16px', fontWeight: 'bold' }}>{props.title}</span>
				</div>
			</div>
		</div>
	);
};

export default CardDataStats;
