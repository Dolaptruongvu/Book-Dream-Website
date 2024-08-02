let loginForm = document.querySelector(".login-form");
let loginButton = loginForm.querySelector("button");
import { login } from "./login.js";
import { signup } from "./login.js";

loginButton.addEventListener("click", async function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();
  let emailInput = document.getElementById("email").value;
  let passwordInput = document.getElementById("password").value;

  await login(emailInput, passwordInput);

  // Your code to handle button click goes here
  console.log(`${emailInput} - ${passwordInput}`);
});

// Viet thêm trên file này nhé
// mongodb+srv://dolaptruongvu3:zyNNl5BSTJzlbBli@cluster0.6rzzevx.mongodb.net/Cinema?retryWrites=true&w=majority&appName=Cluster0

// Tiền đề: Giả sử HTML đã có form và các input field với các id phù hợp
let signupForm = document.querySelector(".registration");
let signupButton = signupForm.querySelector("button");

signupButton.addEventListener("click", async function (event) {
  // Ngăn chặn hành vi mặc định khi submit form
  event.preventDefault();

  // Lấy giá trị từ các trường input trong form đăng ký
  let userNameVal = document.getElementById("username").value;
  let userEmailVal = document.getElementById("email").value;
  let userPasswordVal = document.getElementById("password").value;
  let userConfirmPasswordVal =
    document.getElementById("confirm-password").value;

  // Gọi hàm signup từ module 'login.js'
  await signup(
    userNameVal,
    userEmailVal,
    userPasswordVal,
    userConfirmPasswordVal
  );

  // Có thể thêm các xử lý khác sau khi gọi hàm signup, ví dụ như thông báo thành công, xử lý lỗi, v.v.
  console.log(`Đăng ký với: ${userNameVal}, ${userEmailVal}`);
});
