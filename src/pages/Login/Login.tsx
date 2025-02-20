import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../apis";
import "./login.scss";

const Login: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await login(userName, password);
      const roleName = response.roleName;
      const userId = response.userId;
      if (response.token) {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("userId", `${userId}`);
        navigate("/home", { state: { userName, roleName } });
      }
    } catch (error: any) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login">
        <h2 className="login__title">Login</h2>
        <form onSubmit={handleLogin} className="login__form">
          <label className="login__label" htmlFor="username">
            Username:
          </label>
          <input
            className="login__input"
            type="text"
            id="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <label className="login__label" htmlFor="password">
            Password:
          </label>
          <input
            className="login__input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="login__error">{error}</p>}
          <button className="login__button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
