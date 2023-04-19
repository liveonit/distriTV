import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { institutionSchema, InstitutionT } from 'src/store/institution/institution.type'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CITIES } from 'src/utils/constants/Cities'
import { FormInputText } from 'src/App/components/molecules/Forms/FormInputText'
import { FormInputDropdown } from 'src/App/components/molecules/Forms/FormInputDropdown'
import { removeEmpty } from 'src/utils/removeEmpty'
import { useDispatch } from 'react-redux'
import { createInstitution, updateInstitution } from 'src/store/institution/institution.action'
import { Trans, useTranslation } from 'react-i18next'

type IProps = {
  handleCloseEditModal: () => void
  institution: Partial<InstitutionT>
  title: string
}

export default function InstitutionCreateAndEditModal({ handleCloseEditModal, institution, title }: IProps) {
  const institutionInitialState: InstitutionT = { name: '', city: '', locality: '', ...removeEmpty(institution) }

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const methods = useForm<InstitutionT>({
    resolver: zodResolver(institutionSchema),
    defaultValues: institutionInitialState,
  })

  const { reset, handleSubmit, control } = methods

  const onSubmit: SubmitHandler<InstitutionT> = (data) => {
    if (!institution) dispatch(createInstitution(data))
    else dispatch(updateInstitution(data))
    handleCloseEditModal()
  }
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
              <FormInputText name='name' control={control} fullWidth label={t(`NAME`)} variant='outlined' />
            </Grid>
            <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label={t(`CITY`)}
                name='city'
                control={control}
                selectOptions={CITIES.map((dep) => ({ label: dep, value: dep }))}
              />
            </Grid>
          </Grid>{' '}
          <br />
          <Grid item xs={12}>
            <FormInputText fullWidth label={t(`LOCALITY`)} variant='outlined' name='locality' control={control} />
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
