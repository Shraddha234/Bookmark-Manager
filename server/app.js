// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const morgan = require('morgan')
const Folder = require('./models/folderModel');
const LinkName = require('./models/linkNameModel');
const User = require('./models/userModel');

// Create Express app
const app = express();
var cors = require('cors');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    cors({
        origin: "*",
        methods: ["PUT", "POST", "GET", "DELETE", "OPTIONS", "PATCH"],
    })
);
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('Connected to MongoDB');

        // Set up body parser middleware
        app.use('/', routes);

        // Start the server
        app.listen(3000, () => {
            console.log('Server started on port 3000');

            // Console the schema data after the server has started
            // console.log('Folder Schema:', Folder.schema);
            // console.log('LinkName Schema:', LinkName.schema);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB', error);
    });
