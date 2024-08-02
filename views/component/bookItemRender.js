const bookDiv = document.querySelector(".books");
//fetch
//assign it into bookList là húp

// const bookList = [
//   {
//     title: "Moby Dick",
//     image: "../Public/Img/Books/MobyDick-cover.jpg",
//     genres: ["Adventure", "Drama"],
//   },
//   {
//     title: "Pride And Prejudice",
//     image: "../Public/Img/Books/PrideAndPrejudice-cover.jpg",
//     genres: ["Adventure"],
//   },
//   {
//     title: "The Fellowship Of The Ring",
//     image: "../Public/Img/Books/TheFellowshipOfTheRing-cover.jpg",
//     genres: ["Adventure", "Drama"],
//   },
//   {
//     title: "The Return Of The King",
//     image: "../Public/Img/Books/TheReturnOfTheKing-cover.jpg",
//     genres: ["Thriller", "Drama"],
//   },
//   {
//     title: "The Two Towers",
//     image: "../Public/Img/Books/TheTwoTowers-cover.jpg",
//     genres: ["Adventure", "Thriller"],
//   },
//   {
//     title: "To Kill A Mockingbird",
//     image: "../Public/Img/Books/ToKillAMockingbird-cover.jpg",
//     genres: ["Drama"],
//   },
// ];

// Clear the inner HTML of bookDiv
bookDiv.innerHTML = "";

// Loop through the bookList array
bookList.forEach((book) => {
  // Create a div element for each book
  const bookCard = document.createElement("div");
  bookCard.classList.add("book-card");

  // Create the image element
  const imgDiv = document.createElement("div");
  imgDiv.classList.add("img");

  const imgLink = document.createElement("a");
  imgLink.href = "book-detail.html";

  const img = document.createElement("img");
  img.src = book.image;
  img.alt = "";

  imgLink.appendChild(img);
  imgDiv.appendChild(imgLink);

  // Create the like button
  const likeButton = document.createElement("button");
  likeButton.classList.add("like");
  likeButton.id = "likebtn";
  likeButton.innerHTML = '<i class="fa-regular fa-heart"></i>';

  imgDiv.appendChild(likeButton);

  // Append the image div to the book card
  bookCard.appendChild(imgDiv);

  // Create and append the title element
  const title = document.createElement("h5");
  title.textContent = book.title;
  bookCard.appendChild(title);

  // Create and append the genre element
  const small = document.createElement("small");
  const genres = book.genres;
  genres.forEach((genre) => {
    const genreLink = document.createElement("a");
    genreLink.href = "#"; // Replace '#' with the appropriate URL
    genreLink.textContent = genre;
    small.appendChild(genreLink);
    small.appendChild(document.createTextNode(", ")); // Add comma and space
  });
  // Remove the last comma and space
  small.lastChild.remove();
  bookCard.appendChild(small);

  // Create and append the star rating
  const starRating = document.createElement("div");
  starRating.classList.add("star-rating");
  for (let i = 0; i < 5; i++) {
    const star = document.createElement("i");
    star.classList.add("fa-solid", "fa-star");
    starRating.appendChild(star);
  }
  bookCard.appendChild(starRating);

  // Append the book card to the bookDiv
  bookDiv.appendChild(bookCard);
});

console.log(bookDiv);
