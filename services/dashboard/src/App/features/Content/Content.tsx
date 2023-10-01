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
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgress } from 'node_modules/@mui/material'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { listContents } from 'src/store/content/content.action'
import { contentIsLoadingSelector, contentSelector } from 'src/store/content/content.selector'
import AddIcon from '@material-ui/icons/Add'
import {  UpdateContentBodyType } from 'validation/entities/Content'
import { Trans } from 'react-i18next/TransWithoutContext'
import { SearchBox } from 'src/App/components/molecules/Search/SearchBox'
import { useSearchQueryString } from 'src/App/hooks/useSearchQueryString'
import { useTranslation } from 'react-i18next'
import Link from '@material-ui/core/Link'
import { OndemandVideo } from '@material-ui/icons'
import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import ContentDeleteModal from './ContentDeleteModal'
import CreateAndEditContentModal from './CreateAndEditContentModal'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
})

export default function ContentList() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const searchQueryString = useSearchQueryString()
  const { t } = useTranslation()

  React.useEffect(() => {
    dispatch(
      listContents({
        query: searchQueryString ? `search=${searchQueryString}` : '',
      }),
    )
  }, [dispatch, searchQueryString])

  const [isModalCreate, setIsModalCreate] = React.useState(false)
  const isLoading = useSelector(contentIsLoadingSelector)
  const contents = useSelector(contentSelector)
  const [contentToEdit, setContentToEdit] = React.useState<UpdateContentBodyType | null>(null)
  const [contentToDelete, setContentToDelete] = React.useState<UpdateContentBodyType | null>(null)

  function handleCloseEditContentModal() {
    setContentToEdit(null)
    setIsModalCreate(false)
  }
  function handleCloseDeleteContentModal() {
    setContentToDelete(null)
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container alignItems='center'>
        <Grid item sm={8}>
          <h2><Trans>CONTENTS</Trans></h2>
        </Grid>
        <Grid item sm={4} container justifyContent='flex-end'>
          <Button
            variant='contained'
            color='primary'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => setIsModalCreate(true)}
          >
            <Trans>NEW</Trans>
          </Button>
        </Grid>
      </Grid>
      <SearchBox
        searches={[
          { type: 'Input', name: 'name', placeholder: t('NAME') },
          { type: 'Select', name: 'type', placeholder: t('TYPE'), options: ['Video', 'Text', 'Image'] },
        ]}
      />
      <br/>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell><Trans>NAME</Trans></TableCell>
              <TableCell><Trans>TYPE</Trans></TableCell>
              <TableCell><Trans>URL</Trans></TableCell>
              <TableCell><Trans>ACTION</Trans></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contents.map((content) => (
              <TableRow key={content.id}>
                <TableCell component='th' scope='row'>
                  {content.name}
                </TableCell>
                <TableCell>
                  {content.type.toLowerCase().includes('video') && (<OndemandVideo></OndemandVideo>)}
                  {content.type.toLowerCase().includes('image') && (<ImageIcon></ImageIcon>)}
                  {content.type.toLowerCase().includes('text') && (<TextSnippetIcon></TextSnippetIcon>)}
                </TableCell>
                <TableCell><Link href={content.url}>{content.url}</Link></TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      console.log(content)
                      setContentToEdit(content)

                    }}
                    color='primary'
                    aria-label='edit content'
                    component='span'
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setContentToDelete(content)
                    }}
                    color='primary'
                    aria-label='delete content'
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
      {(!!contentToEdit ||isModalCreate ) && (
          <CreateAndEditContentModal
            handleCloseContentModal={handleCloseEditContentModal}
            content={contentToEdit!}
          />
        )}
      {!!contentToDelete && (
        <ContentDeleteModal
          isOpen={!!contentToDelete}
          content={contentToDelete!}
          handleCloseDeleteModal={handleCloseDeleteContentModal}
        />
      )}
    </>
  )
}
