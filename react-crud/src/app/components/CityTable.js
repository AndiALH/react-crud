"use client";

import React, {useState, useEffect, useRef} from 'react';

import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Unstable_Grid2';

import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { red } from '@mui/material/colors';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: red['A400'],
    color: theme.palette.common.white,
  },
}));

const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: red['A200'],
    color: theme.palette.common.white,
    fontSize: 20,
    textAlign: "left",
    paddingLeft: "30px",
  },
}));

const columns = [
  { 
    id: 'city_id',
    label: 'ID', 
    minWidth: 50,
    align: 'center',
    format: (value) => value.toLocaleString('id-ID'),
  },
  { 
    id: 'city_name',
    label: 'Nama Kabupaten',
    minWidth: 140
  },
  { 
    id: 'prov_name',
    label: 'Provinsi',
    minWidth: 130
  },
  {
    id: 'update_item',
    label: '',
    minWidth: 60,
    format: (value) => value.toLocaleString('id-ID'),
  },
  {
    id: 'delete_item',
    label: '',
    minWidth: 60,
    format: (value) => value.toLocaleString('id-ID'),
  }
];

function createCityData(city_id, city_name, prov_id, prov_name) {
  // notes: update_item or delete_item values are used to store referenced province id
  const update_item = prov_id;
  const delete_item = prov_id;
  return { city_id, city_name, prov_name, update_item, delete_item };
}

