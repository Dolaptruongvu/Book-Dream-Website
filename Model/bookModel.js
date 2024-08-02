const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");

class Book extends Model {}

Book.init(
  {
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notEmpty: {
          msg: "Book title is required",
        },
        len: {
          args: [0, 100],
          msg: "Book title cannot exceed 100 characters",
        },
      },
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notEmpty: {
          msg: "Author name is required",
        },
      },
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Category is required",
        },
      },
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notEmpty: {
          msg: "Language is required",
        },
      },
    },
    translator: {
      type: DataTypes.STRING,
      allowNull: true,
      trim: true,
    },
    totalPages: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Total pages are required",
        },
        isInt: {
          msg: "Total pages must be a number",
        },
      },
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Release date is required",
        },
        isDate: {
          msg: "Release date must be a valid date",
        },
      },
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notEmpty: {
          msg: "Publisher is required",
        },
      },
    },
    coverType: {
      type: DataTypes.STRING,
      allowNull: true,
      trim: true,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Summary is required",
        },
      },
    },
    ratings: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: "Rating must be above 1.0",
        },
        max: {
          args: [5],
          msg: "Rating must be below 5.0",
        },
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Price is required",
        },
        isFloat: {
          msg: "Price must be a number",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "books",
    timestamps: false,
  }
);

module.exports = Book;
