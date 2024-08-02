import axios from "https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm";
import { showAlert } from "./alert.js";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/customer/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success" && res.status === 200) {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("https://www.facebook.com/");
      }, 1500);
    }
  } catch (err) {
    if (err.response.status === 303) {
      location.assign(`${err.response.data.data.url}`);
    } else {
      showAlert("error", err.response.data.message);
    }
  }
};

// export const logout = async () => {
//     try {
//       const res = await axios({
//         method: "GET",
//         url: "/api/v1/customer/logout",
//       });
//       if (res.data.status === "success") location.assign("/login");
//     } catch (err) {
//       showAlert("error", "Error logging out! Try again");
//     }
//   };

export const signup = async (userData) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/customer/signup",
      data: userData,
    });

    console.log(res)

    if (res.data.status === "success") {
      showAlert("success", "Signup Successfully");

      window.setTimeout(() => {
        location.assign("https://www.facebook.com/");
      }, 1500);
    }
  } catch (err) {
    
    showAlert("error", err.response.data.message);
  }
};