const database = require('./database');
const pool = database.pool;

const getProvinces = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT prov_id, prov_name FROM provinces ORDER BY prov_id ASC', (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(results.rows);
      }
    })
  })
}

const createProvince = (body) => {
  return new Promise(function(resolve, reject) {
    const { prov_id, prov_name } = body
    pool.query('INSERT INTO provinces (prov_id, prov_name) VALUES ($1, $2) RETURNING *', [prov_id, prov_name], (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(`A new province has been added: ${JSON.stringify(results.rows[0])}`);
        // resolve(results.rows[0]);
      }
    })
  })
}

const deleteProvince = (id) => {
  return new Promise(function(resolve, reject) {
    const prov_id = parseInt(id)
    pool.query('DELETE FROM provinces WHERE prov_id = $1', [prov_id], (error, results) => {
      // console.log("Delete function called")
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(`Province deleted with ID: ${prov_id}`)
      }
    })
  })
}

const updateProvince = (id, body) => {
  return new Promise(function(resolve, reject) {
    const prov_id = parseInt(id)
    const { prov_name } = body
    pool.query('UPDATE provinces SET prov_name = $1 WHERE prov_id = $2 RETURNING *', [prov_name, prov_id], (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(`A new province has been updated: ${JSON.stringify(results.rows[0])}`);
        // resolve(results.rows[0]);
      }
    })
  })
}

// In case needed
const getMaxProvinceId = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT MAX(prov_id) FROM provinces', (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(results.rows[0]);
      }
    })
  })
}

// In case needed
const getProvinceNameById = (id) => {
  return new Promise(function(resolve, reject) {
    const prov_id = parseInt(id)
    pool.query('SELECT prov_name FROM provinces WHERE prov_id = $1', [prov_id], (error, results) => {
      if (error) {
        // console.log("Error occured: ", error)
        reject(error);
      } else {
        resolve(results.rows[0]);
      }
    })
  })
}


module.exports = {
  getProvinces,
  createProvince,
  deleteProvince,
  updateProvince,
  getMaxProvinceId,
  getProvinceNameById,
}
