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
import DeleteIcon from '@material-ui/icons/Delete'
import { Trans } from 'react-i18next/TransWithoutContext'
import dayjs from 'dayjs'
import { SearchBox } from 'src/App/components/molecules/Search/SearchBox'
import { useSearchQueryString } from 'src/App/hooks/useSearchQueryString'
import { useTranslation } from 'react-i18next'
import { labelsSelector } from 'src/store/label/label.selector'
import { listLabels } from 'src/store/label/label.action'
import { televisionsSelector } from 'src/store/television/television.selector'
import { listTelevisions } from 'src/store/television/television.action'
import { listContents } from 'src/store/content/content.action'
import { contentSelector } from 'src/store/content/content.selector'

import AgendaDeleteModal from './AgendaDeleteModal'
import AgendaCreateAndEditModal from './AgendaCreateAndEditModal'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function AgendaList() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const searchQueryString = useSearchQueryString()
  const { t } = useTranslation()

  React.useEffect(() => {
    dispatch(listContents())
    dispatch(listLabels())
    dispatch(listTelevisions())
    dispatch(
      listAgendas({
        query: searchQueryString ? `search=${searchQueryString}` : '',
      }),
    )
  }, [dispatch, searchQueryString])

  const isLoading = useSelector(agendasIsLoadingSelector)
  const agendas = useSelector(agendasSelector)
  const labels = useSelector(labelsSelector)
  const televisions = useSelector(televisionsSelector)
  const contents = useSelector(contentSelector)
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
        <Grid item sm={8}>
          <h2>
            <Trans>SCHEDULE</Trans>
          </h2>
        </Grid>
        <Grid item sm={4} container justifyContent='flex-end'>
          <Button
            variant='contained'
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => {
              setModalTitle('CREATE')
              setIsModalCreate(true)
            }}
          >
            <Trans>NEW</Trans>
          </Button>
        </Grid>
      </Grid>
      <SearchBox
            searches={[
              { type: 'Multi', name: 'content.name', placeholder: t('CONTENT'), options: contents.map(content => content.name) },
              { type: 'Multi', name: 'television.name', placeholder: t('TELEVISION'), options: televisions.map(tele => tele.name) },
              { type: 'Multi', name: 'label.name', placeholder: t('LABEL'), options: labels.map(label => label.name) },
            ]}
          />
          <br />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
            <TableCell>
                <Trans>ID</Trans>
              </TableCell>
            <TableCell>
                <Trans>CONTENT</Trans>
              </TableCell>
              <TableCell>
                <Trans>TELEVISION</Trans>
              </TableCell>
              <TableCell>
                <Trans>LABEL</Trans>
              </TableCell>
              <TableCell>
                <Trans>START_DATE</Trans>
              </TableCell>
              <TableCell>
                <Trans>END_DATE</Trans>
              </TableCell>
              <TableCell>
                <Trans>ACTION</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agendas.map((agenda) => (
              <TableRow key={agenda.id}>
                <TableCell>{agenda.id}</TableCell>
                <TableCell>{agenda.content?.name}</TableCell>
                <TableCell component='th' scope='row'>
                  {agenda.television?.name || '-'}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {agenda.label?.name || '-'}
                </TableCell>
                <TableCell>{dayjs(agenda.startDate.toLocaleString()).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                <TableCell>{dayjs(agenda.endDate.toLocaleString()).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setModalTitle('EDIT')
                      setAgendaToEdit(agenda)
                    }}
                    color='primary'
                    aria-label='edit agenda'
                    component='span'
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setAgendaToDelete(agenda)
                    }}
                    color='primary'
                    aria-label='delete agenda'
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
      {(!!agendaToEdit || isModalCreate) && (
        <AgendaCreateAndEditModal
          title={titleModal}
          agenda={agendaToEdit!}
          handleCloseEditModal={handleCloseEditAgendaModal}
        />
      )}
        {!!agendaToDelete && (
      <AgendaDeleteModal
        isOpen={!!agendaToDelete}
        agenda={agendaToDelete!}
        handleCloseDeleteModal={handleCloseDeleteAgendaModal}
      />
        )}
    </>
  )
}
