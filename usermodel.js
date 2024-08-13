const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb+srv://gspreddy6869:66ylLj6C4IyFiviq@ms-jewllery.hbzzq.mongodb.net/?retryWrites=true&w=majority&appName=Ms-jewllery', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));

// Define your schema
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    type: String,
    image: String // You may store the image path or URL here
});

// Create a model
const Product = mongoose.model('Product', productSchema);

// Export the model
module.exports = Product;
