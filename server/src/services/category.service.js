const CategorySchema = require("../models/CategorySchema");
const apiFeatures = require("../utils/apiFeatures");
const {
    uploadFileCloudinary,
    destroyFileCloudinary,
} = require("../utils/cloudinary");
const statusType = require("../constants/statusType");

/**
 * @desc    Create New Category
 * @param   { String } name - Category name
 * @param   { String } description - Category description
 * @param   { object } imageFile - Category image
 * @returns { object<type|message|statusCode|category> }
 */
exports.createCategory = async (name, description) => {
    // 1. Check if messing field
    // if (!name || !description || !imageFile)
    //     return {
    //         type: statusType.error,
    //         message: "Missing field!",
    //         statusCode: 400,
    //     };

        if (!name || !description)
        return {
            type: statusType.error,
            message: "Missing field!",
            statusCode: 400,
        };

    // // 2. Folder path
    // const folderName = `Categories/${name.trim().split(" ").join("-")}`;

    // // 3. Image response after upload
    // const imageUploadResponse = await uploadFileCloudinary(
    //     imageFile.buffer,
    //     folderName
    // );

    // 4. Create category
    const category = await CategorySchema.create({
        name,
        description,
        // image: imageUploadResponse.secure_url,
        // imageId: imageUploadResponse.public_id,
    });

    await  category.save();

    return {
        type: statusType.success,
        message: "Create category successfully!",
        statusCode: 200,
        category,
    };
};

/**
 * @desc    Get Category Using It's ID
 * @param   { String } categoryId - Category ID
 * @returns { object<type|message|statusCode|category> }
 */
exports.getCategoryById = async (categoryId) => {
    const category = await CategorySchema.findById(categoryId);

    // Check catgory if not exist
    if (!category)
        return {
            type: statusType.error,
            message: "No category found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Category found!",
        statusCode: 200,
        category,
    };
};

/**
 * @desc    Query Categories
 * @param   { object } req - Request object
 * @returns { object<type|message|statusCode|categories> }
 */
exports.getCategoriesByQuery = async (req) => {
    const categories = await apiFeatures(req, CategorySchema);

    // Checck if no category found
    if (!categories || categories.length === 0)
        return {
            type: statusType.error,
            message: "No category found!",
            statusCode: 404,
        };
    return {
        type: statusType.success,
        message: "Category found!",
        statusCode: 200,
        categories,
    };
};

/**
 * @desc    Update Category Detail
 * @param   { String } categoryId - Category ID
 * @param   { object } body - Category details
 * @returns { object<type|message|statusCode|category> }
 */
exports.updateCategoryDetail = async (categoryId, body) => {
    let category = await CategorySchema.findById(categoryId);

    // 1. Check category if not exist
    if (!category)
        return {
            type: statusType.error,
            message: "No category found!",
            statusCode: 404,
        };

    // 2. Update category detail
    category = await CategorySchema.findByIdAndUpdate(categoryId, body, {
        new: true,
        runValidators: true,
    });

    return {
        type: statusType.success,
        message: "Update category successfully!",
        statusCode: 200,
        category,
    };
};

/**
 * @desc    Update Category Image
 * @param   { String } categoryId - Category ID
 * @param   { object } imageFile - Category image
 * @returns { object<type|message|statusCode|category> }
 */
// exports.updateCategoryImage = async (categoryId, imageFile) => {
//     // 1. Check image if missed
//     if (imageFile === undefined)
//         return {
//             type: statusType.error,
//             message: "Image required!",
//             statusCode: 400,
//         };

//     let category = await CategorySchema.findById(categoryId);

//     // 2. Check category if not exist
//     if (!category)
//         return {
//             type: statusType.error,
//             message: "No category found!",
//             statusCode: 404,
//         };

//     // 3. Delete old image
//     await destroyFileCloudinary(category.imageId);

//     // 4. Folder path
//     const folderName = `Categories/${category.name
//         .trim()
//         .split(" ")
//         .join("-")}`;

//     // 5. Response after upload
//     const imageUploadResponse = await uploadFileCloudinary(
//         imageFile.buffer,
//         folderName
//     );

//     // 6. Update category image
//     category = await CategorySchema.findByIdAndUpdate(
//         categoryId,
//         {
//             image: imageUploadResponse.secure_url,
//             imageId: imageUploadResponse.public_id,
//         },
//         { new: true, runValidators: true }
//     );

//     return {
//         type: statusType.success,
//         message: "Update category successfully!",
//         statusCode: 200,
//         category,
//     };
// };

/**
 * @desc    Delete Category
 * @param   { String } categoryId - Category ID
 * @returns { object<type|message|statusCode> }
 */
exports.deleteCategory = async (categoryId) => {
    let category = await CategorySchema.findById(categoryId);

    // 1. Check category if not exist
    if (!category)
        return {
            type: statusType.error,
            message: "No category found!",
            statusCode: 404,
        };

    // 2. Delete category image
    // await destroyFileCloudinary(category.imageId);

    // 3. Delete category
    await CategorySchema.findByIdAndDelete(categoryId);

    return {
        type: statusType.success,
        message: "Delete category successfully!",
        statusCode: 200,
    };
};
