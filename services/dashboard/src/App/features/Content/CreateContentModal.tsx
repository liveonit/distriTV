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
import { FormInputDropdown } from 'src/App/components/molecules/Forms/FormInputDropdown'
import { SubmitHandler, useForm } from 'react-hook-form'
import { contentSchema, ContentT } from 'src/store/content/content.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { removeEmpty } from 'src/utils/removeEmpty'
//import { createContent } from 'src/store/content/content.action'
import { FormInputText } from 'src/App/components/molecules/Forms/FormInputText'

type IProps = {
  isOpen: boolean
  handleCloseContentModal: () => void
  content: Partial<ContentT>
}
const contentType = ['Video', 'Imagen', 'Texto']

export default function CreateContentModal({ isOpen, handleCloseContentModal, content }: IProps) {
  const [name, setName] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)
  const [fileError, setFileError] = React.useState('')
  const [uploadingFile, setUploadingFile] = React.useState(false)
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length && acceptedFiles.length > 1) setFileError('At least and only one file should be selected')
    setFile(acceptedFiles[0])
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1 })
  const contentInitialState: ContentT = { name: '', type: '', url: '', text: '', ...removeEmpty(content)}
  const dispatch = useDispatch()

  const methods = useForm<ContentT>({
    resolver: zodResolver(contentSchema),
    defaultValues: contentInitialState,
  })
  const { reset, handleSubmit, control, getValues } = methods
  
  const onSubmit: SubmitHandler<ContentT> = (data) => {
   
    handleCloseContentModal()
  }
  
  

  const handleSave = async () => {
    console.log(getValues().type)
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
    handleCloseContentModal()
  }
  console.log(uploadingFile)

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            Create content
          </Typography>
          <br />
          <Grid container spacing={2}>
          <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label='Tipo de Contenido'
                name='type'
                control={control}
                selectOptions={contentType.map((tp) => ({ label: tp, value: tp }))}
              />
            </Grid>
          {getValues().type == 'Imagen' &&
           <Grid item xs={12}>
           <FormInputText name='duration' control={control} fullWidth label='Duración' variant='outlined' />
         </Grid>
          }
           {getValues().type == 'Texto' &&
           <Grid item xs={12}>
           <Box display='flex' flexDirection={'column'} style={{ alignItems: 'center', justifyContent: 'center' }}>
           <FormInputText name='text' control={control} fullWidth label='Mensaje a mostrar' variant='outlined' style={{ width: '150px', height: '150px', marginTop: '10px' }}/>
           </Box>
         </Grid>
          }
          
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
          {getValues().type != 'Texto' &&
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
        }
        </DialogContent>
        <DialogActions>
          <Button  onClick={() => {
              reset()
              handleCloseContentModal()
            }} color='primary'>
            Close
          </Button>
          <Button
            onClick={
              () => file && handleSave()
              
            }
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
