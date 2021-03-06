const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, GridFSBucket, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.xqk09.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

async function run() {
    try {
        await client.connect()
        const groceryCollection = client.db("groceryManagement").collection("grocery")

        app.post('/login', (req, res) => {
            const email = req.body
            const token = jwt.sign(email, process.env.ACCESS_TOKEN_ACCESS);
            res.send({ token })

        })
        //maximun 6 data api
        app.get('/grocery', async (req, res) => {
            const query = {}
            const cursor = groceryCollection.find(query);
            // const grocery = await cursor.toArray()
            const number = 6
            const grocery = await cursor.limit(number).toArray()
            res.send(grocery)
        })



        //single data api
        app.get('/grocery/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await groceryCollection.findOne(query);
            res.send(result)
        })

        //update data api
        app.put('/grocery/:id', async (req, res) => {
            const id = req.params.id
            const update = req.body
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: update
            };
            const result = await groceryCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        //all data api
        app.get('/groceries', async (req, res) => {
            const tokenInfo = req.headers.authorization
            const [email, accessToken] = tokenInfo?.split(' ')
            console.log(email, accessToken);

            const decoded = verifyToken(accessToken);
            console.log(decoded);
            if (email === decoded.email) {
                const query = {}
                const cursor = groceryCollection.find(query);
                const grocery = await cursor.toArray()
                res.send(grocery)
            } else {
                res.send({ success: 'Unauthorized Access' })
            }

        })

        //delete single item api
        app.delete('/groceries/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await groceryCollection.deleteOne(query);
            res.send(result)
        })

        // post  api for add a new item
        app.post('/groceries', async (req, res) => {
            const groceryProduct = req.body
            const result = await groceryCollection.insertOne(groceryProduct);
            res.send(result)
        })
    }
    finally { }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('grocery management working')
})

app.listen(port, () => {
    console.log('grocery backend')
})


function verifyToken(token) {
    let email
    jwt.verify(token, process.env.ACCESS_TOKEN_ACCESS, function (err, decoded) {
        // console.log(decoded.foo) 
        if (err) {
            email = 'Invalid Email'
        } if (decoded) {
            console.log(decoded);
            email = decoded
        }
    });
    return email
}