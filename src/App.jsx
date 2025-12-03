//App.jsx
import { useMemo } from "react";
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

const headlines = [
  "빛나는 여행 기록, 여기서 시작하세요.",
  "여정의 순간을 담아두고 다시 꺼내보세요.",
  "다음 여행을 위한 추억 저장소.",
  "사진, 메모, 인사이트를 한 번에 정리하세요.",
  "25년도도 정말 수고많으셨습니다.",
  "하는일 모두 잘 될 꺼야!",
  "교수님 한 한기 동안 정말 감사했습니다."
];

function App() {
  const isLogined = useLoginStore((state) => state.isLogined);
  const userName = useLoginStore((state) => state.userName);
  const headline = useMemo(
    () => headlines[Math.floor(Math.random() * headlines.length)],
    []
  );
  return (
    <BrowserRouter>
      <h1 className="header">{headline}</h1>
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
          활동내역
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
