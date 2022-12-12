require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = process.env.BD_LOGIN // Variável que faz a conexão com o banco de dados.

MongoClient.connect(uri, (err, client) => {
    if(err) return console.log(err);
    db = client.db('crud'); // Nome do banco de dados
    app.listen(3000, () => {
        console.log('Server rodando na porta 3000');
    });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/public')));


app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/login.ejs', (req, res) => {
    res.render('login.ejs');
});

app.get('/', (req, res) => {
    const cursor = db.collection('data').find();
});

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if(err) throw err;
        res.render('show.ejs', { data: results });
    });
});



app.post('/show', (req, res) => {
    db.collection('data').insertOne(req.body, (err, result) => {
        if(err) throw err;

        console.log('Salvo no banco de dados');
        res.redirect('/show');
    });
});

app.route('/edit/:id')
    .get((req, res) => {
        const id = req.params.id;

        db.collection('data').find(ObjectId(id)).toArray((err, results) => {
            if(err) return res.send(err);
            res.render('edit.ejs', { data: results });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        const nome = req.body.nome;
        const email = req.body.email;
        const telefone = req.body.telefone;
        const cep = req.body.cep;
        const endereco = req.body.endereco;
        const numero = req.body.numero;
        const complemento = req.body.numero;
        const bairro = req.body.bairro;
        const cidade = req.body.cidade;
        const estado = req.body.estado

        db.collection('data').updateOne({_id: ObjectId(id)}, {
            $set: {
                nome: nome,
                email: email,
                telefone: telefone,
                cep: cep,
                endereco: endereco,
                numero: numero,
                complemento: complemento,
                bairro: bairro,
                cidade: cidade,
                estado: estado
            }
        }, (err, result) => {
            if(err) return res.send(err);
            res.redirect('/show');
            console.log('Atualizado do banco de dados!');
        });
    });

app.route('/delete/:id')
.get((req, res) => {
    const id = req.params.id;

    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if(err) return res.send(500, err);
        console.log('Deletado do banco de dados!');
        res.redirect('/show');
    });
});
