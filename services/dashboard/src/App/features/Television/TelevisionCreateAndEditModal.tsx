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
import { FormInputText } from 'src/App/components/molecules/Forms/FormInputText'
import { removeEmpty } from 'src/utils/removeEmpty'
import RefreshIcon from '@material-ui/icons/Refresh'
import { createTelevision, updateTelevision } from 'src/store/television/television.action'
import { useDispatch } from 'react-redux'
import { FormInputDropdown } from 'src/App/components/molecules/Forms/FormInputDropdown'
import { useSelector } from 'react-redux'
import { institutionsSelector } from 'src/store/institution/institutions.selector'
import { listInstitutions } from 'src/store/institution/institution.action'
import { Trans, useTranslation } from 'react-i18next'
import { listLabels } from 'src/store/label/label.action'
import { labelsSelector } from 'src/store/label/label.selector'
import { FormInputDropdownMulti } from 'src/App/components/molecules/Forms/FormInputDropdownMulti'
import { LabelT } from 'src/store/label/label.type'

type IProps = {
  handleCloseEditModal: () => void
  television: Partial<TelevisionT>
  title: string
}

export default function TelevisionCreateAndEditModal({ handleCloseEditModal, television, title }: IProps) {
  type FormStateT = TelevisionT & { labels: number[] }

  const televisionInitialState: FormStateT = {
    id: 0,
    name: '',
    ip: '',
    mac: '',
    tvCode: Math.random().toString(36).slice(2, 8),
    ...removeEmpty(television),
    labels: television?.labels?.map((label: LabelT) => label.id!) || [],
  }

  const methods = useForm<FormStateT>({
    resolver: zodResolver(televisionSchema),
    defaultValues: televisionInitialState,
  })
  const { reset, handleSubmit, setValue, control } = methods

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const institutions = useSelector(institutionsSelector)
  const labels = useSelector(labelsSelector)

  React.useEffect(() => {
    dispatch(listInstitutions())
    dispatch(listLabels())
  }, [dispatch])

  const onSubmit: SubmitHandler<FormStateT> = (data) => {
    const parsedData = data.labels ? { ...data, m2mRelations: { labels: data.labels } } : data
    if (!television) dispatch(createTelevision(parsedData))
    else dispatch(updateTelevision(parsedData))
    handleCloseEditModal()
  }
  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={true} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            {t(title)} {t('TELEVISION')}
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInputText fullWidth label='TV Name' variant='outlined' name='name' control={control} />
            </Grid>
            <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label={t('INSTITUTION')}
                name='institutionId'
                control={control}
                selectOptions={institutions.map((ins) => ({ label: ins.name, value: ins.id! }))}
              />
            </Grid>

            <Grid item xs={12}>
              <FormInputText name='ip' control={control} fullWidth label={t('IP')} variant='outlined' />
            </Grid>
          </Grid>{' '}
          <br />
          <Grid item xs={12}>
            <FormInputText fullWidth label={t('MAC')} variant='outlined' name='mac' control={control} />
          </Grid>
          <br />
          <Grid item xs={12}>
            <FormInputDropdownMulti
              fullWidth
              label={t('LABEL')}
              name='labels'
              control={control}
              selectOptions={labels.map((lab) => ({ label: lab.name, value: lab.id! }))}
            />
          </Grid>
          <>
            <br />
            <Grid container>
              <Grid item></Grid>
              <Grid item alignItems='stretch' style={{ display: 'flex' }}>
                <FormInputText disabled name='tvCode' control={control} fullWidth label={t('TV_CODE')} variant='outlined' />
                {(!television) && (
                  <Button
                    startIcon={<RefreshIcon />}
                    color='primary'
                    onClick={() => setValue('tvCode', Math.random().toString(36).slice(2, 8))}
                  />
                )}
              </Grid>
            </Grid>{' '}
          </>
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
          <Button
            onClick={() => {
              handleSubmit(onSubmit)()
            }}
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


