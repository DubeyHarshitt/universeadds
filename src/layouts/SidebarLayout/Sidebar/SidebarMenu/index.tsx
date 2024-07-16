import { useContext, useEffect, useState } from 'react';

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem,
  Grid,
  Typography,
  InputLabel
} from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';
import { SidebarContext } from 'src/contexts/SidebarContext';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import MmsTwoToneIcon from '@mui/icons-material/MmsTwoTone';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import BallotTwoToneIcon from '@mui/icons-material/BallotTwoTone';
import BeachAccessTwoToneIcon from '@mui/icons-material/BeachAccessTwoTone';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import FilterVintageTwoToneIcon from '@mui/icons-material/FilterVintageTwoTone';
import HowToVoteTwoToneIcon from '@mui/icons-material/HowToVoteTwoTone';
import LocalPharmacyTwoToneIcon from '@mui/icons-material/LocalPharmacyTwoTone';
import RedeemTwoToneIcon from '@mui/icons-material/RedeemTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import TrafficTwoToneIcon from '@mui/icons-material/TrafficTwoTone';
import CheckBoxTwoToneIcon from '@mui/icons-material/CheckBoxTwoTone';
import ChromeReaderModeTwoToneIcon from '@mui/icons-material/ChromeReaderModeTwoTone';
import WorkspacePremiumTwoToneIcon from '@mui/icons-material/WorkspacePremiumTwoTone';
import CameraFrontTwoToneIcon from '@mui/icons-material/CameraFrontTwoTone';
import DisplaySettingsTwoToneIcon from '@mui/icons-material/DisplaySettingsTwoTone';
import InfoIcon from '@mui/icons-material/Info';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
    'transform',
    'opacity'
  ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);
  const [showChildren, setShowChildren] = useState<Boolean>(true);

  const closeChildren = () => {
    // closeSidebar()
    setShowChildren(!showChildren);
  }

  const [openParentIndex, setOpenParentIndex] = useState(new Map());

  const toggleChildren = (parentIndex) => {

    const newMenuList = new Map(openParentIndex)
    newMenuList.set(parentIndex, !openParentIndex.get(parentIndex))
    setOpenParentIndex(newMenuList)
  };

  const menuItems = [
    {
      header: 'Dashboards',
      items: [
        {
          to: '/dashboards/messaging',
          label: 'Messaging',
          icon: <BrightnessLowTwoToneIcon />,
          children: [
            {
              to: '/dashboards/messaging/new-sender',
              label: 'Register New Sender',
              icon: <InboxIcon />
            },
            {
              to: '/dashboards/messaging/send-message',
              label: 'Send Message',
              icon: <SendIcon />
            }
            // Add more children as needed
          ]
        },
        {
          to: '/dashboards/designing',
          label: 'Designer',
          icon: <MmsTwoToneIcon />,
          children: [
            {
              to: '/dashboards/messaging/inbox',
              label: 'Inbox',
              icon: <InboxIcon />
            },
            {
              to: '/dashboards/messaging/sent',
              label: 'Sent Items',
              icon: <SendIcon />
            }
            // Add more children as needed
          ]
        },
        {
          to: '/dashboards/finance',
          label: 'Finance',
          icon: <ReceiptLongIcon />,
          // children: [
          //   {
          //     to: '/dashboards/finance/in',
          //     label: 'In(Employee)',
          //     icon: <InfoIcon />
          //   },
          //   {
          //     to: '/dashboards/finance/out',
          //     label: 'Out(Student)',
          //     icon: <InfoIcon />
          //   }
          //   // Add more children as needed
          // ]
        }
      ]
    },
    {
      header: 'Management',
      items: [
        {
          to: '/management/transactions',
          label: 'Transactions List',
          icon: <TableChartTwoToneIcon />
        }
      ]
    }
    // {
    //   header: 'Accounts',
    //   items: [
    //     {
    //       to: '/management/profile/details',
    //       label: 'User Profile',
    //       icon: <AccountCircleTwoToneIcon />
    //     },
    //     {
    //       to: '/management/profile/settings',
    //       label: 'Account Settings',
    //       icon: <DisplaySettingsTwoToneIcon />
    //     }
    //   ]
    // },
    // {
    //   header: 'Extra Pages',
    //   items: [
    //     {
    //       to: '/status/404',
    //       label: 'Error 404',
    //       icon: <CheckBoxTwoToneIcon />
    //     },
    //     {
    //       to: '/status/500',
    //       label: 'Error 500',
    //       icon: <CameraFrontTwoToneIcon />
    //     },
    //     {
    //       to: '/status/coming-soon',
    //       label: 'Coming Soon',
    //       icon: <ChromeReaderModeTwoToneIcon />
    //     },
    //     {
    //       to: '/status/maintenance',
    //       label: 'Maintenance',
    //       icon: <WorkspacePremiumTwoToneIcon />
    //     }
    //   ]
    // },
    // {
    //   header: 'Components',
    //   items: [
    //     {
    //       to: '/components/buttons',
    //       label: 'Buttons',
    //       icon: <BallotTwoToneIcon />
    //     },
    //     {
    //       to: '/components/modals',
    //       label: 'Modals',
    //       icon: <BeachAccessTwoToneIcon />
    //     },
    //     {
    //       to: '/components/accordions',
    //       label: 'Accordions',
    //       icon: <EmojiEventsTwoToneIcon />
    //     },
    //     {
    //       to: '/components/tabs',
    //       label: 'Tabs',
    //       icon: <FilterVintageTwoToneIcon />
    //     },
    //     {
    //       to: '/components/badges',
    //       label: 'Badges',
    //       icon: <HowToVoteTwoToneIcon />
    //     },
    //     {
    //       to: '/components/tooltips',
    //       label: 'Tooltips',
    //       icon: <LocalPharmacyTwoToneIcon />
    //     },
    //     {
    //       to: '/components/avatars',
    //       label: 'Avatars',
    //       icon: <RedeemTwoToneIcon />
    //     },
    //     {
    //       to: '/components/cards',
    //       label: 'Cards',
    //       icon: <SettingsTwoToneIcon />
    //     },
    //     {
    //       to: '/components/forms',
    //       label: 'Forms',
    //       icon: <TrafficTwoToneIcon />
    //     }
    //   ]
    // }

    // Add more sections as needed
  ];

  useEffect(() => {
    let menuList = []
    menuItems.map((data) => data.items.map((ele) => menuList.push(ele)))
    const newMap = new Map();
    menuList.map((data) => { newMap.set(data.label, false) });
  }, [menuItems])
  return (
    <>
      {/* <MenuWrapper>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/"
                  startIcon={<DesignServicesTwoToneIcon />}
                >
                  Overview
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Dashboards
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/dashboards/crypto"
                  startIcon={<BrightnessLowTwoToneIcon />}
                >
                  Messaging
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/dashboards/messenger"
                  startIcon={<MmsTwoToneIcon />}
                >
                  Messenger
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Management
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/transactions"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Transactions List
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Accounts
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/profile/details"
                  startIcon={<AccountCircleTwoToneIcon />}
                >
                  User Profile
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/profile/settings"
                  startIcon={<DisplaySettingsTwoToneIcon />}
                >
                  Account Settings
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Components
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/components/buttons"
                  startIcon={<BallotTwoToneIcon />}
                >
                  Buttons
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/components/modals"
                  startIcon={<BeachAccessTwoToneIcon />}
                >
                  Modals
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/components/accordions"
                  startIcon={<EmojiEventsTwoToneIcon />}
                >
                  Accordions
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/components/tabs"
                  startIcon={<FilterVintageTwoToneIcon />}
                >
                  Tabs
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/components/badges"
                  startIcon={<HowToVoteTwoToneIcon />}
                >
                  Badges
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/components/tooltips"
                  startIcon={<LocalPharmacyTwoToneIcon />}
                >
                  Tooltips
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/components/avatars"
                  startIcon={<RedeemTwoToneIcon />}
                >
                  Avatars
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/components/cards"
                  startIcon={<SettingsTwoToneIcon />}
                >
                  Cards
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/components/forms"
                  startIcon={<TrafficTwoToneIcon />}
                >
                  Forms
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Extra Pages
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/status/404"
                  startIcon={<CheckBoxTwoToneIcon />}
                >
                  Error 404
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/status/500"
                  startIcon={<CameraFrontTwoToneIcon />}
                >
                  Error 500
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/status/coming-soon"
                  startIcon={<ChromeReaderModeTwoToneIcon />}
                >
                  Coming Soon
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/status/maintenance"
                  startIcon={<WorkspacePremiumTwoToneIcon />}
                >
                  Maintenance
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
      </MenuWrapper> */}
      {/* <MenuWrapper>
        {menuItems.map((menuItem, index) => (
          <List
            key={index}
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                {menuItem.header}
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div">
                {menuItem.items.map((item, idx) => (
                  <ListItem key={idx} component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to={item.to}
                      startIcon={item.icon}
                    >
                      {item.label}
                      <SubMenuWrapper>
                        <List component="div">
                          {item.children.map((child, index) => (
                            <ListItem key={idx} component="div">
                              <Button
                                disableRipple
                                component={RouterLink}
                                onClick={closeSidebar}
                                to={child.to}
                                startIcon={child.icon}
                              >
                                {child.label}
                              </Button>
                            </ListItem>
                          ))}
                        </List>
                      </SubMenuWrapper>
                    </Button>
                  </ListItem>
                ))}
              </List>
            </SubMenuWrapper>
          </List>
        ))}
      </MenuWrapper> */}
      <MenuWrapper>
        {menuItems.map((menuItem, index) => (
          <List
            key={index}
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                {menuItem.header}
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div">
                {menuItem.items.map((item, idx) => (
                  <Grid key={idx}>
                    <ListItem component="div">
                      <Button
                        fullWidth
                        disableRipple
                        component={RouterLink}
                        onClick={() => toggleChildren(item.label)}
                        to={item.to}
                        startIcon={item.icon}
                      >
                        <Typography sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          {item.label}
                          {item.children ? openParentIndex.get(item.label) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> : ""}
                        </Typography>
                      </Button>
                    </ListItem>
                    {item.children && openParentIndex.get(item.label) && ( // Check if the item has children
                      <List component="div">
                        {item.children.map((child, childIdx) => (
                          <ListItem sx={{ paddingLeft: 2, marginBottom: 0.2 }} key={childIdx} component="div">
                            <Button
                              size='small'
                              component={RouterLink}
                              onClick={closeSidebar}
                              to={child.to}
                              startIcon={child.icon}
                            >
                              {child.label}
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Grid>
                ))}
              </List>
            </SubMenuWrapper>
          </List>
        ))}
      </MenuWrapper>

    </>
  );
}

export default SidebarMenu;
