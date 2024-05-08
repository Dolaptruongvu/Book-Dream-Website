import axios from "axios";
import { showAlert } from "../../Public/jsevent/alert";

export const signup = async (userData) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/customer/signup",
      data: userData,
    });

    console.log(res);

    if (res.data.status === "success") {
      showAlert("success", "Signup Successfully");

      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
