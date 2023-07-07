import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { LabelT } from 'src/store/label/label.type'
import { Trans } from 'react-i18next'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'

type IProps = {
  isOpen: boolean
  handleListTelevisionsModal: () => void
  label: LabelT
}

const useStyles = makeStyles({
  table: {
    minWidth: 150,
  },
})

export default function LabelDeleteModal({ isOpen, handleListTelevisionsModal, label}: IProps) {
  const classes = useStyles()

  return (
    
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>              
            <Trans>TELEVISIONS</Trans> - {label.name} 
          </Typography>
          <br />
          
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>            
                </TableRow>
              </TableHead>
              <TableBody>
                {label.tvs.map((tv) => (
                  <TableRow key={tv?.id}>
                    <TableCell>{tv?.name}</TableCell>                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleListTelevisionsModal} color='primary'>
            <Trans>CLOSE</Trans>
          </Button>        
        </DialogActions>
      </Dialog>
    </>
  )
}
