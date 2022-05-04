const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, GridFSBucket, ObjectId } = require('mongodb');
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

        //all data api
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
            // console.log(typeof (update.quantity));
            const options = { upsert: true };
            const updateDoc = {
                $set: update
            };
            const result = await groceryCollection.updateOne(filter, updateDoc, options);
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