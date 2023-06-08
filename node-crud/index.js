const express = require('express')
const app = express()
const port = 3001

// app.get('/', (req, res) => {
//   res.status(200).send('Hello World!');
// })

// app.listen(port, () => {
//   console.log(`App running on port ${port}.`)
// })

const province_model = require('./province_model')
const city_model = require('./city_model')
const district_model = require('./district_model')

app.use(express.json())
  app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});


// All province methods
app.get('/provinces', (req, res) => {
  province_model.getProvinces()
  .then(response => {
    // console.log("Get request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Get request fail: ", error);
    res.status(500).send(error);
  })
})

app.post('/provinces/create', (req, res) => {
  province_model.createProvince(req.body)
  .then(response => {
    // console.log("Post request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Post request fail: ", error);
    res.status(500).send(error);
  })
})

app.delete('/provinces/delete/:id', (req, res) => {
  province_model.deleteProvince(req.params.id)
  .then(response => {
    // console.log("Delete request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Delete request fail: ", error);
    res.status(500).send(error);
  })
})

app.put('/provinces/update/:id', (req, res) => {
  province_model.updateProvince(req.params.id, req.body)
  .then(response => {
    // console.log("Update request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Update request fail: ", error);
    res.status(500).send(error);
  })
})

app.get('/provinces/get-max-id', (req, res) => {
  province_model.getMaxProvinceId()
  .then(response => {
    // console.log("Get request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Get request fail: ", error);
    res.status(500).send(error);
  })
})

app.get('/provinces/get-name-by-id/:id', (req, res) => {
  province_model.getProvinceNameById(req.params.id)
  .then(response => {
    // console.log("Get request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Get request fail: ", error);
    res.status(500).send(error);
  })
})


// All city methods
app.get('/cities', (req, res) => {
  city_model.getCities()
  .then(response => {
    // console.log("Get request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Get request fail: ", error);
    res.status(500).send(error);
  })
})

app.post('/cities/create', (req, res) => {
  city_model.createCity(req.body)
  .then(response => {
    // console.log("Post request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Post request fail: ", error);
    res.status(500).send(error);
  })
})

app.delete('/cities/delete/:id', (req, res) => {
  city_model.deleteCity(req.params.id)
  .then(response => {
    // console.log("Delete request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Delete request fail: ", error);
    res.status(500).send(error);
  })
})

app.put('/cities/update/:id', (req, res) => {
  city_model.updateCity(req.params.id, req.body)
  .then(response => {
    // console.log("Update request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Update request fail: ", error);
    res.status(500).send(error);
  })
})

app.get('/cities/get-max-id', (req, res) => {
  city_model.getMaxCityId()
  .then(response => {
    // console.log("Get request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Get request fail: ", error);
    res.status(500).send(error);
  })
})

app.get('/cities/get-name-by-id/:id', (req, res) => {
  city_model.getCityNameById(req.params.id)
  .then(response => {
    // console.log("Get request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Get request fail: ", error);
    res.status(500).send(error);
  })
})


// All district methods
app.get('/districts', (req, res) => {
  district_model.getDistricts()
  .then(response => {
    // console.log("Get request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Get request fail: ", error);
    res.status(500).send(error);
  })
})

app.post('/districts/create', (req, res) => {
  district_model.createDistrict(req.body)
  .then(response => {
    // console.log("Post request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Post request fail: ", error);
    res.status(500).send(error);
  })
})

app.delete('/districts/delete/:id', (req, res) => {
  district_model.deleteDistrict(req.params.id)
  .then(response => {
    // console.log("Delete request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Delete request fail: ", error);
    res.status(500).send(error);
  })
})

app.put('/districts/update/:id', (req, res) => {
  district_model.updateDistrict(req.params.id, req.body)
  .then(response => {
    // console.log("Update request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Update request fail: ", error);
    res.status(500).send(error);
  })
})

app.get('/districts/get-max-id', (req, res) => {
  district_model.getMaxDistrictId()
  .then(response => {
    // console.log("Get request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Get request fail: ", error);
    res.status(500).send(error);
  })
})

app.get('/districts/get-name-by-id/:id', (req, res) => {
  district_model.getDistrictNameById(req.params.id)
  .then(response => {
    // console.log("Get request success");
    res.status(200).send(response);
  })
  .catch(error => {
    // console.log("Get request fail: ", error);
    res.status(500).send(error);
  })
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})