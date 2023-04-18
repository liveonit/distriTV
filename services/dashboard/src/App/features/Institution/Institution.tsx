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
import DeleteIcon from '@material-ui/icons/Delete'
import { useDispatch, useSelector } from 'react-redux'
import { institutionsIsLoadingSelector, institutionsSelector } from 'src/store/institution/institutions.selector'
import { CircularProgress } from 'node_modules/@mui/material'
import Button from '@material-ui/core/Button'
import { listInstitutions } from 'src/store/institution/institution.action'
import { InstitutionT } from 'src/store/institution/institution.type'
import AddIcon from '@material-ui/icons/Add'

import InstitutionCreateAndEditModal from './InstitutionCreateAndEditModal'
import InstitutionDeleteModal from './InstitutionDeleteModal'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function InstitutionList() {
  const classes = useStyles()
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(listInstitutions())
  }, [dispatch])

  const isLoading = useSelector(institutionsIsLoadingSelector)
  const institutions = useSelector(institutionsSelector)
  const [isModalCreate, setIsModalCreate] = React.useState(false)
  const [institutionToEdit, setInstitutionToEdit] = React.useState<InstitutionT | null>(null)
  const [institutionToDelete, setInstitutionToDelete] = React.useState<InstitutionT | null>(null)
  const [titleModal, setModalTitle] = React.useState('Titulo')

  function handleCloseEditInstitutionModal() {
    setInstitutionToEdit(null)
    setIsModalCreate(false)
  }

  function handleCloseDeleteInstitutionModal() {
    setInstitutionToDelete(null)
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid item sm={8}>
          <h2>Institutions</h2>
        </Grid>
        <Grid item sm={4} container justifyContent='flex-end'>
          <Button
            variant='contained'
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => {
              setModalTitle('Create Institution')
              setIsModalCreate(true)
            }}
          >
            New
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Locality</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institutions.map((institution) => (
              <TableRow key={institution.id}>
                <TableCell component='th' scope='row'>
                  {institution.name}
                </TableCell>
                <TableCell>{institution.city}</TableCell>
                <TableCell>{institution.locality}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setModalTitle('Editar Institución')
                      setInstitutionToEdit(institution)
                    }}
                    color='primary'
                    aria-label='edit institution'
                    component='span'
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setInstitutionToDelete(institution)
                    }}
                    color='primary'
                    aria-label='delete institution'
                    component='span'
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(!!institutionToEdit || isModalCreate) && (
        <InstitutionCreateAndEditModal
          title={titleModal}
          institution={institutionToEdit!}
          handleCloseEditModal={handleCloseEditInstitutionModal}
        />
      )}
      {!!institutionToDelete && (
        <InstitutionDeleteModal
          isOpen={!!institutionToDelete}
          institution={institutionToDelete!}
          handleCloseDeleteModal={handleCloseDeleteInstitutionModal}
        />
      )}
    </>
  )
}
