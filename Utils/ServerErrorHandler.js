export default (res, err, message, status = 500) => {
  console.log(err);
  return res.status(status).json({
    message,
  });
};
