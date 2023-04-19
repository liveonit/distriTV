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
import { createLabel, updateLabel } from 'src/store/label/label.action'
import { useDispatch } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'

type IProps = {
  handleCloseEditModal: () => void
  label: Partial<LabelT>
  title: string
}

export default function LabelCreateAndEditModal({ handleCloseEditModal, label, title }: IProps) {
  const labelInitialState: LabelT = { id:0,  name: '', description: '', ...removeEmpty(label) }

  const methods = useForm<LabelT>({
    resolver: zodResolver(labelSchema),
    defaultValues: labelInitialState,
  })

  const { reset, handleSubmit, control } = methods
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const onSubmit: SubmitHandler<LabelT> = (data) => {
    if (!label) dispatch(createLabel(data))
    else dispatch(updateLabel(data))
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
            
          </Grid>{' '}
          <br />
          <Grid item xs={12}>
            <FormInputText fullWidth label={t(`DESCRIPTION`)} variant='outlined' name='description' control={control} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              reset()
              handleCloseEditModal()
            }}
            color='primary' size='small'
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
