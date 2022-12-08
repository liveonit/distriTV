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
import { institutionsIsLoadingSelector, institutionsSelector } from 'src/store/institution/institutions.selector'
import { CircularProgress } from 'node_modules/@mui/material'
import { listInstitutions } from 'src/store/institution/institution.action'
import { InstitutionT } from 'src/store/institution/institution.type'

import InstitutionEditModal from './InstitutionEditModal'


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

  const [institutionToEdit, setInstitutionToEdit] = React.useState<InstitutionT | null>(null)

  function handleCloseEditInstitutionModal() {
    setInstitutionToEdit(null)
  }

  function handleSaveEditedInstitution() {
    //TODO: Save institution
    setInstitutionToEdit(null)
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid sm={8}>
          <h2>Institution</h2>
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
                  <IconButton color='primary' aria-label='edit institution' component='span'>
                    <EditIcon onClick={() => setInstitutionToEdit(institution)} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <InstitutionEditModal
        isOpen={!!institutionToEdit}
        institution={institutionToEdit!}
        handleCloseEditModal={handleCloseEditInstitutionModal}
        handleSaveInstitution={handleSaveEditedInstitution}
      />
    </>
  )
}
