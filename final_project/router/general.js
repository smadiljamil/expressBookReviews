const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Customer successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "Customer already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register customer."});
  });

  //Promise for all the books
function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
  }

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooks().then((allBooks) => res.send(JSON.stringify(allBooks)));
});

//Promise for getting book by ISBN
function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
        let isbnNo = parseInt(isbn);
        if (books[isbnNo]) {
            resolve(books[isbnNo]);
        } else {
            reject(`ISBN ${isbn} not found`);
        }
    })
  }
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  getByISBN(ISBN).then(
      function(book) {res.send(JSON.stringify(book))},
      function(error) {res.send(JSON.stringify(error))}
      );
 });
  

//Promise for getting book by ISBN
function getByAuthor(author) {
    return new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        let booksbyauthor = [];
        bookKeys.forEach(function (keyValue){
            if(books[keyValue].author === author){
                let tempBook ={};
                tempBook.isbn = keyValue;
                tempBook.title = books[keyValue].title;
                tempBook.reviews = books[keyValue].reviews;
                booksbyauthor.push(tempBook);
            }
        });
        resolve(booksbyauthor);
    })
  }

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const bookKeys = Object.keys(books);
  console.log(req.params.author);
  getByAuthor(req.params.author).then(
    function(booksbyauthor) {res.send(JSON.stringify({"booksbyauthor":booksbyauthor},null,4));},
    function(error) {res.send(JSON.stringify("Author does not exist"))}
    );
});


function getByTitle(title) {
    return new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        let booksbytitle = [];
        bookKeys.forEach(function (keyValue){
        if(books[keyValue].title === title){
            let tempBook ={};
            tempBook.isbn = keyValue;
            tempBook.author = books[keyValue].author;
            tempBook.reviews = books[keyValue].reviews;
            booksbytitle.push(tempBook);
        }
    });
        resolve(booksbytitle);
    })
  }
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const bookKeys = Object.keys(books);
    getByTitle(req.params.title).then(
        function(getByTitle) {res.send(JSON.stringify({"getByTitle":getByTitle},null,4));},
        function(error) {res.send(JSON.stringify("Title does not exist"))}
    );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    res.send(JSON.stringify(books[ISBN].reviews,null,4));
});

module.exports.general = public_users;
