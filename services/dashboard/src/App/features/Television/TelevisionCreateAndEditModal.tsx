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
  const institutions = useSelector(institutionsSelector)
  const dispatch = useDispatch() 
  const { t } = useTranslation()
  const { reset, handleSubmit, setValue, control } = methods

  React.useEffect(() => {
    dispatch(listInstitutions())
  }, [dispatch])

  const onSubmit: SubmitHandler<TelevisionT> = (data) => {
    if (!television) dispatch(createTelevision(data))
    else dispatch(updateTelevision(data))
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
              <FormInputDropdown
                fullWidth
                label={t('INSTITUTION')}
                name='institutionId'
                control={control}
                selectOptions={institutions.map((ins) => ({ label: ins.name, value: ins.id! }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInputText name='IP' control={control} fullWidth label={t('IP')} variant='outlined' />
            </Grid>
          </Grid>{' '}
          <br/>
          <Grid item xs={12}>
            <FormInputText fullWidth label={t('MAC')} variant='outlined' name='mac' control={control} />
          </Grid>
          {!television &&
           <><br/>             
              <Grid container>
              <Grid item>
              </Grid>
              <Grid item alignItems="stretch" style={{ display: 'flex' }}>
              <FormInputText name='tvCode' control={control} fullWidth label={t('TV_CODE')} variant='outlined' />
              <Button startIcon={<RefreshIcon />} color="primary" onClick={() => setValue('tvCode', Math.random().toString(36).slice(2, 8))} />
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
