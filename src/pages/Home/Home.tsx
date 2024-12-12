import { useLocation } from "react-router-dom";
import CoachHome from "../CoachHome/CoachHome";
import StudentHome from "../StudentHome/StudentHome";

const Home = () => {
  const location = useLocation();
  const { userName, roleName } = location.state as {
    userName: string;
    roleName: string;
  };

  if (!roleName) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {roleName === "coach" ? (
        <CoachHome userName={userName} />
      ) : (
        <StudentHome userName={userName} />
      )}
    </div>
  );
};

export default Home;
