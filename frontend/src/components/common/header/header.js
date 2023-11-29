import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AlertDisplayer from "../alert-displayer/alert-displayer";
import ConnectButtonCustom from "../connect-button/connect-button";
import { Link } from "react-router-dom";

//ACTIONS
import * as AUTH_ACTIONS from "../../../actions/auth-actions";

function Header() {
    const dispatch = useDispatch();
    const modules = useSelector((state) => state.modules);
    const user = useSelector((state) => state.user);
    const history = useHistory();
    const location = useLocation();

    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedSubModule, setSelectedSubModule] = useState(null);

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [openedSubMenu, setOpenedSubMenu] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = (event) => {
        setAnchorElNav(null);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = (event) => {
        setAnchorElUser(null);
    };

    const handleOpenOrRedirectSubMenu = (elem, sub_elem) => {
        if (elem && sub_elem) {
            setOpenedSubMenu(sub_elem.name);
        } else {
            setOpenedSubMenu(null);
        }
    };

    const handleCloseSubMenu = (event) => {
        setOpenedSubMenu(null);
    };

    const getMenuButtonColor = (theme, elem) => {
        if (selectedModule && elem.url == selectedModule.url) {
            return theme.palette.secondary.main;
        } else return theme.palette.primary.main;
    };

    const getSubMenuButtonColor = (theme, elem) => {
        if (selectedSubModule && elem.url == selectedSubModule.url) {
            return theme.palette.secondary.main;
        } else return theme.palette.background.main;
    };

    useEffect(() => {
        let mod = location.pathname.split("/");
        if (mod && mod.length > 1 && modules && modules.length > 0) {
            let selectedM = modules.filter((m) => m.url === mod[1]);
            if (selectedM && selectedM.length > 0) {
                if (mod.length > 2) {
                    let selectedSubM = selectedM[0].submodules.filter(
                        (m) => m.url === mod[2]
                    );
                    if (selectedSubM && selectedSubM.length > 0) {
                        setSelectedSubModule(selectedSubM[0]);
                    } else {
                        setSelectedSubModule(null);
                    }
                } else {
                    if (selectedM[0].submodules.length > 0) {
                        setSelectedSubModule(selectedM[0].submodules[0]);
                    }
                }
                setSelectedModule(selectedM[0]);
            } else {
                setSelectedModule(null);
                setSelectedSubModule(null);
            }
        }
    }, [location, modules]);

    return (
        <div>
            <AppBar position="static">
                <AlertDisplayer
                    styles={{
                        position: "absolute",
                        top: "0px",
                        width: "100%",
                        minHeight: "48px",
                    }}
                    doAnimation={true}
                ></AlertDisplayer>

                <Container maxWidth="xxl">
                    <Toolbar
                        disableGutters
                        sx={{ minHeight: "48px!important" }}
                    >
                        <img
                            src={process.env.PUBLIC_URL + "/images/Logo.png"}
                            alt={"Linep logo"}
                            loading="lazy"
                            sx={{ maxHeight: "20px" }}
                        />
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
                        >
                            LINEP
                        </Typography>

                        {/* MENU DESPLEGABLE DE MODULOS PARA MOBILE */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" },
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" },
                                }}
                            >
                                {modules && modules.length > 0
                                    ? modules.map((elem, index) => (
                                          <Link
                                              key={index}
                                              to={"/" + elem.url.toLowerCase()}
                                              style={{
                                                  textDecoration: "none",
                                                  color: "black",
                                              }}
                                          >
                                              <MenuItem key={elem.name + index}>
                                                  <Typography textAlign="center">
                                                      {elem.name}
                                                  </Typography>
                                              </MenuItem>
                                          </Link>
                                      ))
                                    : ""}
                            </Menu>
                        </Box>

                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" },
                            }}
                        >
                            LINEP
                        </Typography>

                        {/* MODULOS EN PANTALLA GRANDE */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                            }}
                        >
                            {modules && modules.length > 0
                                ? modules.map((elem, index) => (
                                      <Link
                                          key={index}
                                          to={"/" + elem.url.toLowerCase()}
                                          style={{ textDecoration: "none" }}
                                      >
                                          <Button
                                              key={elem.name + index}
                                              sx={{
                                                  my: 0,
                                                  color: "white",
                                                  display: "block",
                                                  backgroundColor: (theme) =>
                                                      getMenuButtonColor(
                                                          theme,
                                                          elem
                                                      ),
                                                  "&:hover": {
                                                      backgroundColor: (
                                                          theme
                                                      ) =>
                                                          getMenuButtonColor(
                                                              theme,
                                                              elem
                                                          ),
                                                  },
                                              }}
                                          >
                                              {elem.name}
                                          </Button>
                                      </Link>
                                  ))
                                : ""}
                        </Box>

                        <Typography
                            textAlign="center"
                            mr={1}
                            sx={{ fontWeight: "bold" }}
                        >
                            {user ? user.username : "Usuario"}
                        </Typography>

                        {/* PERFIL DE USUARIO */}
                        {/* <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title={"Perfil"}>
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        alt={user ? user.username : ""}
                                        src=""
                                    ></Avatar>
                                </IconButton>
                            </Tooltip>

                            <Menu
                                sx={{ mt: "32px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <Link
                                    to={"/" + "change-password"}
                                    style={{
                                        textDecoration: "none",
                                        color: "black",
                                    }}
                                ></Link>

                                <MenuItem
                                    key={"Cerrar sesión"}
                                    onClick={() =>
                                        dispatch(AUTH_ACTIONS.logout(""))
                                    }
                                >
                                </MenuItem>
                            </Menu>
                        </Box> */}
                        {/* RAINBOWKIT BUTTON */}
                        <Box sx={{ flexGrow: 0 }} m={1}>
                            {/* CHANGE TO CUSTOM CONNECT BUTTON */}
                            <ConnectButtonCustom />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Toolbar
                disableGutters
                sx={{
                    mx: 2,
                    borderBottom: "1px solid white",
                    minHeight: "42px!important",
                }}
            >
                {/* SUBMODULOS Y SUBSUBMODULOS */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: { xs: "flex", md: "flex" },
                        flexWrap: "wrap",
                    }}
                >
                    {modules && modules.length > 0 && selectedModule
                        ? selectedModule.submodules.map((sub_elem, index) => {
                              let b =
                                  sub_elem.submodules.length >
                                  0 /*SI CONTIENE SUBMENUS MANEJAMOS LA REDIRECCION CON ONCLICK*/ ? (
                                      <Button
                                          id={
                                              "submenu-button-" +
                                              sub_elem.name +
                                              index
                                          }
                                          key={sub_elem.name}
                                          onClick={(e) =>
                                              handleOpenOrRedirectSubMenu(
                                                  selectedModule,
                                                  sub_elem
                                              )
                                          }
                                          sx={{
                                              my: 0,
                                              color: "white",
                                              display: "block",
                                              fontSize: "13px",
                                              backgroundColor: (theme) =>
                                                  getSubMenuButtonColor(
                                                      theme,
                                                      sub_elem
                                                  ),
                                              "&:hover": {
                                                  backgroundColor: (theme) =>
                                                      getSubMenuButtonColor(
                                                          theme,
                                                          sub_elem
                                                      ),
                                              },
                                          }}
                                      >
                                          {sub_elem.name}
                                      </Button>
                                  ) : (
                                      /*EN EL CASO DE QUE EL MENU NO CONTENGA SUBMENUS*/

                                      <Link
                                          to={
                                              "/" +
                                              selectedModule.url +
                                              "/" +
                                              sub_elem.url
                                          }
                                          style={{ textDecoration: "none" }}
                                      >
                                          <Button
                                              id={
                                                  "submenu-button-" +
                                                  sub_elem.name
                                              }
                                              key={sub_elem.name + index}
                                              sx={{
                                                  my: 0,
                                                  color: "white",
                                                  display: "block",
                                                  fontSize: "13px",
                                                  backgroundColor: (theme) =>
                                                      getSubMenuButtonColor(
                                                          theme,
                                                          sub_elem
                                                      ),
                                                  "&:hover": {
                                                      backgroundColor: (
                                                          theme
                                                      ) =>
                                                          getSubMenuButtonColor(
                                                              theme,
                                                              sub_elem
                                                          ),
                                                  },
                                              }}
                                          >
                                              {sub_elem.name}
                                          </Button>
                                      </Link>
                                  );

                              let m = null;
                              if (sub_elem.submodules.length > 0) {
                                  m = (
                                      <Menu
                                          sx={{ mt: "40px", py: "4px" }}
                                          id={"menu-" + sub_elem.name}
                                          anchorEl={document.getElementById(
                                              "submenu-button-" + sub_elem.name
                                          )}
                                          anchorOrigin={{
                                              vertical: "top",
                                              horizontal: "left",
                                          }}
                                          keepMounted
                                          transformOrigin={{
                                              vertical: "top",
                                              horizontal: "left",
                                          }}
                                          open={b.key == openedSubMenu}
                                          onClose={handleCloseSubMenu}
                                      >
                                          {sub_elem.submodules.map(
                                              (sub_sub_elem, index) => (
                                                  <Link
                                                      to={
                                                          "/" +
                                                          selectedModule.url +
                                                          "/" +
                                                          sub_elem.url +
                                                          "/" +
                                                          sub_sub_elem.url
                                                      }
                                                      style={{
                                                          textDecoration:
                                                              "none",
                                                          color: "black",
                                                      }}
                                                  >
                                                      <MenuItem
                                                          key={
                                                              sub_sub_elem.name
                                                          }
                                                      >
                                                          <Typography
                                                              textAlign="center"
                                                              sx={{
                                                                  fontSize:
                                                                      "13px",
                                                              }}
                                                          >
                                                              {
                                                                  sub_sub_elem.name
                                                              }
                                                          </Typography>
                                                      </MenuItem>
                                                  </Link>
                                              )
                                          )}
                                      </Menu>
                                  );
                              }
                              return (
                                  <div key={sub_elem.name + index}>
                                      {b}
                                      {m ? m : ""}
                                  </div>
                              );
                          })
                        : ""}
                </Box>
            </Toolbar>
        </div>
    );
}

export default Header;
