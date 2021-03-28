      const express = require('express');
      const MongoClient = require('mongodb').MongoClient;
      const bodyParser = require('body-parser');
      const cors = require('cors');
      require('dotenv').config();

      const app = express();
      const port = 5000;

      const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.skqkk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

      app.use(cors());
      app.use(bodyParser.json());


      client.connect(err => {
        const eProduct = client.db("eShop").collection("products");
        
        app.post('/addProducts', (req, res) =>{
          const product = req.body;
          eProduct.insertOne(product)
          .then(result =>{
            res.send(result.insertedCount);
          })
        })

        app.get('/products', (req, res) =>{
          eProduct.find({})
          .toArray( (err, documents) =>{
            res.send(documents);
          })
        })

        app.get('/product/:key', (req, res) =>{
          eProduct.find({key: req.params.key})
          .toArray( (err, documents) =>{
            res.send(documents[0]);
          })
        })
        
        app.post('/productsByKeys', (req, res) =>{
          const productKeys = req.body;
          eProduct.find({key: {$in: productKeys}})
          .toArray((err, documents)=>{
            res.send(documents);
          })
        })

      });


      app.get('/', (req, res) => {
        res.send('Hello World!')
      })

      app.listen(process.env.PORT || port);