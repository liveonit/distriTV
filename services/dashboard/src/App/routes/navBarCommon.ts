// material icon
// import AddIcon from '@material-ui/icons/Add';
import ShopIcon from '@material-ui/icons/Shop';
// import ViewListIcon from '@material-ui/icons/ViewList';
import PeopleIcon from '@material-ui/icons/People';
// import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import DashboardIcon from '@material-ui/icons/Dashboard';
// import AssessmentIcon from '@material-ui/icons/Assessment';
// configs
import { PATH_NAME, DRAWER_MENU_LABEL } from '@app/configs';

export const navBarCommon = [
  {
    subheader: 'Application',
    items: [
      {
        title: 'Report',
        href: PATH_NAME.DASHBOARD,
        icon: DashboardIcon,
        label: DRAWER_MENU_LABEL.DASHBOARD,
      },
    ],
  },
  {
    subheader: 'Dashboard',
    items: [
      {
        title: 'Institutions',
        icon: ShopIcon,
        href: PATH_NAME.INSTITUTION,
        label: DRAWER_MENU_LABEL.INSTITUTIONS,
      },
      {
        title: 'Contents',
        icon: ShopIcon,
        href: PATH_NAME.CONTENT,
        label: DRAWER_MENU_LABEL.CONTENTS,
      },
    ],
  },
  {
    subheader: 'Users',
    items: [
      {
        title: 'Users',
        icon: PeopleIcon,
        href: PATH_NAME.USERS,
        label: DRAWER_MENU_LABEL.USERS,
      },
    ],
  },
];
