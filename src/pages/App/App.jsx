import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import Map from "../../components/Map/Map";
import NavBar from "../../components/NavBar/NavBar";
import BookmarksPage from "../BookmarksPage/BookmarksPage";
import SignUp from "../SignUp/SignUp";
import Login from "../Login/Login";
import ViewAll from "../ViewAll/ViewAll";
import BlogAllPage from "../Blog/Blog";
import LocationDetails from "../LocationDetails/LocationDetails";
import MyRestaurant from "../MyRestaurant/MyRestaurant";
import Header from "../../components/Header";
import LocationCategory from "../LocationCategory/LocationCategory";
import MyRestaurantReview from "../MyRestaurantReviews/MyRestaurantReviews";
import UserPage from "../Admin/User";
import DashboardPage from "../Admin/DashBoard";
import BlogPage from "../Admin/Blog";
import BlogDetail from "../Blog/BlogDetail";

const App = () =>
{
	const [ user, setUser ] = useState( getUser() );
	console.log(user)
	return (
		<>
			{/*<NavBar user={user} setUser={setUser}/>*/ }
			<Header user={ user } setUser={ setUser } />
			<Routes>
				<Route path="/" element={ <ViewAll user={ user } /> } />
				<Route path="/user/bookmarks" element={ <BookmarksPage user={ user } /> } />
				{
					user?.role == 'ADMIN' && <>
						<Route path="/cms/user" element={ <UserPage user={ user } isRestaurant={'User'}/> } />
						<Route path="/cms/blog" element={ <BlogPage user={ user }/> } />
						<Route path="/cms/restaurant-company" element={ <UserPage user={ user } isRestaurant={'Restaurant'}/> } />
						<Route path="/cms" element={ <DashboardPage user={ user } isRestaurant={'User'} /> } />
					</>
				}
				<Route path="/user/my-restaurant" element={ <MyRestaurant user={ user } /> } />
				<Route path="/blog" element={ <BlogAllPage user={ user } /> } />
				<Route path="/blog/:id" element={ <BlogDetail user={ user } /> } />
				<Route path="/user/my-restaurant-reviews/:id" element={ <MyRestaurantReview user={ user } /> } />
				<Route path="/user/signup" element={ <SignUp setUser={ setUser } /> } />
				<Route path="/user/login" element={ <Login setUser={ setUser } /> } />
				<Route path="/location/viewall" element={ <Map /> } />
				<Route path="/location/:id" element={ <LocationDetails user={ user } /> } />
				<Route path="/category/:id" element={ <LocationCategory user={ user } /> } />
			</Routes>
		</>
	);
};

export default App;
