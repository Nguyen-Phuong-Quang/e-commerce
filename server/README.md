<br />
<h1 align="center">
  <a href="https://github.com/PhuongKwang/graduation_research_1">
    <img src="https://hackernoon.com/hn-images/1*lAR9Uh_gJ7dp23e0vhy5Hg.png" alt="Logo" width="200" height="200">
  </a>

  <h3 align="center">Graduation research 1</h3>
</h1>

<h4 align="center">E-commerce API built using NodeJS & MongoDB</h4>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#key-features">Key Features</a>
    </li>
    <li>
      <a href="#built-with">Built With</a>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
  </ol>
</details>

## Key Features

* Authentication
  * Login [Public]
  * SignUp [Public]
  * Logout [User]
  * Tokens [User]
* Password Management
  * Change Password [User]
  * Forgot Password [Public]
  * Reset Password  [Public]
* User Services
  * Create New User [Admin]
  * Get All Users [Public]
  * Get User Data Using It's ID [Public]
  * Update User Details Using It's ID [User]
  * Update User Profile Image Using It's ID [User]
  * Delete User Using It's ID [Admin]
* Cart Services
  * Add Product To Cart [User]
  * Decrease Product Quantity By One [User]
  * Increase Product Quantity By One [User]
  * Get Cart [User]
  * Delete Cart Item [User]
  * Delete Cart [User]
* Review Services
  * Create New Review [User] 
  * Query All Reviews [Public]
  * Query Review Using It's ID [Public]
  * Update Review Using It's ID [User]
  * Delete Review Using It's ID [User]
* Product Services
  * Query products [Public]
  * Query Product Using It's ID [Public]
  * Create new product [Seller]
  * Update Product Details [Seller]
  * Update Product Images [Seller]
  * Delete Product Using It's ID [Seller]
  * Get Products Statics [Admin]
  * Add Product Color [Seller]
  * Delete Product Color [Seller]
  * Add Product Size [Seller]
  * Delete Product Size [Seller]
* Favorite Services
  * Get Favorite Products List [User]
  * Add Product to Favorite List [User]
  * Delete Product From Favorite List [User]
  * Check If Product In Favorite List [User]
* Discount Services
  * Generate Discount Code [Admin]
  * Get Dicount Amount [User]
  * Get All Discount Codes [Admin]
  * Verify Discount Code [User]
  * Delete Discount Code [Admin]
  * Cancel Discount Code [User]
* Order Services
  * Create New Order [User]
  * Query Orders [User]
  * Query Order Using It's ID [User]
  * Cancel Order [User]
  * Update Order Status [Admin], [Seller]
* Category Services
  * Create New Category [User]
  * Query Categories [Public]
  * Query Category Using It's ID [Public]
  * Update Category Details [Admin]
  * Update Category Image [Admin]
  * Delete Category [Admin]
## Built With

List of any major frameworks used to build the project.

* [NodeJS](https://nodejs.org/) - JS runtime environment
* [ExpressJS](https://expressjs.com/) - The NodeJS framework used
* [MongoDB](https://www.mongodb.com/) - NoSQL Database uses JSON-like documents with optional schemas
* [Mongoose](https://mongoosejs.com/) - Object Data Modeling (ODM) library for MongoDB and NodeJS
* [Bcrypt](https://www.npmjs.com/package/bcrypt) - Encryption & Decryption Algorithm
* [Cloudinary](https://cloudinary.com/) - Cloud-based service
* [Compression](https://www.npmjs.com/package/compression) - NodeJS compression middleware
* [Cors](https://www.npmjs.com/package/cors) - NodeJS package for providing a Connect/Express middleware that can be used to enable CORS with various options
* [Slugify](https://www.npmjs.com/package/slugify) - Slugifies a string
* [Dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from a . env file into process. env
* [Helmet](https://www.npmjs.com/package/helmet) - Secure Express apps by setting various HTTP headers
* [JWT](https://jwt.io/) - Compact URL-safe means of representing claims to be transferred between two parties
* [Moment](https://momentjs.com/) - JavaScript library which helps is parsing, validating, manipulating and displaying date/time in JavaScript in a very easy way
* [Multer](https://www.npmjs.com/package/multer) - NodeJS middleware for handling multipart/form-data
* [Nodemailer](https://www.npmjs.com/package/nodemailer) - Easy as cake e-mail sending from your Node.js applications
* [Validator](https://www.npmjs.com/package/validator) - A library of string validators and sanitizers.
* [XSS Clean](https://www.npmjs.com/package/xss-clean) - Middleware to sanitize user input
<!-- * [Stripe](https://www.npmjs.com/package/stripe) - The Stripe Node library provides convenient access to the Stripe API from applications written in server-side JavaScript. -->
## Installation

You can fork the app or you can git-clone the app into your local machine. Once done that, please install all the
dependencies by running
```
$ yarn install 
$ npm install
set your env variables
$ yarn run start
$npm start
