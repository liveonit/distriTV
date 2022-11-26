import React, { useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
// material core
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
// material icon
import AccountCircle from '@material-ui/icons/AccountCircle';
// configs
import { USER_ROLE } from '@app/configs';
// actions
import { logout } from '@store/action/auth.action';


function Account({ ...classes }) {
  const { t: translate } = useTranslation();
  const dispatch = useDispatch();
  const role = USER_ROLE.ADMIN;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const _handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const _handleClose = () => {
    setAnchorEl(null);
  };

  const _handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={_handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
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
  );
}

export default memo(Account);
