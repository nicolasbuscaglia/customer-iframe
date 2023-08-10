"use client";
import { useEffect, useRef, useState } from "react";

const IframeTester = () => {
  const iframeRef = useRef();
  const [tokens, setTokens] = useState();
  const [caseId, setCaseId] = useState();
  const [chatId, setChatId] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const onSubmitCredentialsHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://uex27rnxe4.execute-api.us-east-1.amazonaws.com/dev/v1/authHandler/login",
        {
          method: "POST",
          headers: {
            "X-Api-Key": process.env.NEXT_PUBLIC_THRUAI_API_KEY,
          },
          body: JSON.stringify({
            username: e.target[0].value,
            password: e.target[1].value,
          }),
        }
      ).then((response) => {
        if (!response.ok) {
          throw "Incorrect username or password.";
        }
        return response.json();
      });
      setTokens(response);
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setCaseId(e.target[0].value);
    setChatId(e.target[1].value);
    if (caseId && chatId) {
      iframeRef.current.contentWindow.postMessage(
        tokens,
        process.env.NEXT_PUBLIC_THRUAI_BASE_URL
      );
    }
  };

  useEffect(() => {
    if (!isLoading && tokens) {
      iframeRef.current.contentWindow.postMessage(
        tokens,
        process.env.NEXT_PUBLIC_THRUAI_BASE_URL
      );
    }
  }, [isLoading]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem" }}>
        Customer site
      </p>
      {!tokens && (
        <form onSubmit={onSubmitCredentialsHandler}>
          <div
            style={{ display: "flex", flexDirection: "column", padding: 10 }}
          >
            <div style={{ display: "flex", gap: 5 }}>
              <label htmlFor="username">Username:</label>
              <input name="username" />
              <label htmlFor="password">Password:</label>
              <input name="password" type="password" />
            </div>
            <button type="submit" style={{ margin: "5px 0" }}>
              Get Access Token
            </button>
          </div>
        </form>
      )}
      {tokens && (
        <form onSubmit={onSubmitHandler} disabled>
          <div
            style={{ display: "flex", flexDirection: "column", padding: 10 }}
          >
            <div style={{ display: "flex", gap: 5 }}>
              <label htmlFor="case">Case ID:</label>
              <input name="case" />
              <label htmlFor="chat">Chat ID:</label>
              <input name="chat" />
            </div>
            <button type="submit" style={{ margin: "5px 0" }}>
              Get iframe
            </button>
          </div>
        </form>
      )}
      {caseId && chatId && (
        <iframe
          ref={iframeRef}
          src={`${process.env.NEXT_PUBLIC_THRUAI_BASE_URL}/iframe/${caseId}/${chatId}`}
          width="500px"
          height="500px"
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  );
};

export default IframeTester;
