const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
const Book = require("./bookModel");
const Customer = require("./customerModel");

class Review extends Model {
  static async calcAverageRating(bookId) {
    const stats = await this.findAll({
      where: { bookId },
      attributes: [
        "bookId",
        [sequelize.fn("COUNT", sequelize.col("rating")), "nRatings"],
        [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
      ],
      group: ["bookId"],
    });

    if (stats.length > 0) {
      await Book.update(
        {
          ratingQuantity: stats[0].dataValues.nRatings,
          ratingsAverage: stats[0].dataValues.avgRating,
        },
        { where: { id: bookId } }
      );
    } else {
      await Book.update(
        {
          ratingQuantity: 0,
          ratingsAverage: 4.5,
        },
        { where: { id: bookId } }
      );
    }
  }
}

Review.init(
  {
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Review can not be empty",
        },
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "The rating should be greater or equal to 1",
        },
        max: {
          args: [5],
          msg: "The rating should be less than or equal to 5",
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["customerId", "bookId"],
      },
      {
        fields: ["bookId"],
      },
    ],
  }
);

// Associations
Review.belongsTo(Book, { foreignKey: "bookId" });
Review.belongsTo(Customer, { foreignKey: "customerId" });

// Hooks
Review.addHook("afterCreate", async (review, options) => {
  await review.constructor.calcAverageRating(review.bookId);
});

Review.addHook("beforeFind", (options) => {
  options.include = [
    {
      model: Customer,
      attributes: ["name", "photo"],
    },
  ];
});

Review.addHook("afterUpdate", async (review, options) => {
  if (review.r) {
    await review.constructor.calcAverageRating(review.r.bookId);
  }
});

module.exports = Review;
