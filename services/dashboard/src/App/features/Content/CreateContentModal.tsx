import React, { ChangeEventHandler } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import { createContent } from 'src/store/content/content.action'
import { useDispatch } from 'react-redux'

type IProps = {
  isOpen: boolean
  handleCloseEditModal: () => void
}

export default function CreateContentModal({ isOpen, handleCloseEditModal }: IProps) {
  const [name, setName] = React.useState('')
  const [files, setFiles] = React.useState<FileList | null>(null)
  const [fileError, setFileError] = React.useState('')
  const [uploadingFile, setUploadingFile] = React.useState(false)
  const dispatch = useDispatch()

  const handleFilesChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.files?.length && event.target.files?.length > 1)
      setFileError('At least and only one file should be selected')
    setFiles(event.target.files)
  }

  const handleSave = async () => {
    if (files?.length && files?.length === 1) {
      setUploadingFile(true)
      const formData = new FormData()
      formData.append('file', files[0], files[0].name)
      const result = await axios.post('/api/v1/content/upload', formData)
      if (result.status === 200) {
        dispatch(createContent({ name, url: `${window.location.protocol}//${window.location.host}/api/v1/content/download/${files[0].name}`, type: files[0].type }))
      }
    }
    setName('')
    setFiles(null)
    handleCloseEditModal()
  }
  console.log(uploadingFile);

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h6' color='textPrimary'>
            Edit content
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                fullWidth
                id='file'
                label='Filename'
                variant='outlined'
              />
            </Grid>
          </Grid>

          <input type='file' onChange={handleFilesChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color='primary'>
            Close
          </Button>
          <Button
            onClick={() => files && handleSave()}
            disabled={!!fileError.length}
            variant='contained'
            color='primary'
            size='small'
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
