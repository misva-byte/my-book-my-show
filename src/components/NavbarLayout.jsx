import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "./logo";

function NavbarLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
    <div>
        {/* navbar */}
        <nav className="navbar">
            <div className="navbar-left">
                < Logo />
            </div>

            <div className="navbar-center">
                <NavLink to = "/home" className={({isActive}) => isActive ? "active": ""}>
                    Home
                </NavLink>

                <NavLink to = "/ticket" className={({isActive}) => isActive ? "active": ""}>
                    My Ticket
                </NavLink>
            </div>

            <div className="navbar-right">
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>

        <div>
          <Outlet />
        </div>

    </div>
);
}

export default NavbarLayout;