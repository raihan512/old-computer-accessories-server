const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
// const jwt = require('jsonwebtoken');
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

// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send('Unauthorized Access');
//     }
//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ message: 'Forbidden' })
//         }
//         req.decoded = decoded;
//         next();
//     })
// }

async function run() {
    try {
        const categoriesCollection = client.db("pcParts").collection('category');
        const usersCollection = client.db("pcParts").collection('user');

        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories)
        })

        // app.get('/jwt', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email };
        //     const user = await usersCollection.findOne(query);
        //     if (user) {
        //         const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
        //         return res.send({ accessToken: token });
        //     }
        //     console.log(user);
        //     res.status(403).send({ accessToken: '' })
        // })

        // app.get('/users', async (req, res) => {
        //     const query = {};
        //     const allUser = await usersCollection.find(query).toArray();
        //     res.send(allUser);
        // })

        app.post('/users', async (req, res) => {
            // Data for create new user
            const userInfo = req.body;
            // Checking if this email already in database or not
            const email = req.body.email;
            const query = { email: email };
            const existUser = await usersCollection.findOne(query);
            // If this email is not in database then add this user to database
            console.log(existUser?.email);
            if (!existUser) {
                const addedUser = await usersCollection.insertOne(userInfo);
                return res.send(addedUser);
            }
            // If this email already available in the data base then show this status
            res.status(403).send({ message: 'User already Exist in database' })

        })
    }
    finally { }
}
run().catch();
app.listen(port, () => {
    console.log('Server is running');
})