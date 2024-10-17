const express = require('express');
const path = require('path');
const Product = require('./usermodel'); // Import the Product model
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./config/cloudinary'); // Import your Cloudinary configuration
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const app = express();



// Set up view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products
        res.render('products', { products }); // Pass products to EJS
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products', // Specify the folder name in Cloudinary
        allowedFormats: ['jpg', 'jpeg', 'png'] // Specify allowed formats
    }
});

const upload = multer({ storage });

// Route to handle form submission
app.post('/create', upload.single('image'), async (req, res) => {
    const { name, description, price, type } = req.body;
    const image = req.file ? req.file.path : ''; // Cloudinary returns the file URL

    try {
        const product = new Product({
            name,
            description,
            price,
            type,
            image
        });
        await product.save();
        res.send('Product created successfully!');
    } catch (error) {
        console.error('Error creating product:', error); // Log the error details
        res.status(500).send('Error creating product');
    }
});

// Start server
app.listen(port, (err) => {
    if (err) {
        console.error('Failed to start the server:', err);
    } else {
        console.log(`Server is running on http://localhost:${port}`);
    }
});
