import React, { useCallback, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createContent, uploadContent } from 'src/store/content/content.action'
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
import { FormHelperText } from '@material-ui/core'
import { Trans, useTranslation } from 'react-i18next'
import { FormInputNumber } from 'src/App/components/molecules/Forms/FormInputNumber'

type IProps = {
  isOpen: boolean
  handleCloseContentModal: () => void
  content: Partial<ContentT>
}
const contentType = ['Video', 'Image', 'Text']

export default function CreateAndEditContentModal({ isOpen, handleCloseContentModal, content }: IProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [fileError, setFileError] = React.useState('')
  const contentInitialState: ContentT = {
    name: '',
    duration: 5,
    type: 'Video',
    url: '',
    text: '',
    ...removeEmpty(content),
  }
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0])
      setFileError('')
    }
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1 })

  const methods = useForm<ContentT>({
    resolver: zodResolver(contentSchema),
    defaultValues: contentInitialState,
  })
  const { reset, control, watch, getValues, handleSubmit, register } = methods

  const onSubmit: SubmitHandler<ContentT> = (data) => {
    if ((data.type === 'Image' || data.type === 'Video') && file) {
      const renamedFile = new File([file], data.name)
      dispatch(
        uploadContent({
          name: data.name,
          type: file.type,
          file: renamedFile,
        }),
      )
    }
    if (data.type === 'Text') {
      dispatch(createContent(data))
    }
    setFile(null)
    handleCloseContentModal()
  }

  useEffect(() => setFileError(''), [watch('type')])

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            {content ? 'Edit' : 'Create'} content
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label={t('TYPE')}
                name='type'
                control={control}
                selectOptions={contentType.map((tp) => ({ label: tp, value: tp }))}
              />
            </Grid>
            {(watch('type') === 'Image' || watch('type') === 'Text') && (
              <Grid item xs={12}>
                <FormInputNumber
                  type='number'
                  name='duration'
                  control={control}
                  register={register}
                  label='Duration'
                  variant='outlined'
                  fullWidth
                ></FormInputNumber>
              </Grid>
            )}
            {watch('type') === 'Text' && (
              <Grid item xs={12}>
                <Box display='flex' flexDirection={'column'} style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <FormInputText name='text' control={control} fullWidth label='Message to show' variant='outlined' />
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <FormInputText name='name' control={control} fullWidth label={t('NAME')} variant='outlined' />
            </Grid>
          </Grid>
          {watch('type') !== 'Text' && (
            <div
              {...getRootProps()}
              style={{
                height: '150px',
                border: '1px solid',
                marginTop: '15px',
                borderRadius: '5px',
                ...(fileError && { borderColor: 'red' }),
              }}
            >
              <input {...getInputProps()} />
              <Box display='flex' flexDirection={'column'} style={{ alignItems: 'center', justifyContent: 'center' }}>
                {!file ? (
                  <>
                    <CloudUpload style={{ width: '50px', height: '50px', marginTop: '10px' }} />
                    <Typography variant='h6' color='textPrimary'>
                      Drop the files here or click to open the browser...
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloudDone style={{ width: '50px', height: '50px', marginTop: '10px' }} />
                    <Typography variant='h6' color='textPrimary'>
                      Loaded filename: "{file.name}"
                      <br />
                      File successfully loaded, click here to change the file or drop a new one
                    </Typography>
                  </>
                )}
                {fileError && <FormHelperText error={true}>{fileError}</FormHelperText>}
              </Box>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              reset()
              handleCloseContentModal()
            }}
            color='primary'
          >
            <Trans>CLOSE</Trans>
          </Button>
          <Button
            onClick={() => {
              handleSubmit(onSubmit)()
              if ((getValues().type === 'Image' || getValues().type === 'Video') && !file) {
                setFileError('File is required when content type is Image or Video')
              }
            }}
            disabled={!!fileError.length}
            variant='contained'
            color='primary'
            size='small'
          >
            <Trans>SAVE</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
