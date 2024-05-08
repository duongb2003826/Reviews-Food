import {Link} from "react-router-dom";
import * as userService from "../../utilities/users-service";

export default function NavBar({user, setUser}) {
    const handleLogOut = () => {
        userService.logOut();
        setUser(null);
    };

    return (
        <>
            <div className="navbar bg-base-100 h-28">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h7"
                                />
                            </svg>
                        </label>
                        <ul
                            style={{zIndex: 999999}}
                            tabIndex={0}
                            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            <li>
                                <Link to="/location/viewall">View Map</Link>
                            </li>
                            <li>
                                <Link to="/">View All</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="navbar-center btn btn-ghost normal-case text-2xl gap-3">
                    <img
                        className="w-12 h-11"
                        src="https://static.vecteezy.com/system/resources/previews/009/291/628/non_2x/restaurant-logo-design-vector.jpg"
                        alt="restaurant"
                    />
                    <Link to="/" className="hover:text-current">
                        Reviews Restaurant
                    </Link>
                </div>

                <div className="navbar-end mr-4">
                    {user ? <span>Welcome, {user.name}!</span> : <></>}
                </div>

                {!user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <span
                                    className="indicator-item badge-sm rounded-full bg-base-300 border-none right-1 top-1"></span>
                                <div className="grid w-10 h-10 bg-white rounded-full place-items-center">
                                    <img src="https://i.ibb.co/nRk3h8Q/user.png"/>
                                </div>
                            </div>
                        </label>
                        <ul
                            style={{zIndex: 999999}}
                            tabIndex={0}
                            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
                        >
                            <li>
                                <Link to="/user/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/user/signup">Sign Up</Link>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <span
                                    className="indicator-item badge-sm rounded-full bg-success border-none right-1 top-1"></span>
                                <div className="grid w-10 h-10 bg-white rounded-full place-items-center">
                                    <img src="https://i.ibb.co/nRk3h8Q/user.png"/>
                                </div>
                            </div>
                        </label>
                        <ul
                            tabIndex={0}
                            style={{zIndex: 999999}}
                            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
                        >
                            <li>
                                <Link to="/user/bookmarks">Bookmarks</Link>
                            </li>
                            <li>
                                <Link to="/user/my-restaurant">My Restaurant</Link>
                            </li>
                            <li>
                                <Link to="/" onClick={handleLogOut}>
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}
