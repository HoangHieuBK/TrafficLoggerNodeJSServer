var express = require('express');
var app = express();
var fs = require('fs');
var cors = require('cors');
app.use(express.json());
app.use(cors());
app.get('/', function (req, res) {
    res.send('Hello World');
})

app.get('/GetTrafficLogger', function (req, res) {
    fs.readFile("traffic-logger.json", 'utf8', function (err, data) {
        console.log(data);
        res.send(data);
    });
})

app.get('/GetTrafficLogger/:id', function (req, res) {
    fs.readFile("traffic-logger.json", 'utf8', function (err, dataJson) {
        console.log(dataJson);
        const data = JSON.parse(dataJson);
        const trafficLogger = data.find(item => item.id = req.params.id);
        if(trafficLogger) {
            res.send(trafficLogger);
        }
    });
})


app.post('/InsertTrafficLogger', function (req, res) {
    // First read existing users.
    fs.readFile(__dirname + "/" + "traffic-logger.json", 'utf8', function (err, data) {
        var lstUsers = JSON.parse(data);
        lstUsers.unshift(req.body);
        fs.writeFile(__dirname + "/" + "traffic-logger.json", JSON.stringify(lstUsers), function (err) {
            if (err) {
                res.send(err.toString());
            }
            res.json('Success');
        })
    });
})

app.put('/UpdateTrafficLogger', function (req, res) {
    fs.readFile("traffic-logger.json", 'utf8', function (err, dataString) {
        const data =JSON.parse(dataString)
        const index = data.findIndex(x => x.id === req.body.id);
        if (index > -1) {
            data[index] = req.body;
            fs.writeFile(__dirname + "/" + "traffic-logger.json", JSON.stringify(data), function (err) {
                if (err) {
                    res.send(err.toString());
                }
                res.json('Success');
            })
        }
    });
})

app.delete('/DeleteTrafficLogger', function (req, res) {
    fs.readFile("traffic-logger.json", 'utf8', function (err, dataString) {
        const data =JSON.parse(dataString)
        console.log(req.body)
        const index = data.findIndex(x => x.id === req.body.id);
        if (index > -1) {
            data.splice(index,1); // xoa 1 phan tu tai vi tri index
            fs.writeFile(__dirname + "/" + "traffic-logger.json", JSON.stringify(data), function (err) {
                if (err) {
                    res.send(err.toString());
                }
                res.json('Success');
            })
        }
    });
})

var server = app.listen(8081, '127.0.0.1', function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

// fs.readFile(__dirname + "/" + "document.json", 'utf8', function (err, data) {
//     let listDocuments = [];
//     if (data) {
//         listDocuments = JSON.parse(data);
//     }
//     listDocuments.unshift(doc);
//     fs.writeFile(__dirname + "/" + "document.json", JSON.stringify(listDocuments), function (err) {
//     })
// })