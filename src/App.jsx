//App.jsx
import "./App.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router";
import Home from "./Home";
import Photos from "./Photos";
import Tour from "./Tour";
import EditTrip from "./EditTrip";
import Login from "./Login";
import Insights from "./Insights";
import NextTripWheel from "./NextTripWheel";
import useLoginStore from "./useLoginStore";

function App() {
  const isLogined = useLoginStore((state) => state.isLogined);
  const userName = useLoginStore((state) => state.userName);
  return (
    <BrowserRouter>
      <h1 className="header">Welcome to react & Firebase.</h1>
      <h4 className="subheader">
        {isLogined ? userName : "로그인되지 않은 상태"}
      </h4>
      <nav className="navi">
        <NavLink to="/" className="nav-item">
          Home
        </NavLink>
        <NavLink to="/photos" className="nav-item">
          Photos
        </NavLink>
        <NavLink to="/tour" className="nav-item">
          여행등록
        </NavLink>
        <NavLink to="/insights" className="nav-item">
          Insights
        </NavLink>
        <NavLink to="/wheel" className="nav-item">
          다음여행룰렛
        </NavLink>
        <NavLink to="/login" className="nav-item">
          Login
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/photos" element={<Photos />}></Route>
        <Route path="/tour" element={<Tour />}></Route>
        <Route path="/editTrip/:docId" element={<EditTrip />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/insights" element={<Insights />}></Route>
        <Route path="/wheel" element={<NextTripWheel />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
