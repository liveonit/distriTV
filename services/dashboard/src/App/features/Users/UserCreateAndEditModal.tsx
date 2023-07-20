import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createUserSchema, CreateUserT, RolesE, updateUserSchema, UpdateUserT, UserT } from 'src/store/user/user.type'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInputText } from 'src/App/components/molecules/Forms/FormInputText'
import { removeEmpty } from 'src/utils/removeEmpty'
import { useDispatch, useSelector } from 'react-redux'
import { createUser, updateUser } from 'src/store/user/user.action'
import { Trans, useTranslation } from 'react-i18next'
import { FormInputPassword } from 'src/App/components/molecules/Forms/FormInputPassword'
import { institutionsSelector } from 'src/store/institution/institutions.selector'
import { listInstitutions } from 'src/store/institution/institution.action'
import { FormInputDropdown } from 'src/App/components/molecules/Forms/FormInputDropdown'

type IProps = {
  handleCloseEditModal: () => void
  user: Partial<UserT>
  title: string
}

export default function UserCreateAndEditModal({ handleCloseEditModal, user, title }: IProps) {
  const userInitialState: UserT = { ...removeEmpty(user) }

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const methods = useForm<CreateUserT | UpdateUserT>({
    resolver: zodResolver(!user ? createUserSchema : updateUserSchema),
    defaultValues: userInitialState,
  })

  const {
    reset,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = methods
  console.log({ user, userInitialState, values: getValues(), errors })

  const institutions = useSelector(institutionsSelector)

  React.useEffect(() => {
    dispatch(listInstitutions())
  }, [dispatch])

  const onSubmit: SubmitHandler<CreateUserT | UpdateUserT> = (data) => {
    const parsedData = {
      ...data,
      m2mRelations: [{ roleMappings: [{ roleName: data.roleName, institutionId: +data.institutionId }] }],
    }
    if (!user) dispatch(createUser(parsedData as CreateUserT))
    else dispatch(updateUser(parsedData as UpdateUserT))
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
              <FormInputText
                name='username'
                disabled={user.loginType !== 'local'}
                control={control}
                fullWidth
                label={t('USER_NAME')}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <FormInputPassword
                name='password'
                disabled={user.loginType !== 'local'}
                control={control}
                fullWidth
                label={t('PASSWORD')}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <FormInputText
                name='email'
                disabled={user.loginType !== 'local'}
                control={control}
                fullWidth
                label={t('EMAIL')}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <FormInputText
                name='firstName'
                disabled={user.loginType !== 'local'}
                control={control}
                fullWidth
                label={t('FIRST_NAME')}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <FormInputText
                name='lastName'
                disabled={user.loginType !== 'local'}
                control={control}
                fullWidth
                label={t('LAST_NAME')}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label={t('ROLE')}
                name='roleName'
                control={control}
                selectOptions={Object.entries(RolesE).map(([key, value]) => ({ label: key, value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label={t('INSTITUTION')}
                name='institutionId'
                control={control}
                selectOptions={institutions.map((inst) => ({ label: inst.name, value: inst.id! }))}
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
