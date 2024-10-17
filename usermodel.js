// require('dotenv').config(); // Load environment variables from .env file
// const mongoose = require('mongoose');

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000, // Increase this value
//     socketTimeoutMS: 45000, // Increase this value
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('Could not connect to MongoDB...', err));

// // Define your schema
// const productSchema = new mongoose.Schema({
//     name: String,
//     description: String,
//     price: Number,
//     type: String,
//     image: String // You may store the image path or URL here
// });

// // Create a model
// const Product = mongoose.model('Product', productSchema);

// // Export the model
// module.exports = Product;
require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // Increase the server selection timeout for better resilience
    socketTimeoutMS: 60000 // Increase the socket timeout
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('Could not connect to MongoDB...', err);
    process.exit(1); // Exit the process with failure
});

// Define your schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    image: { type: String } // Optional: Store the image path or URL
});

// Create a model
const Product = mongoose.model('Product', productSchema);

// Export the model
module.exports = Product;

