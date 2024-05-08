import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import React from "react";

const LocationReviews = ({ location, user }) => {
	const { id } = useParams();
	const [locationReviews, setLocationReviews] = useState([]);

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", options);
	};

	useEffect(() => {
		// const fetchLocationReviews = async () =>
		// {
		// 	try
		// 	{

		// 		const response = await fetch( `/api/review/lists?location_id=${ location?._id || '' }&user_id=${ user?._id || '' }` );
		// 		const data = await response.json();


		// 		setLocationReviews(data);
		// 	} catch ( err )
		// 	{
		// 		console.error( err );
		// 	}
		// };
		// fetchLocationReviews();
		const fetchLocationReviews = async () => {
			try {
				const response = await fetch(`/api/location/${id}`);
				const data = await response.json();
				// Add a date property to each review
				const reviewsWithDate = data.reviews.map((review) => ({
					...review,
					date: new Date(review.createdAt).toLocaleDateString(),
				}));

				setLocationReviews(reviewsWithDate);
			} catch (err) {
				console.error(err);
			}
		};
		fetchLocationReviews();
	}, []);

	const handleDelete = async (reviewId) => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this review?"
		);
		if (confirmed)
			try {
				const userId = user._id;
				const locationId = location._id;
				const response = await fetch(`/api/reviews/${reviewId}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ locationId, userId }),

				});
				const data = await response.json();
				console.log(data.message);
				if (!response.ok) {
					throw new Error(data.message);
				}
				// Remove the deleted review from the locationReviews state
				let newReviews = locationReviews?.filter(review => review._id !== reviewId)
				setLocationReviews(newReviews);
			} catch (error) {
				console.error(error);
				window.alert(error.message);
			}
	};

	console.log("-----locationReviews-----> ", locationReviews)

	return (
		<>
			<div className="flex flex-wrap px-40 gap-8 mt-10 " style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
				{locationReviews?.length > 0 ? (
					locationReviews.map((review) => {
						if (review?.status == 2) {
							return (
								<div
									key={review._id}
									className="card w-60 h-60 bg-base-100 shadow-xl mb-10 border-2"
								>
									<div className="flex m-5">
										<p className="text-xs mb-3 flex gap-3">
											<img
												className="w-8 h-8"
												src={user.avatar || "https://i.ibb.co/0YzqCQ4/children-playing-png-icon-transparent-png-modified.png"}
												alt="avatar"
											/>

											{review.user?.name || review.userName}
											<br />
											{formatDate(review.createdAt)}
										</p>
											<div style={{marginLeft: '55px'}}>
											{user && (review.userName === user.name || review.email == user.email) ? (
												<button
													className="btn btn-circle btn-xs btn-outline "
													onClick={() => handleDelete(review._id)}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M6 18L18 6M6 6l12 12"
														/>
													</svg>
												</button>
											) : (
												<></>
											)}
											</div>
									</div>
									<div className="card-body flex flex-col">
										<div className="flex justify-between items-center mb-2">
											<h3 className="card-title text-sm flex items-center">
												{Array.from({ length: review.rating }, (_, index) => (
													<img
														key={index}
														className="w-5 h-5"
														src="https://i.ibb.co/F54cRjT/star.jpg"
														alt="star"
													/>
												))}
											</h3>
										</div>

										<p className="text-sm">{review.content}</p>
									</div>
								</div>
							)
						}
						return <></>
					})
				) : (
					<>
						<div className="mb-6">No reviews yet.</div>
					</>
				)}
			</div>
		</>
	);
};

export default LocationReviews;
