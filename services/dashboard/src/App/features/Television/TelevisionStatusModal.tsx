import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { Trans } from 'react-i18next'
import { Box, Paper, styled } from '@material-ui/core'
import { TelevisionT } from 'src/store/television/television.type'
import { Grid } from '@mui/material'
import MemoryIcon from '@mui/icons-material/Memory';

type IProps = {
  isOpen: boolean
  handleCloseStatusTelevisionModal: () => void
  tv: TelevisionT
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));



export default function TelevisionModalListLabels({ isOpen, handleCloseStatusTelevisionModal, tv}: IProps) {
  

  return (
    
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>              
            <Trans>STATUS</Trans> - {tv.name} 
          </Typography>
          <br />
          <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <Item> <MemoryIcon></MemoryIcon>1 memoria </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>2</Item>
            </Grid>
            <Grid item xs={6}>
              <Item>3</Item>
            </Grid>
            <Grid item xs={6}>
              <Item>4</Item>
            </Grid>
            <Grid item xs={6}>
              <Item>5</Item>
            </Grid>
            <Grid item xs={6}>
              <Item>6</Item>
            </Grid>
        </Grid>
       </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusTelevisionModal} color='primary'>
            <Trans>CLOSE</Trans>
          </Button>        
        </DialogActions>
      </Dialog>
    </>
  )
}
