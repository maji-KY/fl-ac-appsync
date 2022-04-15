import React from "react";
import styled from "styled-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { auth } from "../auth";

const StyledDiv = styled.div`
  text-align: center;
  .logo {
    font-family: "Stick", sans-serif;
    font-size: 150px;
    font-weight: bold;
  }
  .text1 {
    font-size: 26px;
  }
  .text2 {
    font-size: 12px;
  }
  .login-button {
    font-size: 48px;
    margin: 50px;
  }
`;

const Home: NextPage = () => {
  const router = useRouter();

  const login = React.useCallback(async () => {
    await auth.login();
    await router.push("/auctions");
  }, [router]);

  return (
    <StyledDiv>
      <div className="logo">フリオク!</div>
      <p className="text1">ワクワク リアルタイム 入札 バトル！！</p>
      <p className="text2">超エキサイティン！！</p>
      <button className="login-button" onClick={login}>
        ログイン！
      </button>
    </StyledDiv>
  );
};

export default Home;
