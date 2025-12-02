import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "./firebaseConfig";
import "./App.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import useLoginStore from "./useLoginStore";

const Tour = () => {
  const db = getFirestore(app);
  const storage = getStorage(app);
  const isLogined = useLoginStore((state) => state.isLogined);

  const [location1, setLocation1] = useState("");
  const [date1, setDate1] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleReset = () => {
    setLocation1("");
    setDate1("");
    setComment("");
    setImage(null);
    setUploadProgress(0);
  };

  const handleFileSelect = (file) => {
    if (file) setImage(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const storeHandle = async (e) => {
    e.preventDefault();
    if (!isLogined) {
      alert("로그인을 해야 업로드가 가능합니다.");
      return;
    }
    if (!image) {
      alert("사진 파일을 선택해주세요.");
      return;
    }

    const storageRef = ref(storage, "images/" + image.name);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          addDoc(collection(db, "tourMemo"), {
            location: location1,
            date: date1,
            comment,
            photoURL: downloadURL,
          });
          handleReset();
          alert("1건의 여행 추억을 기록했습니다.");
        });
      }
    );
  };

  return (
    <div className="tourPage">
      <h1 className="tourTitle">
        나의 여행 기록 남기기{" "}
        <span className="tourSubtitle">(로그인 시에만 가능)</span>
      </h1>
      <form onSubmit={storeHandle}>
        <div className="tourContainer">
          <div className="tourField">
            <label htmlFor="trip-location">여행지</label>
            <input
              type="text"
              id="trip-location"
              onChange={(e) => setLocation1(e.target.value)}
              value={location1}
              placeholder="예: 제주도 협재"
            />
          </div>
          <div className="tourField">
            <label htmlFor="trip-date">날짜</label>
            <input
              type="date"
              id="trip-date"
              onChange={(e) => setDate1(e.target.value)}
              value={date1}
            />
          </div>
          <div className="tourField">
            <label htmlFor="trip-comment">메모</label>
            <textarea
              cols="40"
              rows="4"
              id="trip-comment"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              placeholder="느낌, 장소 팁 등을 적어주세요"
            />
          </div>

          <div className="tourField">
            <label>사진 첨부</label>
            <div
              className={`dropZone ${isDragging ? "dragging" : ""}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
            >
              <input
                type="file"
                id="file"
                className="fileInput"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
              <p>
                파일을 드래그해 놓거나 클릭해서 선택하세요
                {image ? ` (선택된 파일: ${image.name})` : ""}
              </p>
            </div>
            {uploadProgress > 0 && (
              <div className="progressBar">
                <div
                  className="progressFill"
                  style={{ width: `${uploadProgress}%` }}
                />
                <span className="progressText">{uploadProgress}%</span>
              </div>
            )}
          </div>

          <div className="tourActions">
            <button type="submit">기록 업로드</button>
            <button type="reset" onClick={handleReset} className="ghostBtn">
              초기화
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Tour;
