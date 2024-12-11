import { useLocation } from "react-router-dom";
import CoachHome from "../CoachHome/CoachHome";
import StudentHome from "../StudentHome/StudentHome";

const Home = () => {
  const location = useLocation();
  const { username, role_name } = location.state as {
    username: string;
    role_name: string;
  };

  if (!role_name) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {role_name === "coach" ? (
        <CoachHome username={username} />
      ) : (
        <StudentHome username={username} />
      )}
    </div>
  );
};

export default Home;
