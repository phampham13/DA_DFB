import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { userRoutes, adminRoutes } from "../src/routes";
import DefaultLayoutAdmin from "./layouts/AdminLayout/DefaultLayout/DefaultLayout";
import DefaultLayoutUser from "./layouts/UserLayout/DefaultLayOutUser";

import { ToastContainer } from "react-toastify";

import "./index.css";
function App() {
  const tokenLocal = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <div className="App">
      <Routes>
        {userRoutes.map((route, index) => {
          const Page = route.component;
          let Layout = DefaultLayoutUser;
          if (route.layout !== null) {
            Layout = route.layout;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                  <ToastContainer
                    position="top-right"
                    autoClose={1500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover={false}
                    theme="colored"
                    style={{ marginTop: "40px" }}
                  />
                </Layout>
              }
            />
          );
        })}

        {/* privateRoutes */}
        {/* {user && user.role === "ADMIN" ? // Kiểm tra có phải là admin hay không */}
        {
          adminRoutes.map((route, index) => {
            // Check if there is a token and the role is "admin"
            //if (!tokenLocal || !role || role !== "admin") {
            // Redirect to login if the conditions are not met
            // return null;
            //}
            const Page = route.component;
            let Layout = DefaultLayoutAdmin;
            if (route.layout) {
              Layout = route.layout;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout title={route.title}>
                    <Page />
                    <ToastContainer
                      position="top-right"
                      autoClose={1500}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick={false}
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover={false}
                      theme="colored"
                      style={{ marginTop: "40px" }}
                    />
                  </Layout>
                }
              />
            );
          })
          // :''}
        }

        {/* Điều hướng mặc định */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
