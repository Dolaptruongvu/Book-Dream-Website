$(".delete-book").click(function (e) {
  const id = $(e.currentTarget).data("bookid");
  const currentVal = Number(getCookie("cart-" + id) ?? 0);
  const currentProdVal = Number(getCookie("product-length") ?? 0);
  setCookie("product-length", currentProdVal - currentVal, 100);
  setCookie("cart-" + id, 0, 100);
  window.location.reload();
});

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

$("#online-pay").click(async function (e) {
  const price = $("#total-price").data("totalprice");
  try {
    const cookieObject = document.cookie.split("; ").reduce((prev, current) => {
      const [name, ...value] = current.split("=");
      prev[name] = value.join("=");
      return prev;
    }, {});
    const prods = Object.entries(cookieObject)
      .filter((item) => item[0].search("cart-") > -1)
      .reduce((pre, curr) => {
        if (Number(curr[1]) <= 0) {
          return pre;
        }
        return {
          ...pre,
          [curr[0].split("-")[1]]: Number(curr[1]),
        };
      }, {});
    const billRes = await axios.post("/api/v1/bill", {
      price,
      book: Object.keys(prods),
    });

    const sessionStripeRes = await axios.get(
      `/api/v1/bill/checkout-session/${billRes.data.data._id}`
    );
    window.open(sessionStripeRes.data.url);
  } catch (e) {
    console.log(e.response);
    if (e.response.status == 401) {
      window.location.href = "/login?r=/cart";
    }
  }
});

$("#cash-pay").click(async function (e) {
  const price = $("#total-price").data("totalprice");
  try {
    const cookieObject = document.cookie.split("; ").reduce((prev, current) => {
      const [name, ...value] = current.split("=");
      prev[name] = value.join("=");
      return prev;
    }, {});
    const prods = Object.entries(cookieObject)
      .filter((item) => item[0].search("cart-") > -1)
      .reduce((pre, curr) => {
        if (Number(curr[1]) <= 0) {
          return pre;
        }
        return {
          ...pre,
          [curr[0].split("-")[1]]: Number(curr[1]),
        };
      }, {});
    const billRes = await axios.post("/api/v1/bill", {
      price,
      book: Object.keys(prods),
    });

    window.location.href = `/success/${billRes.data.data._id}`;
  } catch (e) {
    console.log(e.response);
    if (e.response.status == 401) {
      window.location.href = "/login?r=/cart";
    }
  }
});
