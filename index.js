const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wpzuq3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

        const craftCollection = client.db("artisanHaven").collection("crafts");
        const extraCollection = client.db("artisanHaven").collection("extraSection");

        app.post('/addCraft', async (req, res) => {
            const newCraft = req.body;
            console.log(newCraft);
            const result = await craftCollection.insertOne(newCraft);
            res.send(result);
            });
        app.get('/extraItem', async (req, res) => {
              const cursor = extraCollection.find();
              const results = await cursor.toArray();
              console.log(results);
              res.send(results);
            });

        app.get('/addCraft', async ( req , res) => {
          const cursor = craftCollection.find({});
          const results = await cursor.toArray();
          console.log(results);
          res.send(results);
        });
        app.get('/addCraft/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await craftCollection.findOne(query);
          res.send(result);
        });

        
                
        app.delete('/deleteItem/:id', async (req, res) => {
            const result = await craftCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            console.log(result);
            res.send(result)
            }
        );
        app.get('/artCraft/:email', async(req, res)=>{
            console.log(req.params.email);
            const result = await craftCollection.find({email:req.params.email}).toArray();
            res.send(result)
        });
        app.get('/addCraft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await craftCollection.findOne(query);
            res.send(result);
        });
        app.put('/addCraft/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCraft = req.body;
            const query = { _id: new ObjectId(id) };
            const result = await craftCollection.updateOne(query, { $set: updatedCraft });
            res.send(result);
        });
    // Establish and verify connection
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Routes
app.get('/', (req, res) => {
  res.send('Artisan Haven Server is running...');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});