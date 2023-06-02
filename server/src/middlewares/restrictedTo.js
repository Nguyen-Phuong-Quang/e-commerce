const CustomErrorHandler = require("../utils/CustomErrorHandler")

const restrictedTo = (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new CustomErrorHandler(403, 'You do not have permission to perform this action!'))
        next();
    }

module.exports = restrictedTo