import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { UserT } from 'src/store/user/user.type'
import { useDispatch } from 'react-redux'
import { deleteUser } from 'src/store/user/user.action'
import { Trans } from 'react-i18next'

type IProps = {
  isOpen: boolean
  handleCloseDeleteModal: () => void
  user: UserT
}

export default function UserDeleteModal({ isOpen, handleCloseDeleteModal, user }: IProps) {
  const dispatch = useDispatch()

  function handleDeleteUser() {
    dispatch(deleteUser({ id: user.id! }))
    handleCloseDeleteModal()
  }

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            <Trans>DELETE_WARNING</Trans>
            <Trans>USER</Trans> {user.username} ?
          </Typography>
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color='primary'>
            <Trans>CLOSE</Trans>
          </Button>
          <Button onClick={() => handleDeleteUser()} variant='contained' color='primary' size='small'>
            <Trans>DELETE</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
