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
import { indigo } from '@mui/material/colors';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: indigo[500],
    color: theme.palette.common.white,
  },
}));

const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: indigo[200],
    color: theme.palette.common.white,
    fontSize: 20,
    textAlign: "left",
    paddingLeft: "30px",
  },
}));

const columns = [
  { 
    id: 'prov_id',
    label: 'ID', 
    minWidth: 50,
    align: 'center',
    format: (value) => value.toLocaleString('id-ID'),
  },
  { 
    id: 'prov_name',
    label: 'Nama Provinsi',
    minWidth: 270
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

function createProvinceData(prov_id, prov_name) {
  // notes: update_item and delete_item values are not used for province table
  const update_item = prov_id;
  const delete_item = prov_id;
  return { prov_id, prov_name, update_item, delete_item };
}

export default function ProvinceTable() {
  // Hook for province data
  const [provinceObj, setProvinces] = useState({
    provinces: [],
    curr_prov_id: undefined
  });

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

  const updateNameRef = useRef('');

  // Hook for create dialog function
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

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

  const handleUpdateDialogOpen = (id, name) => {
    setOpenUpdateDialog(true);
    setUpdateDialogId(id);
    setUpdateDialogName(name);
  };

  const handleUpdateDialogClose = () => {
    setOpenUpdateDialog(false);
    setUpdateDialogId(0);
    setUpdateDialogName("");
  };

  const handleCreateDialogOpen = () => {
    setOpenCreateDialog(true);
  };

  const handleCreateDialogClose = () => {
    setOpenCreateDialog(false);
  };

  function getProvinces() {
    fetch('http://localhost:3001/provinces')
      .then(response => {
        return response.text();
      })
      .then(data => {
        const provinceRows = [];
        const dataJson = JSON.parse(data)
        dataJson.forEach(function(province) { 
          provinceRows.push(createProvinceData(province.prov_id, province.prov_name)) 
        });
        setProvinces(prevState => ({
          ...prevState,
          provinces: provinceRows 
        }));
      });
  }

  function getCurrentProvinceId() {
    let max_id;
    fetch('http://localhost:3001/provinces/get-max-id')
      .then(response => {
        return response.text();
      })
      .then(data => {
        const rawJson = JSON.parse(data);
        max_id = rawJson["max"];
        setProvinces(prevState => ({
          ...prevState,
          curr_prov_id: max_id+1 
        }));
      });
  }

  function createProvince(prov_name) {
    const prov_id = provinceObj.curr_prov_id;
    prov_name = prov_name.toUpperCase();

    if (prov_name == "" || prov_name == null) {
      alert("Mohon jangan memasukkan nama kosong");
      return;
    }

    fetch('http://localhost:3001/provinces/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({prov_id, prov_name}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        // alert(data);
        const alertText = "Provinsi " + prov_name + " dengan ID " + prov_id + " telah berhasil dibuat"; 
        alert(alertText)
        getProvinces();
        getCurrentProvinceId();
      });
  }

  function deleteProvince() {
    const prov_id = deleteDialogId;

    fetch(`http://localhost:3001/provinces/delete/${prov_id}`, {
      method: 'DELETE',
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        // alert(data);
        const alertText = "Provinsi dengan ID " + prov_id + " telah berhasil dihapus";
        alert(alertText)
        getProvinces();
        getCurrentProvinceId();
      });
  }

  function updateProvince(prov_name) {
    const prov_id = updateDialogId;
    prov_name = prov_name.toUpperCase();

    if (prov_name == updateDialogName) {
      alert("Tidak ada data yang diganti");
      return;
    }

    if (prov_name == "" || prov_name == null) {
      alert("Mohon jangan memasukkan nama kosong")
      return;
    }

    fetch(`http://localhost:3001/provinces/update/${prov_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({prov_name}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        // alert(data);
        const alertText = "Provinsi dengan ID " + prov_id + " telah berhasil diubah";
        alert(alertText)
        getProvinces();
      });
  }

  useEffect(() => {
    getProvinces();
    getCurrentProvinceId();
  }, []);

  return (
    <>
      <Paper sx={{ width: '100%', minWidth: 330, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell2 align="center" colSpan={4}>
                  <Grid container spacing={2}>
                    <Grid xs={4}>
                      <b>Tabel Provinsi</b>
                    </Grid>
                    <Grid xs={8} style={{ textAlign: "right" , paddingRight: "20px" }}>
                      <Button size="small" variant="contained" color="success" startIcon={<AddLocationIcon />} onClick={handleCreateDialogOpen}>
                        Tambah Provinsi
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
              {provinceObj.provinces
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow key={row.prov_id} hover role="checkbox" tabIndex={-1}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id == "update_item" || column.id == "delete_item") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id == "delete_item"
                                ? <Button onClick={() => handleDeleteDialogOpen(row.prov_id, row.prov_name)} variant="outlined" size="small" startIcon={<DeleteForeverIcon />}>Delete</Button>
                                : <Button onClick={() => handleUpdateDialogOpen(row.prov_id, row.prov_name)} variant="outlined" size="small" startIcon={<ModeEditIcon />}>Update</Button>
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
          count={provinceObj.provinces.length}
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
          {"Hapus Provinsi " + deleteDialogName + " (ID " + deleteDialogId + ")?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <b style={{ color:'red' }}>[WARNING]:</b> Semua Kabupaten dan Kecamatan yang berada dibawah Provinsi ini juga akan terhapus.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteDialogClose}>
            Kembali
          </Button>
          <Button onClick={()=>{ deleteProvince(); handleDeleteDialogClose() }} autoFocus>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateDialog} onClose={handleUpdateDialogClose}>
        <DialogTitle>
          {"Edit Provinsi " + updateDialogName + " (ID " + updateDialogId + ")"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="update_prov_name"
            label="Nama baru Provinsi"
            type="string"
            defaultValue={updateDialogName}
            inputRef={updateNameRef}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateDialogClose}>Kembali</Button>
          <Button onClick={()=>{ updateProvince(updateNameRef.current.value); handleUpdateDialogClose() }}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreateDialog} onClose={handleCreateDialogClose}>
        <DialogTitle>
          {"Tambah Provinsi baru:"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="create_prov_name"
            label="Nama Provinsi baru"
            type="string"
            inputRef={createNameRef}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Kembali</Button>
          <Button onClick={()=>{ createProvince(createNameRef.current.value); handleCreateDialogClose() }}>Tambah Provinsi</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}