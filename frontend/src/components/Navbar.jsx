import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/create">Create Portfolio</Link>
      {token && <button onClick={logout}>Logout</button>}
    </nav>
  );
}

export default Navbar;