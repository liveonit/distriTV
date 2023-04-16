import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import { useDispatch, useSelector } from 'react-redux'
import { televisionsIsLoadingSelector, televisionsSelector } from 'src/store/television/television.selector'
import { CircularProgress } from 'node_modules/@mui/material'
import Button from '@material-ui/core/Button'
import { listTelevisionsJoin } from 'src/store/television/television.action'
import { TelevisionT } from 'src/store/television/television.type'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete';

import TelevisionCreateAndEditModal from './TelevisionCreateAndEditModal'
import TelevisionDeleteModal from './TelevisionDeleteModal'



const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function TelevisionList() {
  const classes = useStyles()
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(listTelevisionsJoin())
  }, [dispatch])
  

  const isLoading = useSelector(televisionsIsLoadingSelector)
  const televisions = useSelector(televisionsSelector)
  const [isModalCreate, setIsModalCreate] = React.useState(false)
  const [televisionToEdit, setTelevisionToEdit] = React.useState<TelevisionT | null>(null)
  const [televisionToDelete, setTelevisionToDelete] = React.useState<TelevisionT | null>(null)
  const [titleModal, setModalTitle] = React.useState('Titulo')

  function handleCloseEditTelevisionModal() {
    setTelevisionToEdit(null)
    setIsModalCreate(false)
  }

  function handleCloseDeleteTelevisionModal() {
    setTelevisionToDelete(null)
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid sm={8}>
          <h2>Televisiones</h2>
        </Grid>
        <Grid sm={4} container justifyContent='flex-end'>
          <Button
            variant='contained'
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => {
              setModalTitle('Crear Television')
              setIsModalCreate(true)
            }
            }
          >
            Nuevo
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Ip</TableCell>
              <TableCell>Mac</TableCell>
              <TableCell>Institución</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {televisions.map((television) => (
              <TableRow key={television.id}>
                <TableCell component='th' scope='row'>
                  {television.id}
                </TableCell>
                <TableCell>{television.ip}</TableCell>
                <TableCell>{television.mac}</TableCell>
                <TableCell>{television?.institution?.name}</TableCell>
                <TableCell>
                  <IconButton color='primary' aria-label='edit television' component='span'>
                    <EditIcon onClick={() => {
                      setModalTitle('Editar Televisión')
                      setTelevisionToEdit(television)
                    }

                    } />
                  </IconButton>
                  <IconButton color='primary' aria-label='delete television' component='span'>
                    <DeleteIcon onClick={() => {

                      setTelevisionToDelete(television)
                    }

                    } />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(!!televisionToEdit || isModalCreate) &&
        <TelevisionCreateAndEditModal
          title={titleModal}
          television={televisionToEdit!}
          handleCloseEditModal={handleCloseEditTelevisionModal}
        />}
        {!!televisionToDelete&&
      <TelevisionDeleteModal
        isOpen={!!televisionToDelete}
        television={televisionToDelete!}
        handleCloseDeleteModal={handleCloseDeleteTelevisionModal}
      />}
    </>
  )
}
