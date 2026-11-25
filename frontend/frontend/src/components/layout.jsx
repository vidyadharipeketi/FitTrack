import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <>
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Page Content */}
      <div className="d-flex">
        <Sidebar />

        <div
          className="flex-grow-1 p-4"
          style={{
            marginLeft: "250px",
            marginTop: "70px",
            minHeight: "100vh",
            background: "#f8f9fa",
            overflowX: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;