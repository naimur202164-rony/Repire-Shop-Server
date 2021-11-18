const express = require('express')
const app = express()
const port = 5000
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors")

// MiddleWare
app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://electron:pRNt5auNBsMQxVGg@cluster0.tlrw7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





async function run() {
    try {
        await client.connect();
        const database = client.db("Repiring-shop");
        const productsCollection = database.collection("products");
        // create a document to insert

        // Geting  Data from The Server
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            console.log(result);
            res.send(result)
        })












    } finally {
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Hello World!')
})








app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})