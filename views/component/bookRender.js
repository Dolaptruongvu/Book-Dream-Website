const bookOverviewDiv = document.querySelector(".book-overview");
const bookInfoDiv = document.querySelector(".book-info");

// Sample book data from database
const overviewBook = {
    title: "Harry Potter",
    image: "../images/book-6.jpg",
    rating: 4.0,
    reviews: 256,
    likes: "456k",
    summary: [
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis aperiam ipsam nemo, excepturi atque nam recusandae obcaecati cum eius harum dolorum, maiores quasi repellat officiis debitis, possimus impedit doloremque id?",
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Provident, nihil delectus est laborum, aliquid facere aliquam necessitatibus nobis consectetur error expedita? Atque unde consequuntur voluptate consectetur fugit cupiditate quam excepturi!"
    ],
    author: "Kevin Smiley",
    publisher: "Printarea Studios",
    year: 2019,
    price: "$15.63",
    originalPrice: "$16.99",
    discount: "2%",
    quantity: 1,
    freeShipping: true,
    inStocks: true
};

const infoBook = {
    title: "Harry Potter",
    author: "Kevin Smiley",
    isbn: "121341381648",
    editionLanguage: "English",
    format: "Paperback, 450 Pages",
    datePublished: "August 10th 2019",
    publisher: "Webpress Inc.",
    tags: ["Drama", "Adventure", "Survival", "Biography", "Bestseller"]
};

// Update book-overview section
function updateBookOverview(book) {
    bookOverviewDiv.innerHTML = `
        <section class="book-overview">
            <div class="img">
                <img src="${book.image}" alt="" />
            </div>
            <div class="book-content">
                <h4>${book.title}</h4>
                <div class="meta">
                    <div class="review">
                        <div class="rating">
                            ${[...Array(Math.floor(book.rating))].map(() => '<i class="fa-solid fa-star"></i>').join('')}
                            ${book.rating % 1 >= 0.5 ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
                            <span>${book.rating.toFixed(1)}</span>
                        </div>
                        <div class="comment-like">
                            <small><img src="../images/comment.png" alt="" /> <span>${book.reviews} Reviews</span></small>
                            <small><img src="../images/like.png" alt="" /> <span>${book.likes} Likes</span></small>
                        </div>
                    </div>
                    <div class="social-btn">
                        <a href=""><i class="fa-brands fa-facebook-f"></i>Facebook</a>
                        <a href=""><i class="fa-brands fa-twitter"></i>Twitter</a>
                        <a href=""><i class="fa-brands fa-whatsapp"></i>Whatsapp</a>
                        <a href=""><i class="fa-regular fa-envelope"></i>Email</a>
                    </div>
                </div>
                <p>${book.summary[0]}</p>
                <p>${book.summary[1]}</p>
                <div class="footer">
                    <div class="author-detail">
                        <div class="author">
                            <small>Written by</small>
                            <strong>${book.author}</strong>
                        </div>
                        <div class="publisher">
                            <small>Publisher</small>
                            <strong>${book.publisher}</strong>
                        </div>
                        <div class="year">
                            <small>Year</small>
                            <strong>${book.year}</strong>
                        </div>
                    </div>
                    <div class="badge">
                        ${book.freeShipping ? '<span><i class="fa-solid fa-bolt-lightning"></i>free shipping</span>' : ''}
                        ${book.inStocks ? '<span><i class="fa-solid fa-shield"></i>in stocks</span>' : ''}
                    </div>
                </div>
                <div class="book-price">
                    <div class="price">
                        <strong>${book.price}</strong>
                        <strike>${book.originalPrice}</strike>
                        <span>${book.discount}</}</span>
                    </div>
                    <div class="input-group">
                        <div class="quantity">
                            <input type="button" value="-" class="button-minus" data-field="quantity" />
                            <input type="text" step="1" min="1" value="${book.quantity}" name="quantity" class="quantity-field" style="width: 4.5rem" />
                            <input type="button" value="+" class="button-plus" data-field="quantity" />
                        </div>
                        <button class="cartbtn"><i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>
                        <button class="like"><i class="fa-regular fa-heart"></i></button>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Update book-info section
function updateBookInfo(book) {
    bookInfoDiv.innerHTML = `
        <section class="book-info">
            <div class="detail-customer">
                <div class="tabbtns">
                    <button class="tablink" data-btn="detail">Details Product</button>
                </div>
                <div class="book-detail tabcontent" id="detail">
                    <div class="detail-line">
                        <strong>Book Title</strong><span>${book.title}</span>
                    </div>
                    <div class="detail-line">
                        <strong>Author</strong><span>${book.author}</span>
                    </div>
                    <div class="detail-line">
                        <strong>ISBN</strong><span>${book.isbn}(ISBN13: ${book.isbn})</span>
                    </div>
                    <div class="detail-line">
                        <strong>Edition Language</strong><span>${book.editionLanguage}</span>
                    </div>
                    <div class="detail-line">
                        <strong>Book Format</strong><span>${book.format}</span>
                    </div>
                    <div class="detail-line">
                        <strong>Date Published</strong><span>${book.datePublished}</span>
                    </div>
                    <div class="detail-line">
                        <strong>Publisher</strong><span>${book.publisher}</span>
                    </div>
                    <div class="detail-line tag-line">
                        <strong>Tags</strong>
                        <div class="tags">
                            ${book.tags.map(tag => `<span>${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Update both sections with the given book data
updateBookOverview(overviewBook);
updateBookInfo(infoBook);

console.log("Book overview and info sections have been updated.");