export default function CityTable() {
  // Hook for city data
  const [cityObj, setCities] = useState({
    cities: [],
    curr_city_id: undefined
  });

  // Variable to store provinces option
  const provinceList = [];

  // Hook for table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Hook for delete dialog function
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteDialogId, setDeleteDialogId] = useState(0);
  const [deleteDialogName, setDeleteDialogName] = useState("");

  // Hook for update dialog function
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateDialogId, setUpdateDialogId] = useState(0);
  const [updateDialogName, setUpdateDialogName] = useState("");
  const [updateDialogProvData, setUpdateDialogProvData] = useState(null);
  const [updateProvOldId, setUpdateProvOldId] = useState(0);

  const updateNameRef = useRef('');

  // Hook for create dialog function
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [createDialogProvData, setCreateDialogProvData] = useState(null);

  const createNameRef = useRef('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteDialogOpen = (id, name) => {
    setOpenDeleteDialog(true);
    setDeleteDialogId(id);
    setDeleteDialogName(name);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setDeleteDialogId(0);
    setDeleteDialogName("");
  };

  const handleUpdateDialogOpen = (id, name, prov_id) => {
    setOpenUpdateDialog(true);
    setUpdateDialogId(id);
    setUpdateDialogName(name);
    let provData = provinceList.filter(data => {
      return data.id == prov_id
    });
    setUpdateDialogProvData(provData[0]);
    setUpdateProvOldId(prov_id);
  };

  const handleUpdateDialogClose = () => {
    setOpenUpdateDialog(false);
    setUpdateDialogId(0);
    setUpdateDialogName("");
    setUpdateDialogProvData(null);
  };

  const handleCreateDialogOpen = () => {
    setOpenCreateDialog(true);
    setCreateDialogProvData(null);
  };

  const handleCreateDialogClose = () => {
    setOpenCreateDialog(false);
    setCreateDialogProvData(null);
  };

  function getCities() {
    fetch('http://localhost:3001/cities')
      .then(response => {
        return response.text();
      })
      .then(data => {
        const cityRows = [];
        const dataJson = JSON.parse(data)
        dataJson.forEach(function(city) { 
          cityRows.push(createCityData(city.city_id, city.city_name, city.prov_id, city.prov_name))
        });
        setCities(prevState => ({
          ...prevState,
          cities: cityRows 
        }));
      });
  }

  function getCurrentCityId() {
    let max_id;
    fetch('http://localhost:3001/cities/get-max-id')
      .then(response => {
        return response.text();
      })
      .then(data => {
        const rawJson = JSON.parse(data);
        max_id = rawJson["max"];
        setCities(prevState => ({
          ...prevState,
          curr_city_id: max_id+1 
        }));
      });
  }

  function createCity(city_name, provData) {
    const city_id = cityObj.curr_city_id;
    city_name = city_name.toUpperCase();

    if (city_name == "" || city_name == null) {
      alert("Mohon jangan memasukkan nama kosong");
      return;
    }

    if (provData == null || provData == "") {
      alert("Mohon pilih salah satu provinsi")
      return;
    }

    const prov_id = provData.id

    fetch('http://localhost:3001/cities/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({city_id, city_name, prov_id}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        // alert(data);
        const alertText = "Kabupaten " + city_name + " dengan ID " + city_id + " telah berhasil dibuat"; 
        alert(alertText)
        getCities();
        getCurrentCityId();
      });
  }

  function deleteCity() {
    const city_id = deleteDialogId;

    fetch(`http://localhost:3001/cities/delete/${city_id}`, {
      method: 'DELETE',
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        // alert(data);
        const alertText = "Kabupaten dengan ID " + city_id + " telah berhasil dihapus";
        alert(alertText)
        getCities();
        getCurrentCityId();
      });
  }

  function updateCity(city_name, provData) {
    const city_id = updateDialogId;
    city_name = city_name.toUpperCase();

    if (city_name == "" || city_name == null) {
      alert("Mohon jangan memasukkan nama kosong")
      return;
    }

    if (provData == null || provData == "") {
      alert("Mohon pilih salah satu provinsi")
      return;
    }

    const prov_id = provData.id

    if (city_name == updateDialogName && prov_id == updateProvOldId) {
      alert("Tidak ada data yang diganti");
      return;
    }

    fetch(`http://localhost:3001/cities/update/${city_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({city_name, prov_id}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        // alert(data);
        const alertText = "Kabupaten dengan ID " + city_id + " telah berhasil diubah";
        alert(alertText)
        getCities();
      });
  }

  // function only called once to get all provinces list for dropdown
  const initProvincesList = () => {
    fetch('http://localhost:3001/provinces')
      .then(response => {
        return response.text();
      })
      .then(data => {
        const dataJson = JSON.parse(data)
        provinceList.length = 0;
        dataJson.forEach(function(province) {
          provinceList.push({ 
            id: province.prov_id, 
            name: province.prov_name })
        });
      });
  }
  initProvincesList();

  useEffect(() => {
    getCities();
    getCurrentCityId();
    initProvincesList();
  }, []);

  return (
    <>
      {/* <Button variant="outlined" startIcon={<AddLocationIcon />} onClick={handleCreateDialogOpen}>
        Tambah Kabupaten
      </Button>
      <br></br> */}

      <Paper sx={{ width: '100%', minWidth: 330, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell2 align="center" colSpan={5}>
                  <Grid container spacing={2}>
                    <Grid xs={4}>
                      <b>Tabel Kabupaten</b>
                    </Grid>
                    <Grid xs={8} style={{ textAlign: "right" , paddingRight: "20px" }}>
                      <Button size="small" variant="contained" color="success" startIcon={<AddLocationIcon />} onClick={handleCreateDialogOpen}>
                        Tambah Kabupaten
                      </Button>
                    </Grid>
                  </Grid>
                </StyledTableCell2>
              </TableRow>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell 
                    key={column.id}
                    align={column.align}
                    style={{ top: 64, minWidth: column.minWidth }}
                  >
                    <b>{column.label}</b>
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {cityObj.cities
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow key={row.city_id} hover role="checkbox" tabIndex={-1}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id == "update_item" || column.id == "delete_item") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id == "delete_item"
                                ? <Button color="error" onClick={() => handleDeleteDialogOpen(row.city_id, row.city_name)} variant="outlined" size="small" startIcon={<DeleteForeverIcon />}>Delete</Button>
                                : <Button onClick={() => handleUpdateDialogOpen(row.city_id, row.city_name, row.update_item)} variant="outlined" size="small" startIcon={<ModeEditIcon />}>Update</Button>
                              }
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 30, 100, 500]}
          component="div"
          count={cityObj.cities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Hapus Kabupaten " + deleteDialogName + " (ID " + deleteDialogId + ")?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <b style={{ color:'red' }}>[WARNING]:</b> Semua Kecamatan yang berada dibawah Kabupaten ini juga akan terhapus.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteDialogClose}>
            Kembali
          </Button>
          <Button onClick={()=>{ deleteCity(); handleDeleteDialogClose() }} autoFocus>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateDialog} onClose={handleUpdateDialogClose}>
        <DialogTitle>
          {"Edit Kabupaten " + updateDialogName + " (ID " + updateDialogId + ")"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <TextField
              autoFocus
              margin="dense"
              id="update_city_name"
              label="Nama baru Kabupaten"
              type="string"
              defaultValue={updateDialogName}
              inputRef={updateNameRef}
              fullWidth
              variant="standard"
            />
            <Autocomplete
              id="controlled-demo"
              getOptionLabel={(option) => option.name}
              options={provinceList}
              value={updateDialogProvData}
              isOptionEqualToValue={(option, value) =>
                option.id === value.id
              }
              onChange={(event, newValue) => {
                setUpdateDialogProvData(newValue);
              }}
              fullWidth
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Provinsi" variant="standard" />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateDialogClose}>Kembali</Button>
          <Button onClick={()=>{ updateCity(updateNameRef.current.value, updateDialogProvData); handleUpdateDialogClose() }}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreateDialog} onClose={handleCreateDialogClose}>
        <DialogTitle>
          {"Tambah Kabupaten baru:"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <TextField
              autoFocus
              margin="dense"
              id="create_city_name"
              label="Nama Kabupaten baru"
              type="string"
              inputRef={createNameRef}
              fullWidth
              variant="standard"
            />
            <Autocomplete
              id="controlled-demo"
              getOptionLabel={(option) => option.name}
              options={provinceList}
              isOptionEqualToValue={(option, value) =>
                option.id === value.id
              }
              onChange={(event, newValue) => {
                setCreateDialogProvData(newValue);
              }}
              fullWidth
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Provinsi" variant="standard" />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Kembali</Button>
          <Button onClick={()=>{ createCity(createNameRef.current.value, createDialogProvData); handleCreateDialogClose() }}>Tambah Kabupaten</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}