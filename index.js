const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Import mongoose
const Product = require('./usermodel'); // Import the Product model
const User = require('./loginmodel'); // Import the User model
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./config/cloudinary'); // Import your Cloudinary configuration
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); // Use bcryptjs instead of bcrypt
const session = require('express-session');

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// Define routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/admin', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/'); // Redirect to login if not authenticated
    }
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

// User Registration Route
app.get('/register', (req, res) => {
    res.render('register'); // Render your registration page
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists.');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();
        res.redirect('/login'); // Redirect to login after registration
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal server error');
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
        res.redirect('/admin');
    } catch (error) {
        console.error('Error creating product:', error); // Log the error details
        res.status(500).send('Error creating product');
    }
});

// Route for login page
app.get('/login', (req, res) => {
    res.render('login'); // Render your login page
});

// Handle login form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id; // Store user ID in session
            res.redirect('/admin'); // Redirect to admin page
        } else {
            res.send('Invalid username or password.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
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
