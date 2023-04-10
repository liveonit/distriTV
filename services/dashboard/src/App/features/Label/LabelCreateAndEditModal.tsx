import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { labelSchema, LabelT } from 'src/store/label/label.type'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInputText } from 'src/App/components/molecules/Forms/FormInputText'
import { removeEmpty } from 'src/utils/removeEmpty'

type IProps = {
  handleCloseEditModal: () => void
  label: Partial<LabelT>
  title: string
}

export default function LabelCreateAndEditModal({ handleCloseEditModal, label, title }: IProps) {
  const labelInitialState: LabelT = { name: '', city: '', locality: '', ...removeEmpty(label) }

  const methods = useForm<LabelT>({
    resolver: zodResolver(labelSchema),
    defaultValues: labelInitialState,
  })

  const { reset, handleSubmit, control } = methods

  const onSubmit: SubmitHandler<LabelT> = (data) => console.log(data)
  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={true} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h6' color='textPrimary'>
            {title}
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInputText name='name' control={control} fullWidth label='Nombre' variant='outlined' />
            </Grid>
            
          </Grid>{' '}
          <br />
          <Grid item xs={12}>
            <FormInputText fullWidth label='Descripcion' variant='outlined' name='description' control={control} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              reset()
              handleCloseEditModal()
            }}
            color='primary'
          >
            Cerrar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant='contained' color='primary' size='small'>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
