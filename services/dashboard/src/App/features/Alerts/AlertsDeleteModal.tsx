import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { AlertT } from 'src/store/alert/alert.type'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { deleteAlert } from 'src/store/alert/alert.action'

type IProps = {
  isOpen: boolean
  handleCloseDeleteModal: () => void
  alert: AlertT
}

let nombreAlert = 0

export default function AlertDeleteModal({ isOpen, handleCloseDeleteModal, alert }: IProps) {
  const dispatch = useDispatch()

  function handleDeleteAlert() {
    dispatch(deleteAlert({ id: alert.id! }))
    handleCloseDeleteModal()
  }

  // TODO: fix the next function
  function alertFieldsValues() {
    if (alert) {
      nombreAlert = alert.contentId
    }
  }
  alertFieldsValues()

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            <Trans>DELETE_WARNING</Trans>
            <Trans>SCHEDULE</Trans> {nombreAlert}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color='primary'>
            <Trans>CLOSE</Trans>
          </Button>
          <Button onClick={handleDeleteAlert} variant='contained' color='primary' size='small'>
            <Trans>DELETE</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
