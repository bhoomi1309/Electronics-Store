import './App.css';
import { Outlet, Link, NavLink } from 'react-router-dom';
import './pages/style.css';

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ fontSize: "18px" }}>
        <div className="container-fluid">
          <Link className="navbar-brand me-3" to="/" style={{ fontWeight: "bold", fontSize: "23px" }}>DE</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item me-2">
                <NavLink className="nav-link" to="/" activeclassname="active">Home</NavLink>
              </li>
              <li className="nav-item me-2">
                <NavLink className="nav-link" to="/sales" activeclassname="active">Sales</NavLink>
              </li>
              <li className="nav-item me-2">
                <NavLink className="nav-link" to="/stock" activeclassname="active">Stock</NavLink>
              </li>
              <li className="nav-item me-2">
                <NavLink className="nav-link" to="/modifyStock" activeclassname="active">Modify Stock</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
        <Outlet />
    </>
  );
}

export default App;
