const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        //need write function here...
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