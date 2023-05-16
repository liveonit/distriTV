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
import { TelevisionT, televisionSchema } from 'src/store/television/television.type'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import { Trans } from 'react-i18next/TransWithoutContext'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod/dist/zod'
import { t } from 'i18next'
import TelevisionCreateAndEditModal from './TelevisionCreateAndEditModal'
import TelevisionDeleteModal from './TelevisionDeleteModal'
import { FormInputText } from 'src/App/components/molecules/Forms/FormInputText'
import { FormInputDropdown } from 'src/App/components/molecules/Forms/FormInputDropdown'
import { institutionsSelector } from 'src/store/institution/institutions.selector'
import { listInstitutions } from 'src/store/institution/institution.action'
import { FindInPage } from '@material-ui/icons'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function TelevisionList() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const televisionInitialState: Partial<TelevisionT> = {
    name: '',
    ip: '',
    mac: '',
    tvCode: '',
  }


  const methods = useForm<Partial<TelevisionT>>({
    resolver: zodResolver(televisionSchema),
    defaultValues: televisionInitialState,
  })

  const { handleSubmit, control } = methods

  React.useEffect(() => {
    dispatch(listTelevisionsJoin())
    dispatch(listInstitutions())
  }, [dispatch])
  
  const isLoading = useSelector(televisionsIsLoadingSelector)
  const televisions = useSelector(televisionsSelector)
  const institutions = useSelector(institutionsSelector)
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

  const onSubmit: SubmitHandler<Partial<TelevisionT>> = (data) => {
    dispatch(listTelevisionsJoin(data))    
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
      <Grid container spacing={2}>      
        <Grid item xs={2}>
          <FormInputText name='tvCode' control={control} fullWidth label={t('CODE')} variant='outlined'  />
        </Grid>
        <Grid item xs={2}>
          <FormInputText name='name' control={control} fullWidth label={t('NAME')} variant='outlined'  />            
        </Grid>
        <Grid item xs={2} alignItems='stretch' style={{ display: 'flex' }}>
          <FormInputDropdown
            fullWidth
            label={t('INSTITUTION')}
            name='institutionId'
            control={control}
            selectOptions={institutions.map((ins) => ({ label: ins.name, value: ins.id! }))}
          /> 
          <Button onClick={handleSubmit(onSubmit)} variant='contained' color='primary' size='small' startIcon={<FindInPage/>}/>  
        </Grid>
      </Grid>
      <br/>
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
    </>
  )
}
