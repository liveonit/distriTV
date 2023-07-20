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
import { listUsers } from 'src/store/user/user.action'
import { usersIsLoadingSelector, usersSelector } from 'src/store/user/user.selector'
import { Chip, CircularProgress } from 'node_modules/@mui/material'
import { UserT } from 'src/store/user/user.type'
import { Trans } from 'react-i18next/TransWithoutContext'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

import UserCreateAndEditModal from './UserCreateAndEditModal'
import UserDeleteModal from './UserDeleteModal'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function UserList() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [isModalCreate, setIsModalCreate] = React.useState(false)
  const [userToEdit, setUserToEdit] = React.useState<UserT | null>(null)
  const [userToDelete, setUserToDelete] = React.useState<UserT | null>(null)
  const [titleModal, setModalTitle] = React.useState('Titulo')

  React.useEffect(() => {
    dispatch(listUsers())
  }, [dispatch])

  const isLoading = useSelector(usersIsLoadingSelector)
  const users = useSelector(usersSelector)

  function handleCloseEditUserModal() {
    setUserToEdit(null)
    setIsModalCreate(false)
  }

  function handleCloseDeleteUserModal() {
    setUserToDelete(null)
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid item sm={8}>
          <h2>
            <Trans>USERS</Trans>
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
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans>FIRST_NAME</Trans>
              </TableCell>
              <TableCell>
                <Trans>LAST_NAME</Trans>
              </TableCell>
              <TableCell>
                <Trans>EMAIL</Trans>
              </TableCell>
              <TableCell>Roles (Institution : role) </TableCell>
              <TableCell>Login Type</TableCell>
              <TableCell>
                <Trans>ACTION</Trans>
              </TableCell>
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
                    <Chip key={i} color='info' label={`${user.username} : ${rm.role.name}`} />
                  ))}
                </TableCell>
                <TableCell>{user.loginType}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => setUserToEdit(user)}
                    color='primary'
                    aria-label='edit user'
                    component='span'
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(!!userToEdit || isModalCreate) && (
        <UserCreateAndEditModal title={titleModal} user={userToEdit!} handleCloseEditModal={handleCloseEditUserModal} />
      )}
      {!!userToDelete && (
        <UserDeleteModal
          isOpen={!!userToDelete}
          user={userToDelete!}
          handleCloseDeleteModal={handleCloseDeleteUserModal}
        />
      )}
    </>
  )
}
