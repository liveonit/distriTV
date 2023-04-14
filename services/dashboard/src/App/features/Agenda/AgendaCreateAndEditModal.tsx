import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { agendaSchema, AgendaT } from 'src/store/agenda/agenda.type'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CITIES } from 'src/utils/constants/Cities'
import { FormInputText } from 'src/App/components/molecules/Forms/FormInputText'
import { FormInputDropdown } from 'src/App/components/molecules/Forms/FormInputDropdown'
import { FormInputDate } from 'src/App/components/molecules/Forms/FormInputDate'
import { removeEmpty } from 'src/utils/removeEmpty'

type IProps = {
  handleCloseEditModal: () => void
  agenda: Partial<AgendaT>
  title: string
}

export default function AgendaCreateAndEditModal({ handleCloseEditModal, agenda, title }: IProps) {
  const agendaInitialState: AgendaT = {contentId: 0, televisionId: 0, startDate: '', endDate: '',  cron: '', ...removeEmpty(agenda)
  }

  const methods = useForm<AgendaT>({
    resolver: zodResolver(agendaSchema),
    defaultValues: agendaInitialState,
  })

  const { reset, handleSubmit, control } = methods

  const onSubmit: SubmitHandler<AgendaT> = (data) => console.log(data)
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
          <br />
          <Grid item xs={12}>
            <FormInputText fullWidth label='Localidad' variant='outlined' name='locality' control={control} />
          </Grid>
          <FormInputDate  name='startDate' control={control} label='Fecha de inicio' />
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