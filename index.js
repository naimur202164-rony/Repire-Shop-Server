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
        const usersCollection = database.collection("users");
        const addedProductCollection = database.collection('addedProducts');
        const userProductsCollection = database.collection('userProducts')
        // create a document to insert

        // Geting  Data from The Server
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.send(result)
        })

        // Sending Data to the USers
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        // Google Sign Upsert Method
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // Addin Admin'
        app.put('/users/admin', async (req, res) => {
            const user = req.body;

            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);


        });
        // Adding products from Single Page
        app.post('/userProducts', async (req, res) => {
            const products = req.body;
            const result = await userProductsCollection.insertOne(products);
            res.send(result)
        });
        // Getin Products By Email Id
        app.get('/userProducts', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = userProductsCollection.find(query);
            const productOrderd = await cursor.toArray();
            res.send(productOrderd)
        });
        // Delet items dynamics
        app.delete("/deleteProduct/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await userProductsCollection.deleteOne(query);
            res.send(result)
            console.log(result);

        })

        // Added New Products
        app.post('/addProducts', async (req, res) => {
            const name = req.body.name;
            const discription = req.body.discription;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const product = {
                name,
                discription,
                image: imageBuffer
            }
            const result = await addedProductCollection.insertOne(product);
            res.json(result);
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