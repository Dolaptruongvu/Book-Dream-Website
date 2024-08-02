const { DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
const { bcrypt } = require("bcryptjs");
const { crypto } = require("crypto");
const { validator } = require("validator");

class Customer extends Model {
  async correctPassword(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }

  changedPasswordAfter(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return changedTimestamp > JWTTimestamp;
    }
    return false;
  }

  createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
  }
}

Customer.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please tell your name!",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: {
        isEmail: {
          msg: "Please provide a valid email",
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide your address",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Please provide your phone number",
        },
      },
    },
    photo: {
      type: DataTypes.STRING,
      defaultValue: "default.jpg",
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "shipper"),
      defaultValue: "user",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8],
          msg: "Please provide a password with at least 8 characters",
        },
      },
    },
    passwordConfirm: {
      type: DataTypes.VIRTUAL, // This field won't be stored in the database
      allowNull: false,
      validate: {
        // Custom validator to match passwordConfirm with password
        confirmPassword(value) {
          if (value !== this.password) {
            throw new Error("The passwords are not the same!");
          }
        },
      },
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    point: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    numbOfOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Customer",
    tableName: "customers",
    hooks: {
      beforeSave: async (customer) => {
        if (customer.changed("password")) {
          customer.password = await bcrypt.hash(customer.password, 12);
          customer.passwordConfirm = undefined;
        }
      },
      beforeSave: (customer) => {
        if (!customer.isNewRecord && customer.changed("password")) {
          customer.passwordChangedAt = new Date(Date.now() - 1000);
        }
      },
      beforeFind: (options) => {
        options.where = options.where || {};
        if (options.where.active === undefined) {
          options.where.active = true;
        }
      },
    },
    defaultScope: {
      where: {
        active: true,
      },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  }
);

module.exports = Customer;
