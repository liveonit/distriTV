import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { InstitutionT } from 'src/store/institution/institution.type'
import { useDispatch } from 'react-redux'
import { deleteInstitution } from 'src/store/institution/institution.action'
import { Trans } from 'react-i18next'

type IProps = {
  isOpen: boolean
  handleCloseDeleteModal: () => void
  institution: InstitutionT
}

export default function InstitutionDeleteModal({ isOpen, handleCloseDeleteModal, institution }: IProps) {
  const dispatch = useDispatch()

  function handleDeleteInstitution() {
    dispatch(deleteInstitution({ id: institution.id! }))
    handleCloseDeleteModal()
  }

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            <Trans>DELETE_WARNING</Trans><Trans>INSTITUTION</Trans> {institution.name} ?
          </Typography>
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color='primary'>
            <Trans>CLOSE</Trans>
          </Button>
          <Button onClick={() => handleDeleteInstitution()} variant='contained' color='primary' size='small'>
            <Trans>DELETE</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
