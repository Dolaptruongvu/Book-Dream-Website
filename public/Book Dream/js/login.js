const btnSignUpElm = document.querySelector(".btn-login");

btnSignUpElm.addEventListener("click", async () => {
  const emailELm = document.getElementById("email");
  const passwordElm = document.getElementById("password");

  if (!emailELm.value || !passwordElm.value) {
    alert("Vui lòng nhập đầy đủ các trường thông tin!");
    return;
  }
  try {
    const { data } = await axios.post("/api/v1/customer/login", {
      email: emailELm.value,
      password: passwordElm.value,
    });

    alert("Đăng nhập thành công");
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get("r");
    console.log(redirectTo);
    if (!!redirectTo) {
      window.location.href = redirectTo;
    } else {
      window.location.href = "/";
    }
  } catch (error) {
    alert(error.response.data.message);
    console.log(error);
  }
});
