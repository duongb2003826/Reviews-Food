import { useState } from "react";
import { getUser, login } from "../../utilities/users-service";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const user = await login(credentials);
      setUser(getUser());
      navigate("/");
    } catch (error) {
      setError("Invalid Email Address or Password");
    }
  };

  const handleChange = (evt) => {
    setCredentials({
      ...credentials,
      [evt.target.name]: evt.target.value,
    });
    setError("");
  };

  return (
    <>
      <div className="grid grid-cols-2 h-screen bg-base-11 h-96">
        <div
          className="hero bg-cover bg-center opacity-70 "
          style={{
            backgroundImage: `url("https://i.pinimg.com/736x/05/86/11/0586118f8aa854eeccf04a697f1d7013.jpg")`,
          }}
        ></div>
        <div className="hero bg-base-100 border-4 border-blue-100">
          <div className="hero-content flex-col">
            <div className="card flex-shrink-0 w-full max-w-sm  bg-base-100">
              <p className="text-4xl font-bold text-center" style={{ fontFamily: 'Cambria', fontSize: '45px', fontWeight: 'bold' }}>
                  WELCOME BACK!
                </p>
              <div className="card-body w-96">
                
                <br />
                <form autoComplete="off" onSubmit={handleSubmit} style={{ fontFamily: 'Cambria', fontSize: '16px' }}>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="email"
                      className="input input-bordered input-info"
                      value={credentials.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="password"
                      className="input input-bordered input-info"
                      value={credentials.password}
                      onChange={handleChange}
                      minLength={8}
                      maxLength={12}
                      required
                    />
                    <label className="label">
                      <Link
                        to="/user/signup"
                        className="label-text-alt link link-hover"
                      >
                        No Account? Create one!
                      </Link>
                    </label>
                  </div>
                  <div className="form-control mt-6">
                    <button className="btn btn-info" type="submit">
                      Login
                    </button><br/>
                    {error && <p className="error-message">&nbsp;{error}</p>}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
