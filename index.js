const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.uetnypa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Database functionalities added here:
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect((err) => {
            if (err) {
                console.log(err);
                return;
            }
        });

        const usersCollection = client.db("shunyEka").collection("users");
        // find all user api
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        // add user 
        app.post('/addUser', async (req, res) => {
            const addUser = req.body;
            const result = await usersCollection.insertOne(addUser);
            res.send(result);
        })

        // update user
        app.put('/updateUser/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = {_id : new ObjectId(id)};

            const updateUser = {
                $set:{
                    name: body.name,
                    email: body.email,
                    phone: body.phone,
                }
            };
            const result = await usersCollection.updateOne(filter, updateUser);
            res.send(result);
        });

        // delete user
        app.delete('/deleteUser/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('ShunyEka server is running')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`,);
})
