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
import { agendasIsLoadingSelector, agendasSelector } from 'src/store/agenda/agendas.selector'
import { CircularProgress } from 'node_modules/@mui/material'
import Button from '@material-ui/core/Button'
import { listAgendas } from 'src/store/agenda/agenda.action'
import { AgendaT } from 'src/store/agenda/agenda.type'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete';

import AgendaCreateAndEditModal from './AgendaCreateAndEditModal'
import AgendaDeleteModal from './AgendaDeleteModal'



const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function AgendaList() {
  const classes = useStyles()
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(listAgendas())
  }, [dispatch])

  const isLoading = useSelector(agendasIsLoadingSelector)
  const agendas = useSelector(agendasSelector)
  const [isModalCreate, setIsModalCreate] = React.useState(false)
  const [agendaToEdit, setAgendaToEdit] = React.useState<AgendaT | null>(null)
  const [agendaToDelete, setAgendaToDelete] = React.useState<AgendaT | null>(null)
  const [titleModal, setModalTitle] = React.useState('Titulo')

  function handleCloseEditAgendaModal() {
    setAgendaToEdit(null)
    setIsModalCreate(false)
  }

  function handleCloseDeleteAgendaModal() {
    setAgendaToDelete(null)
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid sm={8}>
          <h2>Agenda</h2>
        </Grid>
        <Grid sm={4} container justifyContent='flex-end'>
          <Button
            variant='contained'
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => {
              setModalTitle('Crear Agenda')
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
              <TableCell>Televisión</TableCell>
              <TableCell>Hora inicio</TableCell>
              <TableCell>Hora fin</TableCell>
              <TableCell>A reproducir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agendas.map((agenda) => (
              <TableRow key={agenda.contentId}>
                <TableCell component='th' scope='row'>
                  {agenda.televisionId}
                </TableCell>
                <TableCell>{agenda.startDate.toString()}</TableCell>
                <TableCell>{agenda.endDate.toString()}</TableCell>
                <TableCell>
                  <IconButton color='primary' aria-label='edit agenda' component='span'>
                    <EditIcon onClick={() => {

                      setModalTitle('Editar Agenda')
                      setAgendaToEdit(agenda)
                    }

                    } />
                  </IconButton>
                  <IconButton color='primary' aria-label='delete agenda' component='span'>
                    <DeleteIcon onClick={() => {

                      setAgendaToDelete(agenda)
                    }

                    } />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(!!agendaToEdit || isModalCreate) &&
        <AgendaCreateAndEditModal
          title={titleModal}
          agenda={agendaToEdit!}
          handleCloseEditModal={handleCloseEditAgendaModal}
        />}
      <AgendaDeleteModal
        isOpen={!!agendaToDelete}
        agenda={agendaToDelete!}
        handleCloseDeleteModal={handleCloseDeleteAgendaModal}
      />
    </>
  )
}