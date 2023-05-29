const multer = require("multer");
const CustomErrorHandler = require("./CustomErrorHandler");

const storage = multer.memoryStorage();

const limits = {
    fileSize: 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|WEBP|webp)$/)) {
        req.fileValidationError = "Only image files allowed!";
        return cb(
            new CustomErrorHandler(400, "Only image files allowed!"),
            false
        );
    }

    cb(null, true);
};

// Upload single image
exports.uploadSingleFile = function (name) {
    return function (req, res, next) {
        const upload = multer({
            storage,
            limits,
            fileFilter,
        }).single(name);

        upload(req, res, (err) => {
            if (
                err instanceof multer.MulterError &&
                err.code === "LIMIT_UNEXPECTED_FILE"
            )
                return next(
                    new CustomErrorHandler(400, "Only one image allowed!")
                );

            if (err) return next(new CustomErrorHandler(400, err));
            next();
        });
    };
};

// Upload any file with any name
exports.uploadAnyFile = function () {
    return function (req, res, next) {
        const upload = multer({
            storage,
            limits,
            fileFilter,
        }).any();

        upload(req, res, (err) => {
            if (err) return next(new CustomErrorHandler(500, err));
            next();
        });
    };
};
