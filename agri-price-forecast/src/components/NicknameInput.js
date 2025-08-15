// components/NicknameInput.js
import React, { useState } from "react";

function NicknameInput({ nickname, setNickname }) {
  const [value, setValue] = useState(nickname || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    setNickname(value);
    localStorage.setItem("nickname", value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="닉네임(별명)을 입력하세요"
        style={{ fontSize: 16, padding: 6, borderRadius: 6 }}
        required
      />
      <button type="submit" style={{ marginLeft: 10 }}>
        확인
      </button>
    </form>
  );
}

export default NicknameInput;
