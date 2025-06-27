import React, { useState } from "react";
import { Link } from "react-router-dom";

const styles = {
  navbar: {
    height: "60px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    alignItems: "center",
    paddingLeft: "40px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#d2a8f2",
  },
  container: {
    maxWidth: "360px",
    margin: "80px auto",
    padding: "20px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0 16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f8ecff",
    boxSizing: "border-box", // ✅ 너비 문제 해결
  },
  button: {
    backgroundColor: "#e3b9f6",
    color: "white",
    padding: "12px",
    width: "100%",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

function Register() {
  const [form, setForm] = useState({
    name: "",
    id: "",
    nickname: "",
    password: "",
    password_check: "",
    birthday: "",
    phone_number: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("id", form.id);
  formData.append("nickname", form.nickname);
  formData.append("password", form.password);
  formData.append("password_check", form.password_check);
  formData.append("birthday", form.birthday);
  formData.append("phone_number", form.phone_number);

  try {
    const res = await fetch("http://localhost:8000/signup", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("서버 응답 오류");
    const text = await res.text();
    console.log("회원가입 완료:", text);
  } catch (err) {
    console.error("회원가입 중 오류 발생:", err);
  }
};

  return (
    <div>
      <nav style={styles.navbar}>
        <Link to="/" style={{ ...styles.logo, textDecoration: "none" }}>
            너마늘
        </Link>
        </nav>
      <div style={styles.container}>
        <h3>회원가입</h3>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="id"
            placeholder="ID"
            value={form.id}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password_check"
            placeholder="Password Again"
            value={form.password_check}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="birthday"
            placeholder="생년월일 (예: 000101-1)"
            value={form.birthday}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="phone_number"
            placeholder="전화번호 (예: 010-1234-5678)"
            value={form.phone_number}
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
