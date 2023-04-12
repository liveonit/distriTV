import React, { useCallback } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { uploadContent } from 'src/store/content/content.action'
import { useDispatch } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { Box } from '@mui/material'
// matrial icon
import CloudUpload from '@material-ui/icons/CloudUpload'
import CloudDone from '@material-ui/icons/CloudDone'

type IProps = {
  isOpen: boolean
  handleCloseEditModal: () => void
}

export default function CreateContentModal({ isOpen, handleCloseEditModal }: IProps) {
  const [name, setName] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)
  const [fileError, setFileError] = React.useState('')
  const [uploadingFile, setUploadingFile] = React.useState(false)
  const dispatch = useDispatch()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length && acceptedFiles.length > 1) setFileError('At least and only one file should be selected')
    setFile(acceptedFiles[0])
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1 })

  const handleSave = async () => {
    if (file) {
      setUploadingFile(true)
      dispatch(
        uploadContent({
          name,
          type: file.type,
          file,
        }),
      )
    }
    setName('')
    setFile(null)
    handleCloseEditModal()
  }
  console.log(uploadingFile)

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

          <div {...getRootProps()} style={{ height: '150px', border: '1px solid', marginTop: '15px' }}>
            <input {...getInputProps()} />
            <Box display='flex' flexDirection={'column'} style={{ alignItems: 'center', justifyContent: 'center' }}>
              {!file ? (
                <>
                  <CloudUpload style={{ width: '50px', height: '50px', marginTop: '10px' }} />
                  <Typography variant='h6' color='textPrimary'>
                    Drop the files here or click to open the browser...
                  </Typography>
                </>
              ): <>
              <CloudDone style={{ width: '50px', height: '50px', marginTop: '10px' }} />
                  <Typography variant='h6' color='textPrimary'>
                    Loaded filename: "{file.name}"
                    <br/>
                    File successfully loaded, click here to change the file or drop a new one
                  </Typography>
              </>}
            </Box>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color='primary'>
            Close
          </Button>
          <Button
            onClick={() => file && handleSave()}
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
