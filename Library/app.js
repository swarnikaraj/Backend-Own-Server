const express = require('express');

const mongoose = require("mongoose");

// 1. connect to mongodb server
// 2. create Schema
// 3. Create a model from the schema 

const app = express();
app.use(express.json());
const connect = () => {
    return mongoose.connect("mongodb://127.0.0.1:27017/library");
}

//Sterp - 2 author Schema

const authorSchema = new mongoose.Schema({
    first_name: { type: String, required: true, unique: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: false, default: "Male" }

}, {
    versionKey: false,
    timestamps: true,
});

// Sterp - 3 author model

const Author = mongoose.model("author", authorSchema); //create authors collection


// Section Schema

const sectionSchema = new mongoose.Schema({
    section: { type: String, required: true }
}, {
    versionKey: false,
    timestamps: true
})

// Section model
const Section = mongoose.model("section", sectionSchema); // create sections collections
// Book schema 

const bookSchema = new mongoose.Schema({
    book_name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    published_year: { type: Number, required: false },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "author",
        required: true
    },
    section_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "section",
        required: true
    }]
}, {
    versionKey: false,
    timestamps: true
})

// Book model
const Book = mongoose.model("book", bookSchema); // create books collections

// Customer

const userSchema = new mongoose.Schema({
    user_name: { type: String, required: true },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
})

const User = mongoose.model("user", userSchema);






// Authors queries Start
// Fetch specific Data from JSON file

app.get("/author", async(req, res) => {
    try {
        const authors = await Author.find().lean().exec();
        res.send(authors);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// Fetch specific Data from JSON file

app.get("/author/:id", async(req, res) => {
    try {
        const authorOne = await Author.findById(req.params.id).lean().exec();
        res.send(authorOne);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// Upload Data to JSON file

app.post("/author", async(req, res) => {
    try {
        const addAuthor = await Author.create(req.body);
        res.status(201).send(addAuthor);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// Modifing the data into JSON

app.patch("/author/:id", async(req, res) => {
    try {
        const upAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true, }).lean().exec();
        res.status(201).send(upAuthor);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

app.delete("/author/:id", async(req, res) => {
    try {
        const dltAuthor = await Author.findByIdAndDelete(req.params.id).lean().exec();
        res.status(200).send(dltAuthor);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// Authors queries end

// Sections queries Start
// Fetch specific Data from JSON file

app.get("/section", async(req, res) => {
    try {
        const section = await Section.find().lean().exec();
        res.send(section);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// Fetch specific Data from JSON file

app.get("/section/:id", async(req, res) => {
    try {
        const oneSection = await Section.findById(req.params.id).lean().exec();
        res.send(oneSection);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// Upload Data to JSON file

app.post("/section", async(req, res) => {
    try {
        const addSection = await Section.create(req.body);
        res.status(201).send(addSection);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// Modifing the data into JSON

app.patch("/section/:id", async(req, res) => {
    try {
        const upSection = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true, }).lean().exec();
        res.status(201).send(upSection);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

app.delete("/section/:id", async(req, res) => {
    try {
        const dltSection = await Section.findByIdAndDelete(req.params.id).lean().exec();
        res.status(200).send(dltSection);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// Sections queries end


// Books queries Start
// Fetch specific Data from JSON file

app.get("/book", async(req, res) => {
    try {
        const books = await Book.find()
            .populate({ path: "author_id", select: "first_name" })
            .lean()
            .exec();

        res.send(books);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// Fetch specific Data from JSON file

app.get("/book/:id", async(req, res) => {
    try {
        const oneBook = await Book.findById(req.params.id).lean().exec();
        res.send(oneBook);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// Upload Data to JSON file

app.post("/book", async(req, res) => {
    try {
        const addBook = await Book.create(req.body);
        res.status(201).send(addBook);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// Modifing the data into JSON

app.patch("/book/:id", async(req, res) => {
    try {
        const upBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, }).lean().exec();
        res.status(201).send(upBook);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

app.delete("/book/:id", async(req, res) => {
    try {
        const dltBook = await Book.findByIdAndDelete(req.params.id).lean().exec();
        res.status(200).send(dltBook);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// Books queries end

// Books queries Start
// Fetch specific Data from JSON file
/* .populate({ 
    path: 'pages',
    populate: {
      path: 'components',
      model: 'Component'
    } 
 })*/

// find books that are checked out

app.get("/user", async(req, res) => {
    try {
        const oneUser = await User.find()
            .populate("book_id")
            .populate({ path: "book_id", populate: { path: 'author_id' } })
            .populate({ path: "book_id", populate: { path: 'section_id' } })
            .lean().exec();
        res.send(oneUser);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});

// find all books written by an author

app.get("/author/author_id=:id/books", async(req, res) => {
    try {
        //const author = await Author.findById(req.params.id).lean().exec();
        const books = await Book.find({ author_id: req.params.id }).lean().exec();

        res.send(books);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
})


// find books in a section

app.get("/book/:id/section", async(req, res) => {
    try {
        //const author = await Author.findById(req.params.id).lean().exec();
        const books = await Book.find({ section_id: req.params.id }).lean().exec();

        res.send(books);
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
})


// find books in a section that are not checked out
app.get("/book/author_id=:author_id/section_id=:section_id", async(req, res) => {
    try {
        const checkout = await User.find().lean().exec();
        const findId = checkout[0].book_id;
        const book = await Book.find({
                $and: [{ _id: { $ne: findId } },
                    { section_id: { $eq: req.params.section_id } }
                ]
            })
            .populate("author_id")
            .populate("section_id")
            .lean()
            .exec();

        return res.status(200).send(book);
    } catch (e) {
        return res.status(500).send({ message: e.message });
    }
});
// find books of 1 author inside a section
app.get("/books/author_id=:author_id/section_id=:section_id", async(req, res) => {
    try {
        const books = await Book.find({
                author_id: req.params.author_id,
                section_id: req.params.section_id,
            })
            .populate("author_id")
            .populate("section_id")
            .lean()
            .exec();

        return res.status(201).send(books);
    } catch (e) {
        return res.status(500).send({ message: e.message });
    }
});


// User quries end


app.listen(2345, async function() {
    await connect();
    console.log("This is my welcome port : 2345");
});