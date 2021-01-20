const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
/**
 * Conenction string lấy từ mongodb
 * Chọn cluster -> connect -> connect your application. Xem ảnh minh họa trong thư mục img
 * Thông số cần thay đổi : <password>, <dbname>
 */
const uri = "mongodb+srv://haidanghth910:ThuyDuong3476@cluster0.9ugvn.gcp.mongodb.net/test?retryWrites=true&w=majority"; 
admin.initializeApp();
const app = express();
app.use(bodyParser.json());

/**
 * Bài tập 1
 */
app.post('/post-greeting', (req, res) => {
    res.send("Hello, my name's Đăng, post")
})

app.get('/get-greeting', (req, res) => {
    res.send("Hello, my name's Đăng, get")
})
/**
 * Bài tập 2 firebase function ghi dữ liệu vào mongo
 */
app.post('/mongo-add', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection = client.db("test").collection("devices");
        collection.insertOne(req.body.data)
                    .then((result) => res.send(result))
                    .catch((err) => res.send(err))
    client.close();
    });
})

app.post('/mongo-update', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection = client.db("test").collection("devices");
        collection.updateOne(req.body.filter, { $set : req.body.data })
                    .then((result) => res.send(result))
                    .catch((err) => res.send(err))
    client.close();
    })
})

app.post('/mongo-delete', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection = client.db("test").collection("devices");
        collection.deleteOne(req.body.filter)
            .then((result) => res.send(result))
            .catch((err) => res.send(err))
    client.close();
    })
})
/**
 * Bài tập 3 firebase function ghi dữ liệu vào firestore
 */
app.post('/firestore-add', (req, res) => {
    admin.firestore().collection("devices").add(req.body.data)
                        .then((result) => res.send(result))
                        .catch((err) => res.send(err))
})

app.post('/firestore-update', (req, res) => {
    admin.firestore().collection("devices").doc(req.body.filter).update(req.body.data)
                        .then((result) => res.send(result))
                        .catch((err) => res.send(err))
})

app.post('/firestore-delete', (req, res) => {
    admin.firestore().collection("devices").doc(req.body.filter).delete()
                        .then((result) => res.send(result))
                        .catch((err) => res.send(err))
})
/**
 * Bài tập 4 tạo tài khoản trên firebase authentication
 */
app.post('/sign-up-by-email', (req, res) => {
    admin.auth()
            .createUser(req.body.data)
            .then((userRecord) => {
                res.send(userRecord);
            })
            .catch((error) => {
                res.send(error);
            });
})

exports.app = functions.https.onRequest(app);
