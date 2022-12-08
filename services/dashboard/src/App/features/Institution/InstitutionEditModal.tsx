import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { InstitutionT } from 'src/store/models/Global'

type IProps = {
  isOpen: boolean
  handleCloseEditModal: () => void
  institution: InstitutionT
  handleSaveInstitution: (institution: InstitutionT) => void
}

export default function InstitutionEditModal({ isOpen, handleCloseEditModal, institution, handleSaveInstitution }: IProps) {
  const [localInstitution] = React.useState(institution)
  return (
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h6' color='textPrimary'>
            Edit institution
          </Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth id='title' label='Title' variant='outlined' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth id='author' label='Author' variant='outlined' />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='demo-simple-select-outlined-label'>Severity</InputLabel>
                <Select
                  fullWidth
                  labelId='demo-simple-select-outlined-label'
                  id='demo-simple-select-outlined'
                  label='Severity'
                  value='low'
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value='low'>Low</MenuItem>
                  <MenuItem value='medium'>Medium</MenuItem>
                  <MenuItem value='high'>High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box mt={2}>
            <Typography variant='subtitle1' color='textPrimary'>
              Description
            </Typography>
            <TextField multiline rows={6} fullWidth variant='outlined' placeholder='Leave a message' />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color='primary'>
            Close
          </Button>
          <Button onClick={() => handleSaveInstitution(localInstitution)} variant='contained' color='primary' size='small'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
