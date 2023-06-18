const CustomErrorHandler = require("./CustomErrorHandler");

const apiFeatures = async (req, Model, populate = []) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Regex field
    const regexField = [
        "name",
        "email",
        "address",
        "companyName",
        "phone",
        "slug",
    ];

    regexField.forEach((field) => {
        reqQuery[field] = new RegExp(reqQuery[field], "i");
    });

    // Fields to exclude
    const removeQueryFields = ["sort", "limit", "page", "select", "filter"];

    // Loop over removeFields and delete them from reqQuery
    removeQueryFields.forEach((field) => delete reqQuery[field]);

    // Find resources
    query = Model.find(reqQuery);

    // Select fields with no passwrod if it is user information
    const fieldsSelect =
        "-password" +
        " " +
        (req.query.select ? req.query.select.split(",").join(" ") : "");
    query = query.select(fieldsSelect);

    // Sort fields
    if (req.query.sort) {
        // Change sort field to array
        const sortFields = req.query.sort.split(",");

        // type = asc or desc
        const type = sortFields[0];

        const sortObj = {};

        sortFields.forEach((field) => {
            sortObj[field] = type;
        });

        delete sortObj[sortFields[0]];

        query = query.sort(sortObj);
    }

    // Panigation
    const page = req.query.page * 1 | 1;
    const limit = req.query.limit * 1 | 100;

    // Skip to page
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (populate) query = query.populate(populate);

    // Execute query
    query = await query;

    if (!query) throw new CustomErrorHandler(404, "No data found!");

    // Filter
    if (req.query.filter) {
        const filter = req.query.filter.split(",").join(" ");
        query = query.filter(
            (data) =>
                JSON.stringify(data)
                    .toLowerCase()
                    .indexOf(filter.toLowerCase()) !== -1
        );
    }

    return query;
};

module.exports = apiFeatures;
