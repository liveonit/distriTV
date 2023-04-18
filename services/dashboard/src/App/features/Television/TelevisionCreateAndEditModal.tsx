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
import { FormInputDropdownCheck } from 'src/App/components/molecules/Forms/FormInputDropdownCheck'
import { useSelector } from 'react-redux'
import { institutionsSelector } from 'src/store/institution/institutions.selector'
import { listInstitutions } from 'src/store/institution/institution.action'
import { labelsSelector } from 'src/store/label/label.selector'
import { listLabels } from 'src/store/label/label.action'

type IProps = {
  handleCloseEditModal: () => void
  television: Partial<TelevisionT>
  title: string
}

export default function TelevisionCreateAndEditModal({ handleCloseEditModal, television, title }: IProps) {
  const televisionInitialState: TelevisionT = { id: 0, name:'', ip: '', mac: '', label: [], ...removeEmpty(television) }

  const methods = useForm<TelevisionT>({
    resolver: zodResolver(televisionSchema),
    defaultValues: televisionInitialState,
  })
  const institutions = useSelector(institutionsSelector)
  const labels = useSelector(labelsSelector)

  const dispatch = useDispatch() 
  const { reset, handleSubmit, setValue, control } = methods

  React.useEffect(() => {
    dispatch(listInstitutions())
  }, [dispatch])

  React.useEffect(() => {
    dispatch(listLabels())
  }, [dispatch])

  const onSubmit: SubmitHandler<TelevisionT> = (data) => {
    if (!television) dispatch(createTelevision(data))
    else dispatch(updateTelevision(data))
    handleCloseEditModal()
    console.log(data.label)
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
            <FormInputText fullWidth label='TV Name' variant='outlined' name='name' control={control} />
          </Grid>
          <Grid item xs={12}>
              <FormInputDropdown
                fullWidth
                label='Institution'
                name='institutionId'
                control={control}
                selectOptions={institutions.map((ins) => ({ label: ins.name, value: ins.id! }))}
              />
            </Grid>
           
            <Grid item xs={12}>
              <FormInputText name='ip' control={control} fullWidth label='IP' variant='outlined' />
            </Grid>
          </Grid>{' '}
          <br/>
          <Grid item xs={12}>
            <FormInputText fullWidth label='MAC' variant='outlined' name='mac' control={control} />
          </Grid>
          <Grid item xs={12}>
              <FormInputDropdownCheck
                fullWidth
                label='Labels'
                name='label'
                control={control}
                multiple selectOptions={labels.map((lab) => ({ label: lab.name, value: lab.id?.toString()!!}))}
              />
            </Grid>
          {!television &&
           <><br/>             
              <Grid container>
              <Grid item>
              </Grid>
              <Grid item alignItems="stretch" style={{ display: 'flex' }}>
              <FormInputText name='tvCode' control={control} fullWidth label='TV Code' variant='outlined' />
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
            Close
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant='contained' color='primary' size='small'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
