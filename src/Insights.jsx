import React, { useEffect, useMemo, useState } from "react";
import app from "./firebaseConfig";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import "./App.css";

const Insights = () => {
  const db = getFirestore(app);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const q = query(collection(db, "tourMemo"), orderBy("date", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDocs(data);
      } catch (err) {
        setError("데이터를 불러오지 못했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [db]);

  const summary = useMemo(() => {
    if (!docs.length) {
      return {
        total: 0,
        topLocation: "-",
        topCount: 0,
        monthly: [],
      };
    }

    const total = docs.length;

    // 장소 집계
    const locCount = {};
    docs.forEach((item) => {
      const key = item.location || "미지정";
      locCount[key] = (locCount[key] || 0) + 1;
    });
    const [topLocation, topCount] =
      Object.entries(locCount).sort((a, b) => b[1] - a[1])[0] || ["-", 0];

    // 월별 집계 (YYYY-MM)
    const monthlyMap = {};
    docs.forEach((item) => {
      const d = item.date || "";
      const monthKey = d.length >= 7 ? d.slice(0, 7) : "미지정";
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + 1;
    });
    const monthly = Object.entries(monthlyMap)
      .sort((a, b) => (a[0] > b[0] ? -1 : 1))
      .map(([month, count]) => ({ month, count }));

    return { total, topLocation, topCount, monthly };
  }, [docs]);

  return (
    <div className="home">
      <section className="homeHero">
        <div>
          <p className="eyebrow">대시보드</p>
          <h1>여행 인사이트</h1>
          <p className="lede">
            업로드된 여행 기록을 바탕으로 요약 통계를 확인합니다. 장소와 월별
            업로드 추이를 살펴보세요.
          </p>
        </div>
      </section>

      <section className="recentSection">
        {loading ? (
          <p className="muted">불러오는 중...</p>
        ) : error ? (
          <p className="muted">{error}</p>
        ) : (
          <>
            <div className="statsGrid">
              <div className="statCard">
                <p className="statLabel">전체 업로드</p>
                <p className="statValue">{summary.total}</p>
              </div>
              <div className="statCard">
                <p className="statLabel">가장 많이 방문</p>
                <p className="statValue">{summary.topLocation}</p>
                <p className="statSub">총 {summary.topCount}회</p>
              </div>
            </div>

            <div className="sectionHeader" style={{ marginTop: "12px" }}>
              <h2>월별 업로드 추이</h2>
            </div>
            {summary.monthly.length === 0 ? (
              <p className="muted">표시할 데이터가 없습니다.</p>
            ) : (
              <div className="barList">
                {summary.monthly.map((item) => (
                  <div className="barRow" key={item.month}>
                    <span className="barLabel">{item.month}</span>
                    <div className="barTrack">
                      <div
                        className="barFill"
                        style={{
                          width: `${Math.max(
                            8,
                            (item.count / summary.topCount) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="barCount">{item.count}회</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Insights;
