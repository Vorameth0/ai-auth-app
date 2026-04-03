import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect,
    logout,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  const callApi = async () => {
    try {
      console.log("CALLING API...");

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://my-api",
        },
      });

      console.log("TOKEN:", token);

      const res = await fetch("http://localhost:5001/protected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("STATUS:", res.status);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();
      console.log("API RESPONSE:", data);

      alert("✅ API Success!");
    } catch (err) {
      console.error("❌ ERROR:", err);
      alert("❌ " + err.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Auth App 🚀</h1>

      {isAuthenticated ? (
        <>
          <p>Logged in as: {user.email}</p>

          <h3>User Info:</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>

          <button onClick={callApi}>
            Call Protected API
          </button>

          <br /><br />

          <button
            onClick={() =>
              logout({ returnTo: window.location.origin })
            }
          >
            Logout
          </button>
        </>
      ) : (
        <>
          {error && <p>Error: {error.message}</p>}

          <button onClick={() => loginWithRedirect()}>
            Login
          </button>

          <button
            onClick={() =>
              loginWithRedirect({
                authorizationParams: { screen_hint: "signup" },
              })
            }
          >
            Signup
          </button>
        </>
      )}
    </div>
  );
}

export default App;