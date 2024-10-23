const request = require('supertest');
const { app, close } = require('./app');

describe("Test di tutti gli endpoint della mia API", () => {
    let codiceValido; // Variabile per memorizzare un codice valido per i test

    it("La GET di /api/libri/tutti dovrebbe restituire tutti i libri", async () => {
        const res = await request(app).get("/api/libri/tutti");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                nome: expect.any(String),
                descrizione: expect.any(String),
                quantita: expect.any(Number),
                prezzo: expect.any(Number),
                autore: expect.any(String),
            }),
        ]));

        // Salva il codice del primo libro per i test successivi
        codiceValido = res.body[0].codice; // Usa il codice del primo libro
    });

    it("La GET di /api/libri/:codice dovrebbe restituire un libro singolo", async () => {
        const res = await request(app).get(`/api/libri/${codiceValido}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({
            codice: codiceValido,
            nome: expect.any(String),
            descrizione: expect.any(String),
            quantita: expect.any(Number),
            prezzo: expect.any(Number),
            autore: expect.any(String),
        }));
    });

    it("La POST di /api/libri dovrebbe inserire un nuovo libro", async () => {
        const newBook = {
            nom: 'Nuovo Libro',
            des: 'Descrizione del nuovo libro',
            quant: 5,
            pre: 9.99,
            aut: 'Autore del nuovo libro'
        };

        const res = await request(app)
            .post("/api/libri")
            .send(newBook);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({
            codice: expect.any(String),
            nome: newBook.nom,
            descrizione: newBook.des,
            quantita: newBook.quant,
            prezzo: newBook.pre,
            autore: newBook.aut,
        }));

        // Salva il codice del nuovo libro per testare la DELETE
        codiceValido = res.body.codice;
    });

    it("La DELETE di /api/libri/:codice dovrebbe eliminare un libro", async () => {
        const res = await request(app).delete(`/api/libri/${codiceValido}`);

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Book deleted');
    });

    afterAll((done) => {
        close();
        done();
    });
});
