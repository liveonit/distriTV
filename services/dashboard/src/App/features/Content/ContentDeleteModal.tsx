import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { ContentT } from 'src/store/content/content.type'
import { useDispatch } from 'react-redux'
import { deleteContent } from 'src/store/content/content.action'
import { Trans } from 'react-i18next'

type IProps = {
  isOpen: boolean
  handleCloseDeleteModal: () => void
  content: ContentT
}

export default function ContentDeleteModal({ isOpen, handleCloseDeleteModal, content }: IProps) {
  const dispatch = useDispatch()

  function handleDeleteContent() {
    dispatch(deleteContent({ id: content.id! }))
    handleCloseDeleteModal()
  }

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            <Trans>DELETE_WARNING</Trans><Trans>CONTENT</Trans> {content.name} ?
          </Typography>
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color='primary'>
            <Trans>CLOSE</Trans>
          </Button>
          <Button onClick={() => handleDeleteContent()} variant='contained' color='primary' size='small'>
            <Trans>DELETE</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
