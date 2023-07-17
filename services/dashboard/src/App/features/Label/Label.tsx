import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import { useDispatch, useSelector } from 'react-redux'
import { labelsIsLoadingSelector, labelsSelector } from 'src/store/label/label.selector'
import { CircularProgress } from 'node_modules/@mui/material'
import Button from '@material-ui/core/Button'
import { listLabels } from 'src/store/label/label.action'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import { Trans } from 'react-i18next/TransWithoutContext'
import { SearchBox } from 'src/App/components/molecules/Search/SearchBox'
import { useSearchQueryString } from 'src/App/hooks/useSearchQueryString'
import { LabelT } from 'src/store/label/label.type'
import { useTranslation } from 'react-i18next'
import { FormatListBulleted } from '@material-ui/icons'

import LabelCreateAndEditModal from './LabelCreateAndEditModal'
import LabelDeleteModal from './LabelDeleteModal'
import LabelModalListTelevisions from './LabelModalListTelevisions'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function LabelList() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const searchQueryString = useSearchQueryString()
  const { t } = useTranslation()

  React.useEffect(() => {
    dispatch(
      listLabels({
        query: searchQueryString ? `search=${searchQueryString}` : '',
      }),
    )
  }, [dispatch, searchQueryString])

  const isLoading = useSelector(labelsIsLoadingSelector)
  const labels = useSelector(labelsSelector)
  const [isModalCreate, setIsModalCreate] = React.useState(false)
  const [labelToEdit, setLabelToEdit] = React.useState<LabelT | null>(null)
  const [listTelevisions, setListTelevisions] = React.useState<LabelT | null>(null)
  const [labelToDelete, setLabelToDelete] = React.useState<LabelT | null>(null)
  const [titleModal, setModalTitle] = React.useState('Titulo')

  function handleCloseEditLabelModal() {
    setLabelToEdit(null)
    setIsModalCreate(false)
    setListTelevisions(null)
  }

  function handleCloseDeleteLabelModal() {
    setLabelToDelete(null)
  }

  function handleListTelevisionsModal() {
    setListTelevisions(null)
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid item sm={8}>
          <h2><Trans>LABELS</Trans></h2>
        </Grid>
        <Grid item sm={4} container justifyContent='flex-end'>
          <Button
            variant='contained'
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => {
              setModalTitle('CREATE')
              setIsModalCreate(true)
            }}
          >
            <Trans>NEW</Trans>
          </Button>
        </Grid>
      </Grid>
      <SearchBox
        searches={[
          { type: 'Input', name: 'name', placeholder: t('NAME') },
          { type: 'Input', name: 'description', placeholder: t('DESCRIPTION') },
        ]}
      />
      <br/>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell><Trans>NAME</Trans></TableCell>            
              <TableCell><Trans>DESCRIPTION</Trans></TableCell>
              <TableCell><Trans>TELEVISIONS</Trans></TableCell>
              <TableCell><Trans>ACTION</Trans></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labels.map((label) => (
              <TableRow key={label.id}>
                <TableCell>{label.name}</TableCell>
                <TableCell>{label.description}</TableCell>
                <TableCell>
                <IconButton
                    onClick={() => {
                      setModalTitle(label.name)
                      setListTelevisions(label)
                    }}
                    color='primary'
                    aria-label='edit label'
                    component='span'
                  >
                    <FormatListBulleted color='primary'/>
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setModalTitle('EDIT')
                      setLabelToEdit(label)
                    }}
                    color='primary'
                    aria-label='edit label'
                    component='span'
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setLabelToDelete(label)
                    }}
                    color='primary'
                    aria-label='delete label'
                    component='span'
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(!!labelToEdit || isModalCreate) && (
        <LabelCreateAndEditModal
          title={titleModal}
          label={labelToEdit!}
          handleCloseEditModal={handleCloseEditLabelModal}
        />
      )}
      {!!labelToDelete && (
        <LabelDeleteModal
          isOpen={!!labelToDelete}
          label={labelToDelete!}
          handleCloseDeleteModal={handleCloseDeleteLabelModal}
        />
      )}
      {!!listTelevisions && (
        <LabelModalListTelevisions
          isOpen={!!listTelevisions}
          label={listTelevisions!}
          handleListTelevisionsModal={handleListTelevisionsModal}
        />
      )}
    </>
  )
}
