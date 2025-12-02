import React, { useMemo, useState } from "react";
import "./App.css";

const provinces = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주도",
];

const cities = [
  "서울시",
  "수원시",
  "인천시",
  "대전시",
  "대구시",
  "부산시",
  "광주시",
  "울산시",
  "청주시",
  "전주시",
  "제주시",
  "강릉시",
  "춘천시",
  "포항시",
  "창원시",
  "안동시",
  "여수시",
];

const NextTripWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState({ province: "??", city: "??" });

  const combined = useMemo(
    () => `${result.province} · ${result.city}`,
    [result]
  );

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const duration = 1500;
    const finalProvince =
      provinces[Math.floor(Math.random() * provinces.length)];
    const finalCity = cities[Math.floor(Math.random() * cities.length)];

    setTimeout(() => {
      setResult({ province: finalProvince, city: finalCity });
      setSpinning(false);
    }, duration);
  };

  return (
    <div className="home">
      <section className="homeHero">
        <div>
          <p className="eyebrow">랜덤 추천</p>
          <h1>다음 여행지는 어디?</h1>
          <p className="lede">
            도/시 랜덤 추천 룰렛을 돌려서 다음 여행지를 가볍게 정해보세요.
          </p>
        </div>
      </section>

      <section className="recentSection">
        <div className="wheelCard">
          <div className={`wheelCircle ${spinning ? "spin" : ""}`}>
            <div className="wheelLabel">{result.province}</div>
            <div className="wheelLabel sub">{result.city}</div>
          </div>
          <button className="btnPrimary wheelButton" onClick={spin}>
            {spinning ? "돌아가는 중..." : "룰렛 돌리기"}
          </button>
          <p className="wheelResult">{combined}</p>
        </div>
      </section>
    </div>
  );
};

export default NextTripWheel;
