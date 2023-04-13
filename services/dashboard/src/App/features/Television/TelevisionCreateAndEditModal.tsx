import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { televisionSchema, TelevisionT } from 'src/store/television/television.type'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CITIES } from 'src/utils/constants/Cities'
import { FormInputText } from 'src/App/components/molecules/Forms/FormInputText'
import { FormInputDropdown } from 'src/App/components/molecules/Forms/FormInputDropdown'
import { removeEmpty } from 'src/utils/removeEmpty'
import RefreshIcon from '@material-ui/icons/Refresh'

type IProps = {
  handleCloseEditModal: () => void
  television: Partial<TelevisionT>
  title: string
}

export default function TelevisionCreateAndEditModal({ handleCloseEditModal, television, title }: IProps) {
  const televisionInitialState: TelevisionT = { id: 0, ip: '', mac: '', ...removeEmpty(television) }

  const methods = useForm<TelevisionT>({
    resolver: zodResolver(televisionSchema),
    defaultValues: televisionInitialState,
  })

  const { reset, handleSubmit, control } = methods

  const onSubmit: SubmitHandler<TelevisionT> = (data) => console.log(data)
  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={true} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            {title}
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInputText name='name' control={control} fullWidth label='Nombre' variant='outlined' />
            </Grid>
            <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label='Departamento'
                name='city'
                control={control}
                selectOptions={CITIES.map((dep) => ({ label: dep, value: dep }))}
              />
            </Grid>
          </Grid>{' '}
          <br/>
          <Grid item xs={12}>
            <FormInputText fullWidth label='Localidad' variant='outlined' name='locality' control={control} />
          </Grid>
          {!television &&
           <><br/>             
              <Grid container>
              <Grid item>
              <FormInputText fullWidth label='Código TV' variant='outlined' name='locality' value="666666" control={control} /> 
              </Grid>
              <Grid item alignItems="stretch" style={{ display: 'flex' }}>

              <Button startIcon={<RefreshIcon />} color="primary" onClick={() => console.log(Math.random().toString(36).slice(2, 8))} />
              </Grid>
              </Grid> </>
          }
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
