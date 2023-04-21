import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { TelevisionT } from 'src/store/television/television.type'
import { useDispatch } from 'react-redux'
import { deleteTelevision } from 'src/store/television/television.action'
import { Trans } from 'react-i18next'

type IProps = {
  isOpen: boolean
  handleCloseDeleteModal: () => void
  television: TelevisionT
}


export default function InstitutionDeleteModal({ isOpen, handleCloseDeleteModal, television}: IProps) {
  const dispatch = useDispatch()
  function handleDeleteTelevision() {
    dispatch(deleteTelevision({ id: television.id! }))
    handleCloseDeleteModal()
  }
  

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            <Trans>DELETE_WARNING</Trans><Trans>TELEVISION</Trans> {television.ip} ?
          </Typography>
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color='primary'>
            <Trans>CLOSE</Trans>
          </Button>
          <Button onClick={() => handleDeleteTelevision()}
            variant='contained' color='primary' size='small'>
            <Trans>DELETE</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
