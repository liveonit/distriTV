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
import { listUsers } from 'src/store/action/user.action'
import { usersIsLoadingSelector, usersSelector } from 'src/store/selectors/users.selector'
import { Chip, CircularProgress } from 'node_modules/@mui/material'
import { UserT } from 'src/store/models/Global'

import UserEditModal from './UserEditModal'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function UserList() {
  const classes = useStyles()
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(listUsers())
  }, [dispatch])

  const isLoading = useSelector(usersIsLoadingSelector)
  const users = useSelector(usersSelector)

  const [userToEdit, setUserToEdit] = React.useState<UserT | null>(null)

  function handleCloseEditUserModal() {
    setUserToEdit(null)
  }

  function handleSaveEditedUser() {
    //TODO: Save user
    setUserToEdit(null)
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid sm={8}>
          <h2>User</h2>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles (Institution : role) </TableCell>
              <TableCell>Login Type</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell component='th' scope='row'>
                  {user.firstName}
                </TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.roleMappings.map((rm, i) => (
                    <Chip key={i} color='info' label={`${rm.institution.name} : ${rm.role.name}`} />
                  ))}
                </TableCell>
                <TableCell>{user.loginType}</TableCell>
                <TableCell>
                  <IconButton color='primary' aria-label='edit user' component='span'>
                    <EditIcon onClick={() => setUserToEdit(user)} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UserEditModal
        isOpen={!!userToEdit}
        user={userToEdit!}
        handleCloseEditModal={handleCloseEditUserModal}
        handleSaveUser={handleSaveEditedUser}
      />
    </>
  )
}
