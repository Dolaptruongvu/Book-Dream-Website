const fields = [
  "title",
  "images",
  "author",
  "category",
  "language",
  "translator",
  "totalPages",
  "releaseDate",
  "publisher",
  "coverType",
  "weight",
  "quantity",
  "summary",
  "ratings",
  "price",
];

$("#add-book").click(async function (e) {
  let image = null;
  const valueField = fields.map((item) => {
    const selector = $(`input[name="${item}"]`);
    const value = selector.val();

    if (item === "images") {
      image = selector.prop("files")[0];
    }
    return [item, value];
  });

  let validated = true;
  valueField.forEach((item) => {
    if (validated && !item[1]) {
      alert(`"Field ${item[0]} là trường bắt buộc.`);
      validated = false;
    }
  });

  if (!validated) {
    return;
  }

  const formData = new FormData();
  valueField.forEach((item) => {
    if (item[0] === "images") {
      formData.append(item[0], image);
      return;
    }

    if (
      ["price", "totalPages", "ratings", "weight", "quantity"].includes(item[0])
    ) {
      const valueNumber = Number(item[1]);
      formData.append(item[0], isNaN(valueNumber) ? 0 : valueNumber);
      return;
    }

    formData.append(item[0], item[1]);
  });

  try {
    await axios.post("/api/v1/books/create", formData);
    alert("Tạo book thành công!");
    window.location.reload();
  } catch (error) {
    console.error(error);
    alert("Something was wrong!");
  }
});

$(".delete-book").click(async function (e) {
  const bookId = $(e.target).data("id");

  if (confirm("Bạn có chắc muốn xóa sách này không!")) {
    try {
      await axios.delete(`/api/v1/books/${bookId}`);
      alert("Xóa sách thành công!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Something was wrong!");
    }
  }
});
