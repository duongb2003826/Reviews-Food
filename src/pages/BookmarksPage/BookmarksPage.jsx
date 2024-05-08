import { useState, useEffect } from "react";
import LocationCard from "../../components/LocationCard/LocationCard";
import { useNavigate } from "react-router-dom";

const BookmarksPage = ({ user }) => {
	const [bookmarks, setBookmarks] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/");
		} else {
			const fetchBookmarks = async () => {
				try {
					const response = await fetch(`/api/user/${user._id}/bookmarks`);
					const { showBookmarks } = await response.json();
					setBookmarks(showBookmarks.bookmarks);
				} catch (error) {
					console.log("Error fetching bookmarks:", error);
				}
			};
			fetchBookmarks();
		}
	}, [user]);

	return (
		<div>
			<div
				className="hero h-80"
				style={{
					backgroundImage: `url("https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`,
				}}
			>
				<div className="hero-overlay bg-base-200 bg-opacity-50"></div>
				<div className="hero-content text-black">
					<div className="mb-2">
						<br />
						<p className="mb-4 text-5xl text-center font-bold" style={{ fontFamily: 'Cambria', fontSize: '66px' }}>
							My Bookmarks
						</p>
					</div>
				</div>
			</div>
			<div className="md:w-[80%] flex flex-wrap justify-center gap-20 mt-14 mb-20 items-center mx-auto">
	{bookmarks.length > 0 ? (
		<>
			{bookmarks.map((location) => (
				<div
					key={location._id}
          className="card card-compact w-60 bg-base-100 shadow-xl mb-10"
          >
					<LocationCard location={location} user={user} />
				</div>
			))}
		</>
	) : (
		<h2>No bookmarks</h2>
	)}
</div>

	</div>
	);
};

export default BookmarksPage;
