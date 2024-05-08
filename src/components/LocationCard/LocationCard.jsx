// LocationCard.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import img1 from "../../assets/img2.png";

const LocationCard = ({ location, user }) => {
    const [isBookmark, setIsBookmark] = useState(false);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const checkBookmark = async () => {
            if (user) {
                try {
                    const response = await fetch(`/api/user/${user._id}/bookmarks`);
                    const userBookmarks = await response.json();
                    setIsBookmark(
                        userBookmarks.showBookmarks.bookmarks.find(
                            (b) => b._id === location._id
                        )
                    );
                } catch (err) {
                    console.error(err);
                }
            }
        };
        checkBookmark();
    }, [user]);

    useEffect(() => {
        // Tính điểm đánh giá trung bình từ danh sách đánh giá
        const calculateAverageRating = () => {
            if (location.reviews && location.reviews.length > 0) {
                const totalRating = location.reviews.reduce(
                    (acc, curr) => acc + curr.rating,
                    0
                );
                const average = (totalRating / location.reviews.length).toFixed(1);
                return average;
            }
            return 0;
        };

        setAverageRating(calculateAverageRating());
    }, [location]);

    const handleLocationBookmarkClick = async (event) => {
        event.preventDefault();
        try {
            const method = isBookmark ? "DELETE" : "POST";
            const response = await fetch(
                `/api/location/locationcard/addBookmarkCard`,
                {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ _id: user._id, locationId: location._id }),
                }
            );
            if (response.ok && method === "POST") {
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

    return (
        <Link key={location._id} to={`/location/${location._id}`}>
            <div className="flex flex-col w-auto h-80 lg:flex-row" style={{ width: '100%' }}>
                <div className="card card-compact bg-base-100 shadow-3xl hover:-translate-y-2 transition duration-200" style={{ width: '100%' }}>
                    <figure>
                        <img
                            src={location.image}
                            alt="Location Image"
                            style={{ width: '100%' }}
                            className="w-full h-44 opacity-90 object-cover"
                        />
                    </figure>
                    <div className="flex flex-col">
                        <div className="mt-3 ml-3">
                            <label className="card-title text-md line-clamp-1" style={{ marginBottom: '-4px', fontFamily: 'Cambria', fontSize: '15px', fontWeight: 'bold' }}>
                                {location.locationName}
                            </label>
                        </div>
                        <div className="flex flex-row flex-col gap-2 overflow-hidden ml-3" style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
                            <div className="text-sm flex items-center gap-0" style={{ marginBottom: '-4px' }}>
                                {renderStars()} {/* Hiển thị các sao */}
                                <p className="text-gray-500 ml-2">({location.reviews && location.reviews.length} reviews)</p>
                            </div>
                            <div className="text-sm flex items-center gap-0">
                                {displayOpeningTime()}
                            </div>
                            <div className="text-sm flex items-center gap-2">
                                {location.sub_category && (
                                    location.sub_category.split(',').map((subCategory, index) => (
                                        <button key={index} style={{ backgroundColor: 'lightgray', color: 'gray', borderRadius: '10px', width: 'auto', minWidth: '60px', fontFamily: 'Cambria', fontSize: '13px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}>
                                            {subCategory}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="card-actions justify-end mr-5 mb-3 mt-3">
                            {/* <br /> */}
                            {!user ? (
                                <></>
                            ) : (
                                <>
                                    {!isBookmark ? (
                                        <button onClick={handleLocationBookmarkClick}>
                                            <img
                                                className="w-4 h-5"
                                                src="https://i.ibb.co/RCPZY2v/bookmark.png"
                                                alt="bookmark"
                                                title="Add to Bookmarks"
                                            />
                                        </button>
                                    ) : (
                                        <button onClick={handleLocationBookmarkClick}>
                                            <img
                                                className="w-4 h-5"
                                                src="https://i.ibb.co/9ysZXfL/bookmarked.jpg"
                                                alt="bookmark"
                                                title="Added to Bookmarks"
                                            />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default LocationCard;
