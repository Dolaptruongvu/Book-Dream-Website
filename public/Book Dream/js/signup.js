const btnSignUpElm = document.querySelector(".btn-signup");

btnSignUpElm.addEventListener("click", async () => {
  const nameElm = document.getElementById("name");
  const emailELm = document.getElementById("email");
  const addressElm = document.getElementById("address");
  const phoneElm = document.getElementById("phone");
  const passwordElm = document.getElementById("password");
  const confirmElm = document.getElementById("cpassword");

  if (
    !nameElm.value ||
    !emailELm.value ||
    !addressElm.value ||
    !passwordElm.value ||
    !phoneElm.value ||
    !confirmElm.value
  ) {
    alert("Vui lòng nhập đầy đủ các trường thông tin!");
  } else if (passwordElm.value !== confirmElm.value) {
    alert("Mật khẩu xác nhận không khớp");
  } else {
    try {
      const { data } = await axios.post("/api/v1/customer/signup", {
        name: nameElm.value,
        email: emailELm.value,
        address: addressElm.value,
        phoneNumber: phoneElm.value,
        password: passwordElm.value,
        passwordConfirm: confirmElm.value,
      });

      alert("Đăng ký thành công");
      window.location.href = "/";
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại");
      console.log(error);
    }
  }
});
