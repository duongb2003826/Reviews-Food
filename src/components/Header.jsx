import * as userService from "../utilities/users-service";
import { Link } from "react-router-dom";
import Logo from './../assets/logo.jpg';
import { Menu } from "@headlessui/react";

function Header({ user, setUser }) {
	// const [showMenu, setShowMenu] = useState(false);

	const handleLogOut = () => {
		userService.logOut();
		setUser(null);
	};

	// Nếu user không có avatar, set avatar mặc định
	if (user && !user.avatar) {
		user.avatar = "https://as1.ftcdn.net/v2/jpg/01/16/24/44/1000_F_116244459_pywR1e0T3H7FPk3LTMjG6jsL3UchDpht.jpg";
	}

	return (
		<header className=" relative shadow-lg px-3 py-2" style={{ fontFamily: 'Cambria', fontSize: '16px', fontWeight: 'bold' }}>
			<nav className="flex justify-between">
				<div className="w-[130px] md:w-[200px] flex items-center">
					<Link to={'/'}><img src={Logo} alt="LOGO" style={{ height: "80px" }} srcSet /></Link>
				</div>
				<div className="flex items-center gap-3">
					<div
						className="navLinks duration-500 absolute md:static md:w-auto w-full md:h-auto h-[85vh] bg-white flex md:items-center gap-[1.5vw] top-[100%] left-[-100%] px-5 md:py-0 py-5 ">
						<ul className="flex md:flex-row flex-col md:items-center md:gap-[2vw] gap-8">
							<li className={'relative max-w-fit pr-3 md:pr-0 py-1 after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]  after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300'}>
								{user?.role == 'ADMIN' ? <Link to="/cms">Home</Link> : <a href="/">Home</a>}
							</li>

							{!user ? (
								<>

									<li className="relative max-w-fit pr-3 md:pr-0 py-1 after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]  after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300">
										<a href="#">Faculty</a></li>

									<li className={'relative max-w-fit pr-3 md:pr-0 py-1 after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]  after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300'}>
										<Link to="/location/viewall">View Map</Link>
									</li>
									<li className={'relative max-w-fit pr-3 md:pr-0 py-1 after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]  after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300'}>
										<Link to="/blog">Blog</Link>
									</li>
									<li className={'relative max-w-fit pr-3 md:pr-0 py-1 after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]  after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300'}>
										<Link to="/user/login">Login</Link>
									</li>
									<li className={'relative max-w-fit pr-3 md:pr-0 py-1 after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]  after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300'}>
										<Link to="/user/signup">Sign Up</Link>
									</li>
								</>
							) : (
								<>


									{
										user?.role == 'ADMIN' && <>
											<li className={'relative max-w-fit pr-3 md:pr-0 py-1 after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]  after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300'}>
												<Link to="/cms/restaurant-company">Doanh nghiệp</Link>
											</li>
											<li className={'relative max-w-fit pr-3 md:pr-0 py-1 after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]  after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300'}>
												<Link to="/cms/user">Người dùng</Link>
											</li>
											<li className={'relative max-w-fit pr-3 md:pr-0 py-1 after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]  after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300'}>
												<Link to="/cms/blog">Địa điểm</Link>
											</li>
											{/* Menu người dùng */}
										<Menu as="li" className="relative max-w-fit pr-3 md:pr-0 py-1">
											<Menu.Button>
												<div className="flex items-center cursor-pointer">
													<p className="mr-2">Welcome, {user?.name}</p>
													<img
														src={user?.avatar}
														alt="Avatar"
														className="rounded-full"
														style={{ height: "50px", width: "50px" }}
													/>
												</div>
											</Menu.Button>
											<Menu.Items className="absolute right-0 mt-2 bg-white shadow-md rounded-md py-2">
												<Menu.Item >
													<button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
														<Link to="/" onClick={handleLogOut}>
															Log out
														</Link>
													</button>
												</Menu.Item>
											</Menu.Items>
										</Menu>
										</>
									}


									{user?.role != 'ADMIN' && <>
										<li className={'relative max-w-fit pr-3 md:pr-0 py-1 after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]  after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300'}>
											<Link to="/location/viewall">View Map</Link>
										</li>
										<li className={'relative max-w-fit pr-3 md:pr-0 py-1 after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]  after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300'}>
											<Link to="/user/bookmarks">Bookmarks</Link>
										</li>
										<li className={'relative max-w-fit pr-3 md:pr-0 py-1 after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]  after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300'}>
											<Link to="/user/my-restaurant">My Restaurant</Link>
										</li>
										{/* Menu người dùng */}
										<Menu as="li" className="relative max-w-fit pr-3 md:pr-0 py-1">
											<Menu.Button>
												<div className="flex items-center cursor-pointer">
													<p className="mr-2">Welcome, {user?.name}</p>
													<img
														src={user?.avatar}
														alt="Avatar"
														className="rounded-full"
														style={{ height: "50px", width: "50px" }}
													/>
												</div>
											</Menu.Button>
											<Menu.Items className="absolute right-0 mt-2 bg-white shadow-md rounded-md py-2">
												<Menu.Item >
													<button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
														<Link to="/" onClick={handleLogOut}>
															Log out
														</Link>
													</button>
												</Menu.Item>
											</Menu.Items>
										</Menu>
									</>}
								</>
							)}
						</ul>
					</div>
				</div>
			</nav>
		</header>
	)
}

export default Header;