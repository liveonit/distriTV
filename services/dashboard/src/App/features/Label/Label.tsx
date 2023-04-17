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
import { labelsIsLoadingSelector, labelsSelector } from 'src/store/label/label.selector'
import { CircularProgress } from 'node_modules/@mui/material'
import Button from '@material-ui/core/Button'
import { listLabels } from 'src/store/label/label.action'
import { LabelT } from 'src/store/label/label.type'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'

import LabelCreateAndEditModal from './LabelCreateAndEditModal'
import LabelDeleteModal from './LabelDeleteModal'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function LabelList() {
  const classes = useStyles()
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(listLabels())
  }, [dispatch])

  const isLoading = useSelector(labelsIsLoadingSelector)
  const labels = useSelector(labelsSelector)
  const [isModalCreate, setIsModalCreate] = React.useState(false)
  const [labelToEdit, setLabelToEdit] = React.useState<LabelT | null>(null)
  const [labelToDelete, setLabelToDelete] = React.useState<LabelT | null>(null)
  const [titleModal, setModalTitle] = React.useState('Titulo')

  function handleCloseEditLabelModal() {
    setLabelToEdit(null)
    setIsModalCreate(false)
  }

  function handleCloseDeleteLabelModal() {
    setLabelToDelete(null)
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid item sm={8}>
          <h2>Instituciones</h2>
        </Grid>
        <Grid item sm={4} container justifyContent='flex-end'>
          <Button
            variant='contained'
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => {
              setModalTitle('Crear Institución')
              setIsModalCreate(true)
            }}
          >
            Nuevo
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
            {labels.map((label) => (
              <TableRow key={label.id}>
                <TableCell component='th' scope='row'>
                  {label.name}
                </TableCell>
                <TableCell>{label.name}</TableCell>
                <TableCell>{label.description}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setModalTitle('Editar etiqueta')
                      setLabelToEdit(label)
                    }}
                    color='primary'
                    aria-label='edit label'
                    component='span'
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setLabelToDelete(label)
                    }}
                    color='primary'
                    aria-label='delete label'
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
      {(!!labelToEdit || isModalCreate) && (
        <LabelCreateAndEditModal
          title={titleModal}
          label={labelToEdit!}
          handleCloseEditModal={handleCloseEditLabelModal}
        />
      )}
      {!!labelToDelete && (
        <LabelDeleteModal
          isOpen={!!labelToDelete}
          label={labelToDelete!}
          handleCloseDeleteModal={handleCloseDeleteLabelModal}
        />
      )}
    </>
  )
}
