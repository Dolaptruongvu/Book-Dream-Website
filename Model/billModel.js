const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");

// Define the Bill model
class Bill extends Model {}

Bill.init(
  {
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "The bill needs to have a price",
        },
        isFloat: {
          msg: "Price must be a number",
        },
      },
    },
    createAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
    },
    haspaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ordered: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Bill",
    tableName: "bills",
    timestamps: false, // Sequelize by default includes createdAt and updatedAt, so disable if not needed
  }
);

// Define the associations
Bill.associate = function (models) {
  Bill.belongsTo(models.Customer, {
    as: "customer",
    foreignKey: {
      name: "customerId",
      allowNull: false,
      field: "customer_id",
    },
  });

  Bill.belongsTo(models.Customer, {
    as: "shipper",
    foreignKey: {
      name: "shipperId",
      allowNull: false,
      field: "shipper_id",
    },
  });

  Bill.belongsToMany(models.Book, {
    through: "BillBooks",
    as: "books",
    foreignKey: {
      name: "billId",
      allowNull: false,
      field: "bill_id",
    },
  });
};

module.exports = Bill;
