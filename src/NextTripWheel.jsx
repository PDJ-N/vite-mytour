import React, { useMemo, useState } from "react";
import "./App.css";

const provinces = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "대전광역시",
  "광주광역시",
  "인천광역시",
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
  "대전시",
  "춘천시",
  "청주시",
  "전주시",
  "광주시",
  "포항시",
  "부산시",
  "제주시",
  "평창군",
  "강릉시",
  "여수시",
  "울산시",
  "창원시",
  "목포시",
  "부여군",
];

const wheelOptions = {
  province: provinces,
  city: cities,
};

const modeLabels = {
  province: "도 / 광역시",
  city: "시 / 군 / 구",
};

const NextTripWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [mode, setMode] = useState("province");
  const [result, setResult] = useState("??");

  const resultText = useMemo(
    () => `${modeLabels[mode]}: ${result}`,
    [mode, result]
  );

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const duration = 1500;
    const options = wheelOptions[mode];
    const finalValue = options[Math.floor(Math.random() * options.length)];

    setTimeout(() => {
      setResult(finalValue);
      setSpinning(false);
    }, duration);
  };

  return (
    <div className="home">
      <section className="homeHero">
        <div>
          <p className="eyebrow">랜덤 추천</p>
          <h1>다음 여행지 어디?</h1>
          <p className="lede">
            원하는 기준(도/광역시, 시)을 선택하고 룰렛으로 가볍게 정해
            보세요.
          </p>
        </div>
      </section>

      <section className="recentSection">
        <div className="wheelCard">
          <div className="wheelMode">
            <label>
              <input
                type="radio"
                name="wheel-mode"
                value="province"
                checked={mode === "province"}
                onChange={(e) => setMode(e.target.value)}
                disabled={spinning}
              />
              도/광역시
            </label>
            <label>
              <input
                type="radio"
                name="wheel-mode"
                value="city"
                checked={mode === "city"}
                onChange={(e) => setMode(e.target.value)}
                disabled={spinning}
              />
              시
            </label>
          </div>

          <div className={`wheelCircle ${spinning ? "spin" : ""}`}>
            <div className="wheelLabel">{result}</div>
            <div className="wheelLabel sub">{modeLabels[mode]}</div>
          </div>
          <button className="btnPrimary wheelButton" onClick={spin}>
            {spinning ? "돌아가는 중..." : "룰렛 돌리기"}
          </button>
          <p className="wheelResult">{resultText}</p>
        </div>
      </section>
    </div>
  );
};

export default NextTripWheel;
