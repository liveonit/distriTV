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
import DeleteIcon from '@material-ui/icons/Delete'
import { Trans } from 'react-i18next/TransWithoutContext'
import { SearchBox } from 'src/App/components/molecules/Search/SearchBox'
import { useSearchQueryString } from 'src/App/hooks/useSearchQueryString'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next'
import { Cancel, FormatListBulleted } from '@material-ui/icons'

import TelevisionCreateAndEditModal from './TelevisionCreateAndEditModal'
import TelevisionDeleteModal from './TelevisionDeleteModal'
import TelevisionModalListLabels from './TelevisionModalListLabels'
import TelevisionStatusModal from './TelevisionStatusModal'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function TelevisionList() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const isLoading = useSelector(televisionsIsLoadingSelector)
  const televisions = useSelector(televisionsSelector)
  const [isModalCreate, setIsModalCreate] = React.useState(false)
  const [reload, setReload] = React.useState(0)
  const [televisionToEdit, setTelevisionToEdit] = React.useState<TelevisionT | null>(null)
  const [televisionToDelete, setTelevisionToDelete] = React.useState<TelevisionT | null>(null)
  const [televisionToStatus, setTelevisionToStatus] = React.useState<TelevisionT | null>(null)
  const [listLabels, setListLabels] = React.useState<TelevisionT | null>(null)
  const [titleModal, setModalTitle] = React.useState('Titulo')
  const searchQueryString = useSearchQueryString()
  const { t } = useTranslation()

  React.useEffect(() => {
    const pepe = setInterval(() => setReload(reload + 1), 2 * 60 * 1000);    
    return () => clearInterval(pepe)
  }, [reload]);

  React.useEffect(() => {
    dispatch(
      listTelevisionsJoin({
        query: searchQueryString ? `search=${searchQueryString}` : '',
      }),
    )
  }, [dispatch, searchQueryString, reload])

  function handleCloseEditTelevisionModal() {
    setTelevisionToEdit(null)
    setTelevisionToStatus(null)
    setIsModalCreate(false)
  }

  function handleCloseDeleteTelevisionModal() {
    setTelevisionToDelete(null)
  }

  function handleCloseStatusTelevisionModal() {
    setTelevisionToStatus(null)
    
  }

  function handleListLabelsModal() {
    setListLabels(null)
  }

  function checkTvStatus (tv: TelevisionT) {
    if (!tv.monitor.currentDate)
      return false
          
    const now = new Date();
    const differenceInMilliseconds : number = now.getTime() - new Date(tv.monitor.currentDate.split('.')[0]).getTime();
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    return differenceInMinutes < 5;
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid item sm={8}>
          <h2>
            <Trans>TELEVISIONS</Trans>
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
          { type: 'Input', name: 'tvCode', placeholder: t('TV_CODE') },
          { type: 'Input', name: 'name', placeholder: t('NAME') },
        ]}
      />
      <br />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>
                <Trans>CODE</Trans>
              </TableCell>
              <TableCell>
                <Trans>NAME</Trans>
              </TableCell>
              <TableCell>
                <Trans>IP</Trans>
              </TableCell>
              <TableCell>
                <Trans>MAC</Trans>
              </TableCell>
              <TableCell>
                <Trans>INSTITUTION</Trans>
              </TableCell>
              <TableCell>
                <Trans>LABELS</Trans>
              </TableCell>
              <TableCell>
                <Trans>STATUS</Trans>
              </TableCell>
              <TableCell>
                <Trans>ACTION</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {televisions.map((television) => (
              <TableRow key={television.id}>
                <TableCell component='th' scope='row'>
                  {television.id}
                </TableCell>
                <TableCell>{television.tvCode}</TableCell>
                <TableCell>{television.name}</TableCell>
                <TableCell>{television.ip}</TableCell>
                <TableCell>{television.mac}</TableCell>
                <TableCell>{television?.institution?.name}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setModalTitle(television.name)
                      setListLabels(television)
                    }}
                    color='primary'
                    aria-label='edit label'
                    component='span'
                  >
                    <FormatListBulleted color='primary'/>
                  </IconButton>
                </TableCell>
                <TableCell>
                <IconButton
                    onClick={() => {
                      setModalTitle('Estado')
                      setTelevisionToStatus(television)
                    }}
                    color='primary'
                    aria-label='STATUS television'
                    component='span'
                  >
                    {checkTvStatus(television) ? (<CheckCircleIcon />) : (<Cancel color="error"/> )}  
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setModalTitle('EDIT')
                      setTelevisionToEdit(television)
                    }}
                    color='primary'
                    aria-label='edit television'
                    component='span'
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setTelevisionToDelete(television)
                    }}
                    color='primary'
                    aria-label='delete television'
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
      {(!!televisionToEdit || isModalCreate) && (
        <TelevisionCreateAndEditModal
          title={titleModal}
          television={televisionToEdit!}
          handleCloseEditModal={handleCloseEditTelevisionModal}
        />
      )}
      {!!televisionToDelete && (
        <TelevisionDeleteModal
          isOpen={!!televisionToDelete}
          television={televisionToDelete!}
          handleCloseDeleteModal={handleCloseDeleteTelevisionModal}
        />
      )}
      {!!listLabels && (
        <TelevisionModalListLabels
          isOpen={!!listLabels}
          tv={listLabels!}
          handleListLabelsModal={handleListLabelsModal}
        />
      )}
       {!!televisionToStatus && (
        <TelevisionStatusModal
          isOpen={!!televisionToStatus}
          tv={televisionToStatus!}
          handleCloseStatusTelevisionModal={handleCloseStatusTelevisionModal}
        />
      )}
    </>
  )
}
