import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { Trans } from 'react-i18next'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { TelevisionT } from 'src/store/television/television.type'

type IProps = {
  isOpen: boolean
  handleCloseStatusTelevisionModal: () => void
  tv: TelevisionT
}

const useStyles = makeStyles({
  table: {
    minWidth: 150,
  },
})

export default function TelevisionModalListLabels({ isOpen, handleCloseStatusTelevisionModal, tv}: IProps) {
  const classes = useStyles()

  return (
    
    <>
      <Dialog fullWidth maxWidth='sm' open={isOpen} aria-labelledby='max-width-dialog-title'>
        <DialogContent>
          <Typography variant='h4' color='textPrimary'>              
            <Trans>STATUS</Trans> - {tv.name} 
          </Typography>
          <br />
          
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(tv.monitor!).map((monitorField) => (
                  <TableRow key={monitorField}>
                    <TableCell><Trans>{monitorField}</Trans></TableCell>
                    <TableCell>{String(tv.monitor![monitorField])}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
       
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
