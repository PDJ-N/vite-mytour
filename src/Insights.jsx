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
        monthly: [],
        monthlyMax: 1,
      };
    }

    const total = docs.length;

    // 월별 집계 (YYYY-MM)
    const monthlyMap = {};
    docs.forEach((item) => {
      const d = item.date || "";
      const monthKey = d.length >= 7 ? d.slice(0, 7) : "미정";
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + 1;
    });
    const monthly = Object.entries(monthlyMap)
      .sort((a, b) => (a[0] > b[0] ? -1 : 1))
      .map(([month, count]) => ({ month, count }));

    const monthlyMax = Math.max(...monthly.map((item) => item.count), 1);

    return { total, monthly, monthlyMax };
  }, [docs]);

  return (
    <div className="home">
      <section className="homeHero">
        <div>
          <p className="eyebrow">인사이트</p>
          <h1>여행 인사이트</h1>
          <p className="lede">
            기록된 여행 데이터를 바탕으로 전체 건수와 월별 추이를 확인해 보세요.
          </p>
        </div>
      </section>

      <section className="recentSection">
        {loading ? (
          <p className="muted">불러오는 중..</p>
        ) : error ? (
          <p className="muted">{error}</p>
        ) : (
          <>
            <div className="statsGrid">
              <div className="statCard">
                <p className="statLabel">전체 기록</p>
                <p className="statValue">{summary.total}</p>
              </div>
            </div>

            <div className="sectionHeader" style={{ marginTop: "12px" }}>
              <h2>월별 기록 추이</h2>
            </div>
            {summary.monthly.length === 0 ? (
              <p className="muted">아직 데이터가 없습니다.</p>
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
                            (item.count / summary.monthlyMax) * 100
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
