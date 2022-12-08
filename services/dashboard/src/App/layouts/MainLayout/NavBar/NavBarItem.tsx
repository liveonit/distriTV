import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
// material core
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import Link from '@material-ui/core/Link';
// types
import { canAction } from '@app/helpers';
// components
import { NavBarItem } from 'src/store/models/NavBar';

import NavBarExpandItem from './NavBarExpandItem';
// styles
import useStyles from './styles';

const NavBarItem: FC<NavBarItem> = ({
  depth,
  icon: Icon,
  title,
  open: openProp,
  href,
  label,
  isExternalLink = false,
  children,
}) => {
  const navigate = useNavigate()
  const classes = useStyles();

  let paddingLeft = 24;
  if (depth > 0) {
    paddingLeft = 40 + 8 * depth;
  }

  const style = { paddingLeft };

  if (children) {
    return (
      <NavBarExpandItem title={title} icon={Icon} open={openProp} style={style}>
        {children}
      </NavBarExpandItem>
    );
  }

  return (
    <ListItem className={clsx(classes.itemLeaf)} disableGutters key={title}>
      {canAction('view', label || '') ? (
        <>
          {isExternalLink ? (
            <Link href={href} target="_blank" style={style} className={clsx(classes.buttonLeaf, `depth-${depth}`)}>
              {Icon && <Icon className={classes.icon} size="20" />}
              <span className={classes.title}>{title}</span>
            </Link>
          ) : (
            <Button
              // activeClassName={classes.active}
              className={clsx(classes.buttonLeaf, `depth-${depth}`)}
              onClick={() => navigate(href)}
              style={style}
            >
              {Icon && <Icon className={classes.icon} size="20" />}
              <span className={classes.title}>{title}</span>
            </Button>
          )}
        </>
      ) : null}
    </ListItem>
  );
};

export default NavBarItem;
