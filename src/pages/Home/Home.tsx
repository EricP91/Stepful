import { useLocation, useNavigate } from "react-router-dom";
import CoachHome from "../CoachHome/CoachHome";
import StudentHome from "../StudentHome/StudentHome";
import { logout } from "../../apis";
import './home.scss';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userName, roleName } = location.state as {
    userName: string;
    roleName: string;
  };

  if (!roleName) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <div className="home">
        <button onClick={handleLogout} className="button-logout">Log out</button>
      {roleName === "coach" ? (
        <CoachHome userName={userName} />
      ) : (
        <StudentHome userName={userName} />
      )}
    </div>
  );
};

export default Home;
