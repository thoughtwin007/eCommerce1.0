const asyncErrorHandler = (requestHandler) => {
    // console.log("errorHandler")
    return (req, res, next) => requestHandler(req, res, next).catch(err => next(err))
}
export default asyncErrorHandler;