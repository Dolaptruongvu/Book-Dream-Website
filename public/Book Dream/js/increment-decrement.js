function incrementValue(e) {
  e.preventDefault();
  var fieldName = $(e.target).data("field");
  var parent = $(e.target).closest("div");
  var currentVal = parseInt(
    parent.find("input[name=" + fieldName + "]").val(),
    10
  );

  if (!isNaN(currentVal)) {
    parent.find("input[name=" + fieldName + "]").val(currentVal + 1);
  } else {
    parent.find("input[name=" + fieldName + "]").val(0);
  }
}

function decrementValue(e) {
  e.preventDefault();
  var fieldName = $(e.target).data("field");
  var parent = $(e.target).closest("div");
  var currentVal = parseInt(
    parent.find("input[name=" + fieldName + "]").val(),
    10
  );

  if (!isNaN(currentVal) && currentVal > 0) {
    parent.find("input[name=" + fieldName + "]").val(currentVal - 1);
  } else {
    parent.find("input[name=" + fieldName + "]").val(0);
  }
}

$(".button-plus").click(function (e) {
  incrementValue(e);
});

$(".button-minus").click(function (e) {
  decrementValue(e);
});

const nop = $("#number-of-product");
const titleFiled = $("#book-title");

const idBook = titleFiled.data("id");

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const productCheckoutLength = Number(getCookie("product-length") ?? 0);
nop.text(productCheckoutLength);

$("#add-to-card").click(function (e) {
  const inputField = $("#input-quantity");
  const inputValue = inputField.val();
  const currentVal = Number(getCookie("cart-" + idBook) ?? 0);
  const currentProdVal = Number(getCookie("product-length") ?? 0);
  const cnop = $("#number-of-product");
  setCookie("product-length", currentProdVal + Number(inputValue), 100);
  setCookie("cart-" + idBook, Number(inputValue) + currentVal, 100);
  cnop.text(currentProdVal + Number(inputValue));
});


