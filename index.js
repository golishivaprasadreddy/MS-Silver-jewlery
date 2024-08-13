const express = require('express');
const path = require('path');
const Product = require('./usermodel'); // Import the Product model
const bodyParser = require('body-parser');
const multer = require('multer');
const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render("index");
});

app.get('/contact', function (req, res) {
    res.render("contact");
});

app.get('/admin', function (req, res) {
    res.render("admin");
});

app.get('/about', function (req, res) {
    res.render("about");
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

// Route for handling form submissions
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Route to handle form submission
app.post('/create', upload.single('image'), async (req, res) => {
    const { name, description, price, type } = req.body;
    const image = req.file ? req.file.filename : '';

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


app.listen(port, function (err) {
    if (err) {
        console.error('Failed to start the server:', err);
    } else {
        console.log(`Server is running on http://localhost:${port}`);
    }
});