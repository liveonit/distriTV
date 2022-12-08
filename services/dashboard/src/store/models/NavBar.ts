type Irems = {
  title?: string;
  icon?: React.ReactNode;
  href?: string;
  depth?: number;
};

type IStyle = {
  paddingLeft: number;
};

export type ChildNavBar = Irems & {
  items?: Irems[];
  pathname: string;
  label?: string;
};

export type NavBarCommon = {
  subheader?: string;
  items: ChildNavBar[];
};

export type NavBarItem = {
  depth: number;
  icon: any;
  title: string;
  open?: boolean;
  href: string;
  label?: string;
  isExternalLink: boolean;
  children?: any;
};

export type NavBarExpandItem = {
  icon: any;
  title: string;
  open?: boolean;
  children?: any;
  style: IStyle;
};
