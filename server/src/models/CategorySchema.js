const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    // image: {
    //     type: String,
    //     required: true,
    // },
    // imageId: {
    //     type: String,
    //     required: true,
    // },
});

CategorySchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Category", CategorySchema, "categories");
