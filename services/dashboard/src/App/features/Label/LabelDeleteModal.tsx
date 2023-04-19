import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { LabelT } from 'src/store/label/label.type'
import { useDispatch } from 'react-redux'
import { deleteLabel } from 'src/store/label/label.action'
import { Trans, /*useTranslation*/ } from 'react-i18next'

type IProps = {
  isOpen: boolean
  handleCloseDeleteModal: () => void
  label: LabelT
}

export default function LabelDeleteModal({ isOpen, handleCloseDeleteModal, label}: IProps) {
  // const { t } = useTranslation()
  const dispatch = useDispatch()
  function handleDeleteLabel() {
    dispatch(deleteLabel({ id: label.id! }))
    handleCloseDeleteModal()
  }

  return (
    
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>              
            <Trans>DELETE_WARNING</Trans><Trans>LABEL</Trans> {label.name} ?
          </Typography>
          <br />
          
       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color='primary'>
            <Trans>CLOSE</Trans>
          </Button>
          <Button onClick={

            () => handleDeleteLabel()
            
          }
            variant='contained' color='primary' size='small'>
            <Trans>DELETE</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
