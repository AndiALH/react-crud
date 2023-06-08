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
import { teal } from '@mui/material/colors';

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
    backgroundColor: teal[900],
    color: theme.palette.common.white,
  },
}));

const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: teal[400],
    color: theme.palette.common.white,
    fontSize: 20,
    textAlign: "left",
    paddingLeft: "30px",
  },
}));

const columns = [
  { 
    id: 'dis_id',
    label: 'ID', 
    minWidth: 50,
    align: 'center',
    format: (value) => value.toLocaleString('id-ID'),
  },
  { 
    id: 'dis_name',
    label: 'Nama Kecamatan',
    minWidth: 100
  },
  { 
    id: 'city_name',
    label: 'Kabupaten',
    minWidth: 90
  },
  { 
    id: 'prov_name',
    label: 'Provinsi',
    minWidth: 80
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

function createDistrictData(dis_id, dis_name, city_id, city_name, prov_name) {
  // notes: update_item or delete_item values are used to store referenced city id
  const update_item = city_id;
  const delete_item = city_id;
  return { dis_id, dis_name, city_name, prov_name, update_item, delete_item };
}

export default function DistrictTable() {
  // Hook for district data
  const [districtObj, setDistricts] = useState({
    districts: [],
    curr_dis_id: undefined
  });

  // Variable to store cities option
  const cityList = [];

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
  const [updateDialogCityData, setUpdateDialogCityData] = useState(null);
  const [updateCityOldId, setUpdateCityOldId] = useState(0);

  const updateNameRef = useRef('');

  // Hook for create dialog function
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [createDialogCityData, setCreateDialogCityData] = useState(null);

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

  const handleUpdateDialogOpen = (id, name, city_id) => {
    setOpenUpdateDialog(true);
    setUpdateDialogId(id);
    setUpdateDialogName(name);
    let cityData = cityList.filter(data => {
      return data.id == city_id
    });
    setUpdateDialogCityData(cityData[0]);
    setUpdateCityOldId(city_id);
  };

  const handleUpdateDialogClose = () => {
    setOpenUpdateDialog(false);
    setUpdateDialogId(0);
    setUpdateDialogName("");
    setUpdateDialogCityData(null);
  };

  const handleCreateDialogOpen = () => {
    setOpenCreateDialog(true);
    setCreateDialogCityData(null);
  };

  const handleCreateDialogClose = () => {
    setOpenCreateDialog(false);
    setCreateDialogCityData(null);
  };

  function getDistricts() {
    fetch('http://localhost:3001/districts')
      .then(response => {
        return response.text();
      })
      .then(data => {
        const districtRows = [];
        const dataJson = JSON.parse(data)
        dataJson.forEach(function(district) { 
          districtRows.push(createDistrictData(district.dis_id, district.dis_name, district.city_id, district.city_name, district.prov_name))
        });
        setDistricts(prevState => ({
          ...prevState,
          districts: districtRows 
        }));
      });
  }

  function getCurrentDistrictId() {
    let max_id;
    fetch('http://localhost:3001/districts/get-max-id')
      .then(response => {
        return response.text();
      })
      .then(data => {
        const rawJson = JSON.parse(data);
        max_id = rawJson["max"];
        setDistricts(prevState => ({
          ...prevState,
          curr_dis_id: max_id+1 
        }));
      });
  }

  function createDistrict(dis_name, cityData) {
    const dis_id = districtObj.curr_dis_id;
    dis_name = dis_name.toUpperCase();

    if (dis_name == "" || dis_name == null) {
      alert("Mohon jangan memasukkan nama kosong");
      return;
    }

    if (cityData == null || cityData == "") {
      alert("Mohon pilih salah satu kabupaten")
      return;
    }

    const city_id = cityData.id

    fetch('http://localhost:3001/districts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({dis_id, dis_name, city_id}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        // alert(data);
        const alertText = "Kecamatan " + dis_name + " dengan ID " + dis_id + " telah berhasil dibuat"; 
        alert(alertText)
        getDistricts();
        getCurrentDistrictId();
      });
  }

  function deleteDistrict() {
    const dis_id = deleteDialogId;

    fetch(`http://localhost:3001/districts/delete/${dis_id}`, {
      method: 'DELETE',
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        // alert(data);
        const alertText = "Kecamatan dengan ID " + dis_id + " telah berhasil dihapus";
        alert(alertText)
        getDistricts();
        getCurrentDistrictId();
      });
  }

  function updateDistrict(dis_name, cityData) {
    const dis_id = updateDialogId;
    dis_name = dis_name.toUpperCase();

    if (dis_name == "" || dis_name == null) {
      alert("Mohon jangan memasukkan nama kosong")
      return;
    }

    if (cityData == null || cityData == "") {
      alert("Mohon pilih salah satu kabupaten")
      return;
    }

    const city_id = cityData.id

    if (dis_name == updateDialogName && city_id == updateCityOldId) {
      alert("Tidak ada data yang diganti");
      return;
    }

    fetch(`http://localhost:3001/districts/update/${dis_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({dis_name, city_id}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        // alert(data);
        const alertText = "Kecamatan dengan ID " + dis_id + " telah berhasil diubah";
        alert(alertText)
        getDistricts();
      });
  }

  // function only called once to get all cities list for dropdown
  const initCitiesList = () => {
    fetch('http://localhost:3001/cities')
      .then(response => {
        return response.text();
      })
      .then(data => {
        const dataJson = JSON.parse(data)
        cityList.length = 0;
        dataJson.forEach(function(city) {
          cityList.push({ 
            id: city.city_id, 
            name: city.city_name })
        });
      });
  }
  initCitiesList();

  useEffect(() => {
    getDistricts();
    getCurrentDistrictId();
    initCitiesList();
  }, []);

  return (
    <>
      {/* <Button variant="outlined" startIcon={<AddLocationIcon />} onClick={handleCreateDialogOpen}>
        Tambah Kecamatan
      </Button>
      <br></br> */}

      <Paper sx={{ width: '100%', minWidth: 330, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell2 align="center" colSpan={6}>
                  <Grid container spacing={2}>
                    <Grid xs={4}>
                      <b>Tabel Kecamatan</b>
                    </Grid>
                    <Grid xs={8} style={{ textAlign: "right" , paddingRight: "20px" }}>
                      <Button size="small" variant="contained" color="success" startIcon={<AddLocationIcon />} onClick={handleCreateDialogOpen}>
                        Tambah Kecamatan
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
              {districtObj.districts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow key={row.dis_id} hover role="checkbox" tabIndex={-1}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id == "update_item" || column.id == "delete_item") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id == "delete_item"
                                ? <Button color="error" onClick={() => handleDeleteDialogOpen(row.dis_id, row.dis_name)} variant="outlined" size="small" startIcon={<DeleteForeverIcon />}>Delete</Button>
                                : <Button onClick={() => handleUpdateDialogOpen(row.dis_id, row.dis_name, row.update_item)} variant="outlined" size="small" startIcon={<ModeEditIcon />}>Update</Button>
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
          count={districtObj.districts.length}
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
          {"Hapus Kecamatan " + deleteDialogName + " (ID " + deleteDialogId + ")?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Apakah yakin Kecamatan ini ingin dihapus?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteDialogClose}>
            Kembali
          </Button>
          <Button onClick={()=>{ deleteDistrict(); handleDeleteDialogClose() }} autoFocus>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateDialog} onClose={handleUpdateDialogClose}>
        <DialogTitle>
          {"Edit Kecamatan " + updateDialogName + " (ID " + updateDialogId + ")"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <TextField
              autoFocus
              margin="dense"
              id="update_dis_name"
              label="Nama baru Kecamatan"
              type="string"
              defaultValue={updateDialogName}
              inputRef={updateNameRef}
              fullWidth
              variant="standard"
            />
            <Autocomplete
              id="controlled-demo"
              getOptionLabel={(option) => option.name}
              options={cityList}
              value={updateDialogCityData}
              isOptionEqualToValue={(option, value) =>
                option.id === value.id
              }
              onChange={(event, newValue) => {
                setUpdateDialogCityData(newValue);
              }}
              fullWidth
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Kabupaten" variant="standard" />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateDialogClose}>Kembali</Button>
          <Button onClick={()=>{ updateDistrict(updateNameRef.current.value, updateDialogCityData); handleUpdateDialogClose() }}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreateDialog} onClose={handleCreateDialogClose}>
        <DialogTitle>
          {"Tambah Kecamatan baru:"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <TextField
              autoFocus
              margin="dense"
              id="create_dis_name"
              label="Nama Kecamatan baru"
              type="string"
              inputRef={createNameRef}
              fullWidth
              variant="standard"
            />
            <Autocomplete
              id="controlled-demo"
              getOptionLabel={(option) => option.name}
              options={cityList}
              isOptionEqualToValue={(option, value) =>
                option.id === value.id
              }
              onChange={(event, newValue) => {
                setCreateDialogCityData(newValue);
              }}
              fullWidth
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Kabupaten" variant="standard" />}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Kembali</Button>
          <Button onClick={()=>{ createDistrict(createNameRef.current.value, createDialogCityData); handleCreateDialogClose() }}>Tambah Kecamatan</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}