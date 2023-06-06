import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { AgendaT } from 'src/store/agenda/agenda.type'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { deleteAgenda } from 'src/store/agenda/agenda.action'

type IProps = {
  isOpen: boolean
  handleCloseDeleteModal: () => void
  agenda: AgendaT
}

let nombreAgenda = 0

export default function AgendaDeleteModal({ isOpen, handleCloseDeleteModal, agenda }: IProps) {
  const dispatch = useDispatch()

  function handleDeleteAgenda() {
    dispatch(deleteAgenda({ id: agenda.id! }))
    handleCloseDeleteModal()
  }

  // TODO: fix the next function
  function agendaFieldsValues() {
    if (agenda) {
      nombreAgenda = agenda.contentId
    }
  }
  agendaFieldsValues()

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            <Trans>DELETE_WARNING</Trans>
            <Trans>SCHEDULE</Trans> {nombreAgenda}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color='primary'>
            <Trans>CLOSE</Trans>
          </Button>
          <Button onClick={handleDeleteAgenda} variant='contained' color='primary' size='small'>
            <Trans>DELETE</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
