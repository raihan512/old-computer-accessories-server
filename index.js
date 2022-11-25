const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()

const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Pc Parts Server is running')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e4yec41.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db("pcParts").collection('category');

        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories)
        })
    }
    finally { }
}
run().catch();
app.listen(port, () => {
    console.log('Server is running');
})