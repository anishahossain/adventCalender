import { Link } from "react-router-dom";


function AuthLayout({ children, mode }) {
  const isSignup = mode === "signup";

  return (
    <div className="gradient-bg" style={{ minHeight: "100vh", display: "flex" }}>
      {/* LEFT */}
  <div
  style={{
    position: "relative",
    flex: 1,
    padding: "3rem 4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  }}
>
  {/* BIG CENTER PIECE */}
  <img
    src="/hero-bg.png"
    alt=""
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "70%",
      height: "auto",
      opacity: 1,            // full opacity like you wanted
      zIndex: 0,
      pointerEvents: "none",
    }}
  />

  {/* SMALL DECOR TOP-LEFT */}
  <img
    src="/star.png"
    alt=""
    className="tilt"
    style={{
      position: "absolute",
      top: "13%",
      left: "10%",
      width: "17%",
      height: "auto",
      opacity: 1,
      zIndex: 0,
      pointerEvents: "none",
    }}
  />

  {/* SMALL DECOR TOP-RIGHT */}
  <img
    src="/heart-bubble.png"
    alt=""
    className="tilt-more"
    style={{
      position: "absolute",
      top: "8%",
      right: "12%",
      width: "25%",
      height: "auto",
      opacity: 1,
      zIndex: 0,
      pointerEvents: "none",
    }}
  />

  {/* SMALL DECOR BOTTOM-LEFT */}
  <img
    src="/gift.png"
    alt=""
    className="tilt-fast"
    style={{
      position: "absolute",
      bottom: "6%",
      left: "8%",
      width: "25%",
      height: "auto",
      opacity: 1,
      zIndex: 0,
      pointerEvents: "none",
    }}
  />

  {/* TEXT ON TOP */}
  <div
    style={{
      position: "relative",
      zIndex: 1,          // ⬅️ ensure text sits above all images
      marginLeft: "3rem",
    }}
  >
    <div style={{ marginBottom: "1rem" }}>
      <span style={{ fontSize: "2rem", letterSpacing: "0.2em" }}>
        Create Your
      </span>
    </div>

    <h1
      style={{
        fontFamily: "hagrid",
        fontWeight: "700",
        fontSize: "4rem",
        lineHeight: 1.1,
        margin: 0,
      }}
    >
      Week
      <br />
      Advent
      <br />
      Calendar
    </h1>
  </div>
</div>

      {/* RIGHT */}
      <div
        style={{
          flexBasis: "40%",
          maxWidth: "50%",
          padding: "3rem 3.5rem",
          paddingRight: "5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily:"hagrid", marginBottom: "2rem" }}>
          <h2 style={{ margin: 0, fontSize: "2rem" }}>
            {isSignup ? "Create new Account" : "Welcome back"}
          </h2>

          <p style={{ marginTop: "0.5rem" }}>
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link to="/login" style={{ textDecoration: "underline" }}>
                  Log in
                </Link>
              </>
            ) : (
              <>
                New here?{" "}
                <Link to="/signup" style={{ textDecoration: "underline" }}>
                  Create one
                </Link>
              </>
            )}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
