import React, { useState, memo } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
// material core
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
// material icon
import AccountCircle from '@material-ui/icons/AccountCircle'
// configs
import { GOOGLE_CONFIGS, USER_ROLE } from '@app/configs'
// actions
import { logout } from 'src/store/auth/auth.action'
import { SessionT } from 'src/store/models/Global'
import { useGoogleLogout } from 'react-google-login'
import { storage } from 'src/utils/general/Storage'

function Account({ ...classes }) {
  const { t: translate } = useTranslation()
  const dispatch = useDispatch()
  const role = USER_ROLE.ADMIN
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const onGoogleLogoutFailure = () => {
    console.log('logout failed')
  }
  const onGoogleLogoutSuccess = () => {
    console.log('============ googleLogout ===============')
    storage.set('session', null)
  }
  const { signOut } = useGoogleLogout({
    onFailure: onGoogleLogoutFailure,
    clientId: GOOGLE_CONFIGS.clientId,
    onLogoutSuccess: onGoogleLogoutSuccess,
  })

  const _handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const _handleClose = () => {
    setAnchorEl(null)
  }

  const _handleLogout = () => {
    const session = storage.get<SessionT>('session')
    if (session?.session.type === 'local') {
      dispatch(logout())
    }
    if (session?.session.type === 'google') {
      signOut()
    }
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        aria-label='account of current user'
        aria-controls='menu-appbar'
        aria-haspopup='true'
        onClick={_handleMenu}
        color='inherit'
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id='menu-appbar'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={_handleClose}
      >
        <div className={classes.textRole}>{role}</div>
        <Divider />
        <MenuItem>My account</MenuItem>
        <MenuItem className={classes.menuProfile} onClick={_handleLogout}>
          {translate('LOGOUT')}
        </MenuItem>
      </Menu>
    </>
  )
}

export default memo(Account)
