import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LocationReviews from "../LocationReviews/LocationReviews";
import LocationMap from "../../components/Map/LocationMap";
import Footer from "../../components/Footer";
import { StarFill } from "react-bootstrap-icons";
import VoteForm from "../../components/Map/voteForm";

const LocationDetails = ({ user }) => {
	const { id } = useParams();
	const [location, setLocation] = useState({});
	const [loadMenu, setLoadMenu] = useState(false);
	const [isBookmark, setIsBookmark] = useState(false);
	const [allLocation, setAllLocation] = useState([]);
	const [isReview, setIsReview] = useState(false);
	const [averageRating, setAverageRating] = useState(0);


	useEffect(() => {

		fetch("/api/location/restaurant")
			.then((response) => response.json())
			.then((data) => {
				const allData = data;

				if (id) {
					fetch(`http://127.0.0.1:8800/api/recommendation?idRestaurant=${id}&latitude=16.039768981206063&longitude=108.21134045068379`)
						.then((responses) => responses.json())
						.then((data) => {
							const resData = allData.map((item) => {
								if (data.includes(item._id)) {
									return {
										...item
									}
								}
							})


						})
				}


				// console.log( allData );
			});


	}, [id]);

	useEffect(() => {
		const fetchLocation = async () => {
			try {
				const response = await fetch(`/api/location/${id}`);
				const location = await response.json();
				setLocation(location);

				const average = calculateAverageRating(location.reviews);
				setAverageRating(average);
			} catch (err) {
				console.error(err);
			}
		};
		fetchLocation();
	}, [id]);

	useEffect(() => {
		const checkBookmark = async () => {
			if (user) {
				try {
					const response = await fetch(`/api/user/${user._id}/bookmarks`);
					const userBookmarks = await response.json();
					setIsBookmark(
						userBookmarks.showBookmarks.bookmarks.find(
							(b) => b._id.toString() === id
						)
					);
				} catch (err) {
					console.error(err);
				}
			}
		};
		checkBookmark();
	}, [id]);

	const handleBookmarkClick = async (event) => {
		event.preventDefault();
		try {
			const method = isBookmark ? "DELETE" : "POST";
			const response = await fetch(`/api/location/${id}/addBookmark`, {
				method: method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ _id: user._id }),
			});
			if (response.ok && method == "POST") {
				setIsBookmark(!isBookmark);
			} else if (response.ok) {
				setIsBookmark(!isBookmark);
			} else if (response.status === 400) {
				const data = await response.json();
				alert(data.message);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const loadMoreMenu = () => {
		setLoadMenu(!loadMenu);
	}

	// Hàm để tính điểm đánh giá trung bình từ danh sách đánh giá
	const calculateAverageRating = (reviews) => {
		if (reviews && reviews.length > 0) {
			const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
			return (totalRating / reviews.length).toFixed(1);
		}
		return 0;
	};

	// Hàm tạo các sao dựa trên điểm đánh giá trung bình
	const renderStars = () => {
		const stars = [];
		const rating = parseFloat(averageRating);
		for (let i = 0; i < 5; i++) {
			if (i < rating) {
				stars.push(
					<span key={i} className="text-yellow-500 text-2xl" style={{ margin: "0 0.1rem" }}>
						&#9733;
					</span>
				);
			} else {
				stars.push(
					<span key={i} className="text-gray-400 text-2xl" style={{ margin: "0 0.1rem" }}>
						&#9733;
					</span>
				);
			}
		}
		return stars;
	};

	const isOpen = (openingTime, closingTime) => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        let currentTime = hours + ":" + minutes;
    
        // Kiểm tra nếu phía sau giờ là PM thì cộng thêm 12 giờ
        if (currentTime.includes("PM")) {
            const hourString = currentTime.split(":")[0];
            const hour = parseInt(hourString, 10);
            if (hour !== 12) {
                currentTime = (hour + 12) + ":" + minutes;
            }
        }
    
        if (currentTime >= openingTime && currentTime <= closingTime) {
            return true;
        } else {
            return false;
        }
    };
        

    const displayOpeningTime = () => {
        const openingTime = location.openingTime;
        const closingTime = location.closingTime;
        const nextTime = `${closingTime} CH`; // Assuming closing time is PM

        if (isOpen(openingTime, closingTime)) {
            return (
                <p className="text-green-500">
                    Open: {openingTime} SA - {nextTime}
                </p>
            );
        } else {
            return (
                <p className="text-red-500">
                    Closed: {openingTime} SA - {nextTime}
                </p>
            );
        }
    };

	const colors = ['gray', 'yellowgreen', 'lightblue', 'red', 'orange', 'purple']; // Mảng các màu có sẵn

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]; // Chọn ngẫu nhiên một màu từ mảng colors
}

	return (
		<>
			<div className="w-10/12 text-justify my-8 flex items-center justify-between" style={{ fontFamily: 'Cambria' }}>
				<h1 className="text-4xl font-bold pl-40">{location.locationName}</h1>
			</div>
			<div className="flex items-center gap-5 ps-40 my-4">
				{location.sub_category && (
					location.sub_category.split(',').map((subCategory, index) => (
						<button key={index} style={{ backgroundColor: getRandomColor(), color: 'white', borderRadius: '10px', width: 'auto', minWidth: '60px', fontFamily: 'Cambria', fontSize: '14px', cursor: 'default' }}>
							{subCategory}
						</button>
					))
				)}
			</div>
			<div className="flex items-center ps-40 my-4" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
				{renderStars()}
				<p className="text-gray-500 ml-2">{averageRating} ({location.reviews && location.reviews.length} reviews)</p>
			</div>
			<div className="flex items-center ps-40 my-4" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
				{displayOpeningTime()}
			</div>
			<div className="flex items-center ps-40 my-4" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
				<img
					className="w-6 h-6 mr-2"
					src="https://i.ibb.co/m8VsQWF/houseicon.png"
				/>
				<p className="text-gray-800">{location.address}</p>
			</div>
			<br />
			<div className="flex flex-col w-full lg:flex-row justify-center px-20">
				<div className="w-3/5 lg:pr-0">
					<div className="grid h-32 card bg-base-100 rounded-box place-items-center rounded-lg">
						<img
							src={location.image}
							className="h-full w-full object-cover rounded-lg"
							style={{ width: "800px", height: "510px", opacity: 0.9 }}
						/>
					</div>
				</div>
				<div className="w-1/7 lg:pl-0">
					<div
						className="grid h-16 mb-2 card bg-base-200 rounded-box place-items-center rounded-lg"
						style={{ height: "180px", width: "400px" }}
					>
						<img
							className="w-96 h-36 rounded-lg object-cover opacity-90"
							src="https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
						/>
					</div>

					<div
						className="grid h-32 card bg-base-200 rounded-box place-items-center rounded-lg"
						style={{ height: "280px", width: "400px" }}
					>
						<div
							className="grid h-4/5 mt-2 mb-2 bg-base-200 rounded-box place-items-center rounded-lg"
							style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
						>
							<LocationMap
								id={id}
								style={{
									height: "300px",
									width: "100%",
									borderRadius: "0.5rem",
								}}
								height={300}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="w-9/12 h-6 text-justify py-6 mx-40 my-8 rounded-lg" >
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold" style={{ fontFamily: 'Cambria'}}>Description </h1>
					{!user ? (
						<></>
					) : (
						<div className="flex" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
							<button
								className="btn btn-sm gap-2 btn-outline btn-primary mr-2"
								onClick={handleBookmarkClick}
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
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
								{isBookmark ? "Added to Bookmarks" : "Bookmark"}
							</button>
							<button
								className="btn btn-sm gap-2 btn-outline btn-primary"
								onClick={() => {
									setIsReview(!isReview);
								}}
							>
								<StarFill />
								Review
							</button>
						</div>
					)}
				</div>
			</div>
			{isReview && (
				<VoteForm
					isReview={isReview}
					setIsReview={setIsReview}
					user={user}
					data={location}
				/>
			)}

			<div
				className="w-10/12 h-auto text-justify ps-40 mb-16 text-gray-800 text-sm tracking-wide"
				style={{ paddingTop: "20px", fontFamily: 'Cambria', fontSize: '16px' }}
			>
				{location.description}
				<br />
				<br />
				<br />
				Website:{" "}
				<a
					href={location.website}
					target="_blank"
					rel="noopener noreferrer"
					className="hover:underline text-cyan-600"
				>
					Click here
				</a>
				<br />
				<br />
			</div>
			<div className="w-9/12 text-justify py-6 mx-40 my-8 rounded-lg" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">Menu </h1>
					<button onClick={() => loadMoreMenu()}>View All</button>
				</div>

				<div className="flex items-center mt-6 flex-wrap" >
					{
						location && location?.menus && location?.menus.length > 0 && location?.menus.map((item, key) => (

							(loadMenu === false ? (
								(key <= 3 && (
									<div className="shadow-2xl w-fit p-4 rounded-md relative" key={key}
										style={{ width: '24%', marginRight: '1%', marginBottom: '20px' }}>

										<img className="h-44 w-44 rounded-full"
											style={{ width: "100%", height: '250px', objectFit: 'cover' }}
											src={item.linkFood} alt="" />
										<h1 className="font-bold text-xl mt-2"
											style={{ height: '60px' }}>{item.nameFood}</h1>
										<p className="font-light" style={{ height: '60px' }}>{item.description}</p>

										<div
											className="bg-white text-red-800 font-bold p-2 w-fit rounded-full absolute top-[30px] right-0">{item?.price && new Intl.NumberFormat('vi-VN').format(item?.price)}</div>
									</div>
								))
							) : (
								<div className="shadow-2xl w-fit p-4 rounded-md relative" key={key}
									style={{ width: '24%', marginRight: '1%', marginBottom: '20px' }}>

									<img className="h-44 w-44 rounded-full"
										style={{ width: "100%", height: '250px', objectFit: 'cover' }}
										src={item.linkFood} alt="" />
									<h1 className="font-bold text-xl mt-2" style={{ height: '60px' }}>{item.nameFood}</h1>
									<p className="font-light" style={{ height: '60px' }}>{item.description}</p>

									<div
										className="bg-white text-red-800 font-bold p-2 w-fit rounded-full absolute top-[30px] right-0">{item?.price && new Intl.NumberFormat('vi-VN').format(item?.price)}</div>
								</div>
							))
						))
					}
				</div>

			</div>
			<>
				<div className="w-10/12 text-justify ps-40 my-5 flex" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
					<h1 className="text-2xl font-bold">View All Reviews</h1>
					<img
						className="ml-3 w-8 h-8"
						src="https://i.ibb.co/F54cRjT/star.jpg"
						alt="star"
					/>
				</div>
				<LocationReviews location={location} user={user} />
			</>
			<>
				<div className="w-10/12 text-justify ps-40 my-5 flex items-center" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
					<h1 className="text-2xl font-bold">Recommendation Restaurant</h1>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
						stroke="currentColor" className="w-6 h-6 ml-3">
						<path strokeLinecap="round" strokeLinejoin="round"
							d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
					</svg>
				</div>
			</>
			<Footer />
		</>
	);
};

export default LocationDetails;