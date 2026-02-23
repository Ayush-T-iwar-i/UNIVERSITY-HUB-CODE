exports.successResponse = (res, message, data = {}, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

exports.errorResponse = (res, message, status = 500) => {
  return res.status(status).json({
    success: false,
    message,
  });
};
