import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import app from "./firebaseConfig"; // Firebase app 초기화
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import useLoginStore from "./useLoginStore"; // zustand 상태 관리

const Login = () => {
  const { isLogined, logined, logouted } = useLoginStore();
  let [nickName, setNickName] = useState(""); // 회원가입 시 저장할 닉네임
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let pwRef = useRef(); // 비밀번호 입력란 포커스 이동용
  const navigate = useNavigate();
  const auth = getAuth(app);

  // 입력 핸들러
  const nickNameChangeHandle = (e) => {
    setNickName(e.target.value);
  };
  const emailChangeHandle = (e) => {
    setEmail(e.target.value);
  };
  const passwordChangeHandle = (e) => {
    setPassword(e.target.value);
  };

  // 회원가입 처리 (비밀번호 6자 이상 체크)
  const signUpHandle = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("비밀번호는 6자 이상이어야 합니다");
      pwRef.current?.focus();
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, { displayName: nickName });
        alert("회원가입이 완료되었습니다");
        setNickName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 로그인 처리
  const signInHandle = (e) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        logined(user.displayName);
        alert("로그인했습니다");
        setEmail("");
        setPassword("");
        navigate("/");
      })
      .catch((error) => {
        console.log("에러 발생 :", error);
      });
  };

  // 로그아웃 처리
  const logOutHandle = () => {
    signOut(auth)
      .then(() => {
        logouted();
        alert("로그아웃이 완료되었습니다");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="loginPage">
      <div className="loginCard">
        <h2>Email/Password Login</h2>
        {/* 카드 내부에 입력과 버튼을 묶어 시각적 그룹을 만듭니다. */}
        <form className="loginForm">
          <label>
            Nick Name
            <input
              type="text"
              value={nickName}
              onChange={nickNameChangeHandle}
              id="nickName"
              placeholder="회원가입 시 입력"
            />
          </label>
          <label>
            E-mail
            <input
              type="text"
              value={email}
              onChange={emailChangeHandle}
              id="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              ref={pwRef}
              value={password}
              onChange={passwordChangeHandle}
              id="password"
            />
          </label>
          <div className="loginActions">
            {isLogined ? (
              <button type="button" onClick={logOutHandle}>
                Logout
              </button>
            ) : (
              <button type="button" onClick={signInHandle}>
                Login
              </button>
            )}
            <button type="button" id="register" onClick={signUpHandle}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
