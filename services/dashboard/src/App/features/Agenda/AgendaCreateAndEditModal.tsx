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
import { Trans, useTranslation } from 'react-i18next'

type IProps = {
  handleCloseEditModal: () => void
  agenda: Partial<AgendaT>
  title: string
}

export default function AgendaCreateAndEditModal({ handleCloseEditModal, agenda, title }: IProps) {
  const { t } = useTranslation()
  const agendaInitialState: AgendaT = {contentId: 0, televisionId: 0, startDate: '', endDate: '',  cron: '', ...removeEmpty(agenda)
  }
  const contents = useSelector(contentSelector)
  const televisions = useSelector(televisionsSelector)

  const methods = useForm<AgendaT>({
    resolver: zodResolver(agendaSchema),
    defaultValues: agendaInitialState,
  })

  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(listContents())
  }, [dispatch])
  React.useEffect(() => {
    dispatch(listTelevisions())
  }, [dispatch])
  
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
              <FormInputDropdown
                fullWidth
                label={t(`CONTENT`)}
                name='contenidoId'
                control={control}
                selectOptions={contents.map((con) => ({ label: con.name, value: con.id! }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label={t(`TELEVISION`)}
                name='televisionId'
                control={control}
                selectOptions={televisions.map((tel) => ({ label: tel.ip, value: tel.id! }))}
              />
            </Grid>
          </Grid>{' '}
          <br />
          <FormInputDate  name='startDate' control={control} label={t(`START_DATE`)} />
          <FormInputDate  name='endDate' control={control} label={t(`END_DATE`)} />
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
          <Button onClick={handleSubmit(onSubmit)} variant='contained' color='primary' size='small'>
            <Trans>SAVE</Trans>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
