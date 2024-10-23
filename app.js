const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyparser = require("body-parser");

const app = express();
const port = 3000;
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));

let books = [
  { codice: uuidv4(), nome: 'Il Signore degli Anelli', descrizione: 'Un epico fantasy', quantita: 5, prezzo: 19.99, autore: 'J.R.R. Tolkien' },
  { codice: uuidv4(), nome: '1984', descrizione: 'Distopia di Orwell', quantita: 8, prezzo: 12.99, autore: 'George Orwell' },
  { codice: uuidv4(), nome: 'La Divina Commedia', descrizione: 'Classico della letteratura italiana', quantita: 3, prezzo: 25.00, autore: 'Dante Alighieri' },
  { codice: uuidv4(), nome: 'Harry Potter e la Pietra Filosofale', descrizione: 'Il primo libro della saga di Harry Potter', quantita: 10, prezzo: 14.99, autore: 'J.K. Rowling' }
];

// Restituisce tutti i libri
app.get('/api/libri/tutti', (req, res) => res.json(books));

// Restituisce un singolo libro
app.get('/api/libri/:codice', (req, res) => {
  const book = books.find(b => b.codice === req.params.codice);
  res.json(book || 'Book not found');
});

// Inserisce un libro
app.post('/api/libri', (req, res) => {
  const newBook = { 
    codice: uuidv4(), 
    nome: req.body.nom, 
    descrizione: req.body.des,
    quantita: req.body.quant,
    prezzo: req.body.pre,
    autore: req.body.aut,
  };
  books.push(newBook);
  res.status(201).json(newBook); // Risposta 201 per la creazione
});

// Elimina un libro
app.delete('/api/libri/:codice', (req, res) => {
  const codice = req.params.codice;
  let bookFound = false; 

  for (let [idx, item] of books.entries()) {
    if (item.codice === codice) {
      books.splice(idx, 1); 
      bookFound = true; 
      res.send('Book deleted'); 
      break; 
    }
  }

  if (!bookFound) {
    res.status(404).send('Book not found'); // Risposta se il libro non viene trovato
  }
});

// Incrementa la quantità di un libro
app.get('/api/libri/:codice/incrementa', (req, res) => {
  const book = books.find(b => b.codice === req.params.codice);
  if (book) {
    book.quantita++;
    res.json(book);
  } else {
    res.status(404).send('Book not found'); // Risposta se il libro non viene trovato
  }
});

// Decrementa la quantità di un libro
app.get('/api/libri/:codice/decrementa', (req, res) => {
  const book = books.find(b => b.codice === req.params.codice);
  if (book) {
    if (book.quantita > 0) {
      book.quantita--;
      res.json(book);
    } else {
      res.status(400).send('Quantity is zero'); // Risposta se la quantità è zero
    }
  } else {
    res.status(404).send('Book not found'); // Risposta se il libro non viene trovato
  }
});

const server = app.listen(port, () =>{
 console.log(`Server running on port ${port}`);
});

const close = () => {
    server.close();
}

module.exports = { app, close }