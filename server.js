var express = require('express');
var app = express();
var fs = require('fs');
var cors = require('cors');
app.use(express.json());
app.use(cors());
app.get('/', function (req, res) {
    res.send('Hello World');
})

// api get list TL device
app.get('/api/v1/devices', function (req, res) {
    console.log('req.query', req.query);
    fs.readFile("traffic-logger.json", 'utf8', function (err, dataJson) {
        const objectData = JSON.parse(dataJson);
        if (req.query.deviceType == 1) {

            if (req.query.deviceName) { // neu co param deviceName thi se la api search
                objectData['data'] = objectData.data.filter((item) => {
                    return item.name.includes(req.query.deviceName);
                });

            }


            // neu khong co param thi se la api get list TL
            objectData['data'] = objectData.data.filter((item) => {
                return item.name.includes('TC')
            });
            res.send(objectData);
        }
    });
})

// api get detail device
app.get('/api/v1/devices/:id', function (req, res) {
    fs.readFile("traffic-logger.json", 'utf8', function (err, dataJson) {
        const objectData = JSON.parse(dataJson);
        objectData['data'] = objectData.data.filter(item => item.id === +req.params.id);
        res.send(objectData);
    });
})

// api delete TL device
app.delete('/api/v1/devices/:id', function (req, res) {
    fs.readFile("traffic-logger.json", 'utf8', function (err, dataString) {
        const objectData = JSON.parse(dataString)
        const index = objectData.data.findIndex(x => x.id === +req.params.id);
        if (index > -1) {
            objectData.data.splice(index, 1); // xoa 1 phan tu tai vi tri index
            fs.writeFile(__dirname + "/" + "traffic-logger.json", JSON.stringify(objectData), function (err) {
                if (err) {
                    res.send(err.toString());
                }
                objectData['data'] = objectData.data.filter(item => item.id === +req.params.id);
                res.send(objectData);
            })
        }
    });
})
/*============================================================================================================================*/
// api get alert list
app.get('/api/v1/traffic/alertrules', function (req, res) {
    fs.readFile("traffic-alert.json", 'utf8', function (err, dataJson) {
        if (dataJson) {
            res.send(dataJson);
        }
    });
})


// api create alert 
app.post('/api/v1/traffic/alertrules', function (req, res) {
    // First read existing users.
    fs.readFile(__dirname + "/" + "traffic-alert.json", 'utf8', function (err, dataJson) {
        var objectData = JSON.parse(dataJson);
        objectData.data.unshift(req.body);
        fs.writeFile(__dirname + "/" + "traffic-alert.json", JSON.stringify(objectData), function (err) {
            if (err) {
                res.send(err.toString());
            }
            res.json('Success');
        })
    });
})


// api update alert
app.put('/api/v1/traffic/alertrules/:id', function (req, res) {
    fs.readFile("traffic-alert.json", 'utf8', function (err, dataString) {
        const objectData = JSON.parse(dataString)
        const index = objectData.data.findIndex(x => x.id === +req.params.id);
        if (index > -1) {
            objectData.data[index] = req.body;
            fs.writeFile(__dirname + "/" + "traffic-alert.json", JSON.stringify(objectData), function (err) {
                if (err) {
                    res.send(err.toString());
                }
                res.json('Success');
            })
        }
    });
})

// api delete alert
app.delete('/api/v1/traffic/alertrules/:id', function (req, res) {
    fs.readFile("traffic-alert.json", 'utf8', function (err, dataString) {
        const objectData = JSON.parse(dataString)
        const index = objectData.data.findIndex(x => x.id === +req.params.id);
        if (index > -1) {
            objectData.data.splice(index, 1); // xoa 1 phan tu tai vi tri index
            fs.writeFile(__dirname + "/" + "traffic-alert.json", JSON.stringify(objectData), function (err) {
                if (err) {
                    res.send(err.toString());
                }
                objectData['data'] = objectData.data.filter(item => item.id === +req.params.id);
                res.send(objectData);
            })
        }
    });
})

/*============================================================================================================================*/

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
        const data = JSON.parse(dataString)
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
        const data = JSON.parse(dataString)
        console.log(req.body)
        const index = data.findIndex(x => x.id === req.body.id);
        if (index > -1) {
            data.splice(index, 1); // xoa 1 phan tu tai vi tri index
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