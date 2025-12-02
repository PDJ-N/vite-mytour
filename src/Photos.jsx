import React, { useState, useEffect } from "react";
import "./photos.css";
import app from "./firebaseConfig";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Link, useNavigate } from "react-router";
import useLoginStore from "./useLoginStore";

const Photos = () => {
  const db = getFirestore(app);
  const storage = getStorage(app);
  const navigate = useNavigate();
  const isLogined = useLoginStore((state) => state.isLogined);

  const [displayList, setDisplayList] = useState([]);
  const [docId, setDocId] = useState([]); // 문서 id 배열
  const [refreshNeeded, setRefreshNeeded] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, "tourMemo"));
      setDisplayList([]);
      setDocId([]);
      querySnapshot.forEach((docSnap) => {
        setDocId((prev) => [...prev, docSnap.id]);
        const ob = docSnap.data();
        setDisplayList((arr) => [...arr, ob]);
      });
    };
    getData();
  }, [db, refreshNeeded]);

  const deleteHandle = async (targetId, photoURL) => {
    const photoImageRef = ref(storage, photoURL);
    deleteObject(photoImageRef).catch((error) => {
      console.log("이미지를 삭제하지 못했어요", error);
    });
    await deleteDoc(doc(db, "tourMemo", targetId));
    alert("기록을 삭제했습니다");
    alert("기록을 삭제했습니다");
    navigate("/photos");
  };

  return (
    <div className="photosPage">
      <header className="photoHeader">
        <div>
          <p className="eyebrow">앨범</p>
          <h1>빛나는 여행 사진을 모은 감성 갤러리</h1>
          <p className="lede">
            Firestore와 Storage에 저장된 여행 기록을 카드로 담았어요.
          </p>
        </div>
        <div className="photoHeaderActions">
          <Link to="/tour" className="btnPrimary">
            추억 추가하기
          </Link>
          <Link to="/" className="btnGhost">
            홈으로
          </Link>
        </div>
      </header>

      <section className="cards">
        {displayList.map((item, index) => (
          <div className="card" key={docId[index] || index}>
            <img
              className="cardImage"
              src={item.photoURL}
              alt={item.location || "여행 사진"}
            />
            <div className="cardContent">
              <h2 className="cardTitle">{item.location || "제목 없음"}</h2>
              <p className="cardText">{item.comment}</p>
              <p className="cardDate">{item.date}</p>
            </div>
            <div className="buttons">
              {isLogined && (
                <Link to={"/editTrip/" + docId[index]} className="editButton">
                  수정
                </Link>
              )}
              {isLogined && (
                <button
                  type="button"
                  className="deleteButton"
                  onClick={() => deleteHandle(docId[index], item.photoURL)}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Photos;
