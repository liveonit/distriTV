import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { RolesE, userSchema, UserT } from 'src/store/user/user.type'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInputText } from 'src/App/components/molecules/Forms/FormInputText'
import { removeEmpty } from 'src/utils/removeEmpty'
import { useDispatch } from 'react-redux'
import { createUser, updateUser } from 'src/store/user/user.action'
import { Trans, useTranslation } from 'react-i18next'
import { FormInputPassword } from 'src/App/components/molecules/Forms/FormInputPassword'
import { FormInputDropdownMulti } from 'src/App/components/molecules/Forms/FormInputDropdownMulti'

type IProps = {
  handleCloseEditModal: () => void
  user: Partial<UserT>
  title: string
}

export default function UserCreateAndEditModal({ handleCloseEditModal, user, title }: IProps) {
  const userInitialState: UserT = { name: '', city: '', locality: '', ...removeEmpty(user) }

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const methods = useForm<UserT>({
    resolver: zodResolver(userSchema),
    defaultValues: userInitialState,
  })

  const { reset, handleSubmit, control } = methods

  const onSubmit: SubmitHandler<UserT> = (data) => {
    if (!user) dispatch(createUser(data))
    else dispatch(updateUser(data))
    handleCloseEditModal()
  }
  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={true} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>
            {t(title)} {t('USERS')}
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInputText name='username' control={control} fullWidth label={t('USER_NAME')} variant='outlined' />
            </Grid>
            <Grid item xs={12}>
              <FormInputPassword name='password' control={control} fullWidth label={t('PASSWORD')} variant='outlined' />
            </Grid>
            <Grid item xs={12}>
              <FormInputText name='firstName' control={control} fullWidth label={t('FIRST_NAME')} variant='outlined' />
            </Grid>
            <Grid item xs={12}>
              <FormInputText name='lastName' control={control} fullWidth label={t('LAST_NAME')} variant='outlined' />
            </Grid>
            <Grid item xs={12}>
              <FormInputDropdownMulti
                fullWidth
                label={t('ROLE')}
                name='role'
                control={control}
                selectOptions={Object.entries(RolesE).map(([key, value]) => ({ label: key, value }))}
              />
            </Grid>
          </Grid>{' '}
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
