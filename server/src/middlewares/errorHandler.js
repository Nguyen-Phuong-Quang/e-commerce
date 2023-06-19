module.exports = (err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Interval server error!";

    // console.log({
    //     success: false,
    //     status: errorStatus,
    //     message: errorMessage,
    //     stack: err.stack.split("    "),
    // });

    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack.split("    "),
    });
};
