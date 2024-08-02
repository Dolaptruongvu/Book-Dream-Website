const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.destroy({ where: { id: req.params.id } });
    if (!document) {
      return next(new AppError(`No document found with that id`, 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const [updatedRowCount, [updatedDocument]] = await Model.update(req.body, {
      where: { id: req.params.id },
      returning: true, // Return the updated document
      individualHooks: true, // Run hooks like validation
    });

    if (updatedRowCount === 0) {
      return next(new AppError(`No document found with that id`, 404));
    }

    res.status(200).json({
      status: "success",
      data: updatedDocument,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: document,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findOne({ where: { id: req.params.id } });

    if (popOptions) {
      query = query.include(popOptions);
    }

    const document = await query;
    if (!document) {
      return next(new AppError(`No document found with that id`, 404));
    }

    res.status(200).json({
      status: "success",
      data: document,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const documents = await Model.findAll();

    res.status(200).json({
      status: "success",
      result: documents.length,
      timeAtRequest: req.requestTime,
      data: documents,
    });
  });
