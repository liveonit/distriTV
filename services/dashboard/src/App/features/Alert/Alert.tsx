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
import { useDispatch, useSelector } from 'react-redux'
import { alertsIsLoadingSelector, alertsSelector } from 'src/store/alert/alert.selector'
import { CircularProgress } from 'node_modules/@mui/material'
import Button from '@material-ui/core/Button'
import { listAlerts } from 'src/store/alert/alert.action'
import { AlertT } from 'src/store/alert/alert.type'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import { Trans } from 'react-i18next/TransWithoutContext'

import AlertCreateAndEditModal from './AlertsCreateAndEditModal'
import AlertDeleteModal from './AlertsDeleteModal'
import { SearchBox } from 'src/App/components/molecules/Search/SearchBox'
import { useSearchQueryString } from 'src/App/hooks/useSearchQueryString'
import { useTranslation } from 'react-i18next'
import { labelsSelector } from 'src/store/label/label.selector'
import { listLabels } from 'src/store/label/label.action'
import { televisionsSelector } from 'src/store/television/television.selector'
import { listTelevisions } from 'src/store/television/television.action'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function AlertList() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const searchQueryString = useSearchQueryString()
  const { t } = useTranslation()

  React.useEffect(() => {
    dispatch(listLabels())
    dispatch(listTelevisions())
    dispatch(
      listAlerts({
        query: searchQueryString ? `search=${searchQueryString}` : '',
      }),
    )
  }, [dispatch, searchQueryString])

  const isLoading = useSelector(alertsIsLoadingSelector)
  const alerts = useSelector(alertsSelector)
  const labels = useSelector(labelsSelector)
  const televisions = useSelector(televisionsSelector)
  const [isModalCreate, setIsModalCreate] = React.useState(false)
  const [alertToEdit, setAlertToEdit] = React.useState<AlertT | null>(null)
  const [alertToDelete, setAlertToDelete] = React.useState<AlertT | null>(null)
  const [titleModal, setModalTitle] = React.useState('Titulo')

  function handleCloseEditAlertModal() {
    setAlertToEdit(null)
    setIsModalCreate(false)
  }

  function handleCloseDeleteAlertModal() {
    setAlertToDelete(null)
  }
  
  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid item sm={8}>
          <h2>
            <Trans>ALERTS</Trans>
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
                <Trans>MESSAGE_TO_SHOW</Trans>
              </TableCell>
              <TableCell>
                <Trans>DURATION</Trans>
              </TableCell>
              <TableCell>
                <Trans>TELEVISION</Trans>
              </TableCell>
              <TableCell>
                <Trans>LABEL</Trans>
              </TableCell>
              <TableCell>
                <Trans>ACTION</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell component='th' scope='row'>
                  {alert.text}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {alert.duration}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {alert.television?.name || '-'}
                </TableCell>
                <TableCell component='th' scope='row'>
                  {alert.labelId || '-'}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setAlertToDelete(alert)
                    }}
                    color='primary'
                    aria-label='delete alert'
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
      {(!!alertToEdit || isModalCreate) && (
        <AlertCreateAndEditModal
          title={titleModal}
          alert={alertToEdit!}
          handleCloseEditModal={handleCloseEditAlertModal}
        />
      )}
      <AlertDeleteModal
        isOpen={!!alertToDelete}
        alert={alertToDelete!}
        handleCloseDeleteModal={handleCloseDeleteAlertModal}
      />
    </>
  )
}
