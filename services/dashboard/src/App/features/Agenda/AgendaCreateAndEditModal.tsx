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
import { FormInputDropdown } from 'src/App/components/molecules/Forms/FormInputDropdown'
import { FormInputDate } from 'src/App/components/molecules/Forms/FormInputDate'
import { removeEmpty } from 'src/utils/removeEmpty'
import { contentSelector } from 'src/store/content/content.selector'
import { useDispatch, useSelector } from 'react-redux'
import { listContents } from 'src/store/content/content.action'
import { listTelevisions } from 'src/store/television/television.action'
import { televisionsSelector } from 'src/store/television/television.selector'
import { FormInputText } from 'src/App/components/molecules/Forms/FormInputText'
import { listLabels } from 'src/store/label/label.action'
import { createAgenda, updateAgenda } from 'src/store/agenda/agenda.action'
import { labelsSelector } from 'src/store/label/label.selector'
import { Trans, useTranslation } from 'react-i18next'


type IProps = {
  handleCloseEditModal: () => void
  agenda: Partial<AgendaT>
  title: string
}

export default function AgendaCreateAndEditModal({ handleCloseEditModal, agenda, title }: IProps) {
  const agendaInitialState: AgendaT = {televisionId: undefined, labelId: undefined, startDate: new Date(), endDate: new Date(),...removeEmpty(agenda)
  }
  const contents = useSelector(contentSelector)
  const televisions = useSelector(televisionsSelector)
  const labels = useSelector(labelsSelector)
  const methods = useForm<AgendaT>({
    resolver: zodResolver(agendaSchema),
    defaultValues: agendaInitialState,
  })
  const tipos = ['Etiqueta','Televisión']

  const { t } = useTranslation()
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(listContents())
  }, [dispatch])
  React.useEffect(() => {
    dispatch(listTelevisions())
  }, [dispatch])
  React.useEffect(() => {
    dispatch(listLabels())
  }, [dispatch])
  const { reset, handleSubmit, watch, control } = methods

  const onSubmit: SubmitHandler<AgendaT> = (data) => {
    console.log(data)
    if (!agenda) {
      dispatch(createAgenda(data))
    }
    else {
      dispatch(updateAgenda(data))
    }
    handleCloseEditModal()
  }

  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={true} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            {t(title)} {t('SCHEDULE')}
          </Typography>
          <br />
          <Grid container spacing={2}>
          <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label={t('CONTENT')}
                name='contentId'
                control={control}
                selectOptions={contents.map((con) => ({ label: con.name, value: con.id! }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label={t('TYPE_OF_AGENDA')}
                name='type'
                control={control}
                selectOptions={tipos.map((tip) => ({ label: tip, value: tip }))}
              />
            </Grid>
          {watch('type') === 'Televisión' &&
            <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label={t('TELEVISION')}
                name='televisionId'
                control={control}
                selectOptions={televisions.map((tel) => ({ label: tel.ip, value: tel.id! }))}
              />
            </Grid>}
            {watch('type') === 'Etiqueta' &&
            <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label={t('LABEL')}
                name='labelId'
                control={control}
                selectOptions={labels.map((lab) => ({ label: lab.name, value: lab.id! }))}
              />
            </Grid>}
          </Grid>{' '}
          <br />
          <FormInputDate  name='startDate' control={control} label={t('START_DATE')} />
          <FormInputDate  name='endDate' control={control} label={t('END_DATE')} />
          <FormInputText name='cron' control={control} fullWidth label={t('CRONTAB')} variant='outlined' />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              reset()
              handleCloseEditModal()
            }}
            color='primary'
          >
            <Trans>CLOSE</Trans>
          </Button>
          <Button onClick={handleSubmit(onSubmit)}
            variant='contained' color='primary' size='small'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
