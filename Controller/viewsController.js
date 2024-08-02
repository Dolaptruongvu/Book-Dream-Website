const Book = require("../Model/bookModel"); // Import the Book model
const Bill = require("../Model/billModel");
const { catchAsync } = require("../utils/catchAsync"); // Import catchAsync helper
const Customer = require("../Model/customerModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  const famousBooks = await Book.find({ ratings: { $gte: 4.7 } });
  const specialOffer = await Book.find({ price: { $lte: 10 } });

  res.status(200).render("index", {
    famousBooks, // Pass the books data to the template
    specialOffer,
  });
});

//login  page
exports.getLogin = catchAsync(async (req, res, next) => {
  if (res.locals?.customer) {
    res.redirect("/");
    return;
  }
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

//signup  page
exports.getSignup = catchAsync(async (req, res, next) => {
  const user = res.locals?.customer;
  if (res.locals?.customer) {
    res.redirect("/");
    return;
  }
  res.status(200).render("signup", {});
});

// show filtered products
exports.filteredBooks = catchAsync(async (req, res, next) => {
  const { date, s, p } = req.query; // Get the category from query string
  const queryUrl = new URLSearchParams();

  const categoriesQuery = Object.entries(req.query)
    .filter((item) => item[0].search("categories-") > -1)
    .map((item) => item[1]); /// [[key, value],...]

  let query = {};

  // category
  if (categoriesQuery.length > 0) {
    query = { category: { $in: categoriesQuery } }; // Use $in to match any of the categories
    categoriesQuery.forEach((item, index) => {
      queryUrl.append("categories-" + index, item);
    });
  }
  // date
  if (date) {
    query = {
      ...query,
      releaseDate: new Date(date),
    };
    queryUrl.append("date", date);
  }

  if (!!s) {
    query = { ...query, title: { $regex: s } };
    queryUrl.append("s", s);
  }

  /// pagination
  const limit = 12;
  let page = 1;
  // page
  if (p && !isNaN(Number(p))) {
    page = Number(p);
  }

  const books = await Book.find(query, undefined, {
    limit,
    skip: (page - 1) * limit,
  }); // Find books matching the query
  const totalRecords = await Book.countDocuments(query);
  const totalPage = Math.floor(totalRecords / limit) + 1;
  const currentQueryUrlString = !queryUrl.toString().trim()
    ? "?="
    : queryUrl.toString();
  const previousPage =
    page === 1 ? null : currentQueryUrlString + "&p=" + (page - 1);
  const nextPage =
    page === totalPage ? null : currentQueryUrlString + "&p=" + (page + 1);
  res.status(200).render("book-filter", {
    books,
    pagination: {
      totalRecords,
      totalPage,
      previousPage,
      nextPage,
    },
    currentQueryUrlString,
  });
});
// exports.filteredBook = catchAsync(async (req, res, next) => {
//   const { category } = req.query; // Get the category from query string

//   let query = {};
//   if (category) {
//     const categories = category.split(','); // Split the category string into an array of categories
//     query = { category: { $in: categories } }; // Use $in to match any of the categories
//   }

//   const books = await Book.find(query); // Find books matching the query

//   res.status(200).render("book-filter",{
//     books
//   });
// });

// show shipping bills

exports.getShipBills = catchAsync(async (req, res, next) => {
  const bills = await Bill.find({ shipper: req.customer.id });

  res.status(200).render("", {
    bills,
  });
});

// show profile
exports.getProfile = catchAsync(async (req, res, next) => {
  const user = res.locals.customer;
  const { page, name } = req.query;

  if (!user) {
    res.redirect("/login?r=/profile");
    return;
  }
  const filter =
    user.role === "user"
      ? {
          customer: {
            _id: user._id,
          },
        }
      : {
          shipper: {
            _id: user._id,
          },
        };

  const listBills = await Bill.find(filter);

  const books = [];
  if (name && page === "edit") {
    const booksDb = await Book.find({ title: { $regex: name } });
    booksDb.forEach((book) => {
      books.push(book);
    });
  }
  res.status(200).render("profile", {
    listBills,
    page,
    books,
  });
});

//Book Detail
exports.getBookDetail = catchAsync(async (req, res, next) => {
  const { bookId } = req.params; //fix to your logic
  const book = await Book.findById(bookId); //fix to your logic
  res.status(200).render("book-detail", {
    //rendering
    book, //fix to your logic
  });
});

//Cart
exports.getCart = catchAsync(async (req, res, next) => {
  const cartItems = req.cookies;
  const prods = Object.entries(req.cookies)
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

  const listBooks = await Book.find({ _id: { $in: Object.keys(prods) } });
  const totalPrice = listBooks.reduce(
    (pre, curr) => pre + Number(curr.price) * prods[curr.id],
    0
  );

  res.status(200).render("cart-item", {
    //rendering
    books: listBooks.map((item) => {
      return {
        ...item.toJSON(),
        userQuantity: prods[item.id],
        totalPrice: prods[item.id] * item.price,
      };
    }), //fix to your logic
    totalPrice,
  });
});

//getContracts
exports.getContracts = (req, res, next) => {
  res.status(200).render("contact"); // Rendering
};

//getContracts
exports.getSuccess = catchAsync(async (req, res, next) => {
  const billId = req.params.billId;

  const bill = await Bill.findById(billId);

  const customer = res.locals.customer;
  // const user = await Customer.findById()
  res.status(200).render("success", {
    bill,
  }); // Rendering
});
