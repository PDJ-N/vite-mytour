import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import app from "./firebaseConfig";

const Home = () => {
  const [recentTrips, setRecentTrips] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const q = query(
          collection(db, "tourMemo"),
          orderBy("date", "desc"),
          limit(10)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentTrips(data);
        setCurrentIndex(0);
      } catch (err) {
        console.log("Failed to load recent trips", err);
      }
    };
    fetchRecent();
  }, [db]);

  const current = recentTrips[currentIndex] || null;
  const hasMultiple = recentTrips.length > 1;

  const prevSlide = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) =>
      prev === 0 ? recentTrips.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) =>
      prev === recentTrips.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="home">
      <section className="homeHero">
        <div>
          <p className="eyebrow">여행 라이브러리</p>
          <h1>사진과 메모로 여행을 기록하세요</h1>
          <p className="lede">
            여행 사진을 Storage에 저장하고 Firestore와 연결합니다. 어디서나
            나의 사람, 일정, 순간을 모아둘 수 있어요.
          </p>
          <div className="ctaRow">
            <Link to="/tour" className="btnPrimary">
              추억 추가하기
            </Link>
            <Link to="/photos" className="btnGhost">
              앨범 보기
            </Link>
            <Link to="/login" className="btnGhost subtle">
              로그인 / 회원가입
            </Link>
          </div>
        </div>
        <div className="heroCard">
          <p className="heroLabel">이용 방법</p>
          <ol>
            <li>로그인 후 여행지, 날짜, 메모, 사진을 입력하세요.</li>
            <li>사진은 Storage, 나머지는 Firestore에 저장됩니다.</li>
            <li>Photos에서 확인하고, 필요하면 수정/삭제하세요.</li>
          </ol>
        </div>
      </section>

      <section className="recentSection">
        <div className="sectionHeader">
          <h2>최근 업로드</h2>
          <Link to="/photos" className="textLink">
            모두 보기
          </Link>
        </div>
        {recentTrips.length === 0 ? (
          <p className="muted">아직 업로드한 사진이 없습니다. 추억을 추가해보세요.</p>
        ) : (
          <div className="recentSingle">
            <div className="singleTop">
              <button
                type="button"
                className="arrowButton"
                aria-label="previous"
                onClick={prevSlide}
                disabled={!hasMultiple}
              >
                ‹
              </button>
              <article className="recentCard mainCard" key={current?.id || 0}>
                <div className="thumb large">
                  {current?.photoURL ? (
                    <img
                      src={current.photoURL}
                      alt={current.location || "여행지 사진"}
                      draggable="false"
                    />
                  ) : (
                    <div className="thumbPlaceholder">사진 없음</div>
                  )}
                </div>
                <div className="recentBody">
                  <p className="recentDate">{current?.date}</p>
                  <h3>{current?.location || "제목 없는 여행지"}</h3>
                  <p className="recentComment">{current?.comment}</p>
                </div>
              </article>
              <button
                type="button"
                className="arrowButton"
                aria-label="next"
                onClick={nextSlide}
                disabled={!hasMultiple}
              >
                ›
              </button>
            </div>
            {hasMultiple && (
              <div className="sliderRow">
                <input
                  type="range"
                  min={0}
                  max={recentTrips.length - 1}
                  value={currentIndex}
                  onChange={(e) => setCurrentIndex(Number(e.target.value))}
                />
                <span className="sliderLabel">
                  {currentIndex + 1} / {recentTrips.length}
                </span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
