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
  const [recentTrips, setRecentTrips] = useState([]); // 최근 업로드 3건 표시
  const db = getFirestore(app);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const q = query(
          collection(db, "tourMemo"),
          orderBy("date", "desc"),
          limit(3)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentTrips(data);
      } catch (err) {
        console.log("Failed to load recent trips", err);
      }
    };
    fetchRecent();
  }, [db]);

  return (
    <div className="home">
      <section className="homeHero">
        <div>
          <p className="eyebrow">여행 다이어리</p>
          <h1>사진과 메모로 여행을 기록하세요</h1>
          <p className="lede">
            여행 사진은 Storage에, 내용은 Firestore에 저장합니다. 한곳에서
            업로드, 열람, 수정, 삭제까지 모두 할 수 있습니다.
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
          <p className="heroLabel">사용 방법</p>
          <ol>
            <li>로그인 후 여행지, 날짜, 메모, 사진을 입력합니다.</li>
            <li>사진은 Storage, 나머지는 Firestore에 저장됩니다.</li>
            <li>Photos에서 확인하고, 언제든 수정/삭제할 수 있습니다.</li>
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
          <p className="muted">아직 업로드가 없습니다. 추억을 추가해 보세요.</p>
        ) : (
          <div className="recentGrid">
            {recentTrips.map((item) => (
              <article className="recentCard" key={item.id}>
                <div className="thumb">
                  {item.photoURL ? (
                    <img
                      src={item.photoURL}
                      alt={item.location || "여행지 사진"}
                    />
                  ) : (
                    <div className="thumbPlaceholder">이미지 없음</div>
                  )}
                </div>
                <div className="recentBody">
                  <p className="recentDate">{item.date}</p>
                  <h3>{item.location || "제목 없는 여행지"}</h3>
                  <p className="recentComment">{item.comment}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
