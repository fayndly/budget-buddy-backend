export default (res, err, message = null, status = 500) => {
  return res.status(status).json({
    message: message || err.message,
    error: Object.keys(err).length !== 0 ? err : err.toString(),
  });
};
