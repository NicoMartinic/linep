import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./responsive.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers/rootReducer";
import ReduxThunk from "redux-thunk";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import { BrowserRouter as Router } from "react-router-dom";

//RAINBOWKIT SETUP
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";

//STORE CONFIGURATION
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

//RAINBOWKIT CONFIGURATION
const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        mainnet,
        polygon,
        optimism,
        arbitrum,
        sepolia,
        ...( [sepolia] ),
    ],
    [
        alchemyProvider({ apiKey: "ovyWWbtstGWDbJ0bR5y-MyE9w104QFSm" }),
        infuraProvider({ apiKey: "b02df5a1a2c2458baa7f2b68b2dce6c1" }),
        //publicProvider(),
    ],
    { rank: true }
);

const { connectors } = getDefaultWallets({
    appName: "RainbowKit demo",
    projectId: "c0ce5874fee02331d9d3dddcf0d7a21d",
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});

//PREVIOUS CONFIGS
const background = "#140130";
const primary = "#140130";
const secondary = "#B514D2"; // B514D2
const darkGrey = "#FC2080"; // FC2080
const grey = "#FC2080"; //'#AEC3B0';
const lightGrey = "#f3f3f3"; //'#EFF6E0';
const errorColor = "#E63946";
const box = "#13262e";

const theme = createTheme({
    palette: {
        primary: {
            main: primary,
        },
        secondary: {
            main: secondary,
        },
        darkGrey: {
            main: darkGrey,
        },
        grey: {
            main: grey,
        },
        lightGrey: {
            main: lightGrey,
        },
        error: {
            main: errorColor,
        },
        background: {
            main: background,
        },
    },
    components: {
        /*MuiTypography: {
		  defaultProps: {
			variantMapping: {
			  h1: 'h2',
			  h2: 'h2',
			  h3: 'h2',
			  h4: 'h2',
			  h5: 'h2',
			  h6: 'h2',
			  subtitle1: 'h2',
			  subtitle2: 'h2',
			  body1: 'span',
			  body2: 'span',
			},
		  },
		},*/
        /*MuiTypography: {
			styleOverrides: {
				root: {
					color: lightGrey,
					borderBottom: '1px solid ' + secondary,
				}
			}
		},*/
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: secondary,
                    top: "-4px",
                    "&.Mui-focused": {
                        color: lightGrey,
                        fontSize: "20px",
                    },
                    "&.MuiFormLabel-filled": {
                        fontSize: "20px",
                    },
                },
            },
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    backgroundColor: background,
                    color: "white",
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                /*root: {
					borderColor: 'yellow',
					'&.Mui-focused': {
						borderColor: 'green'
					}
				},*/
                root: {
                    color: lightGrey,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: secondary,
                    },
                },
                input: {
                    "&:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 100px " + box + " inset",
                        WebkitTextFillColor: lightGrey,
                    },
                },
                notchedOutline: {
                    borderColor: secondary,
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    color: lightGrey,
                    borderBottom: "1px solid " + secondary,
                    ".MuiSvgIcon-root": {
                        fill: "white",
                        '&[data-testid="CalendarIcon"]': {
                            marginRight: "4px",
                        },
                    },
                    "&.no-border .MuiSvgIcon-root": {
                        fill: background,
                    },
                    "&:before": {
                        border: "none!important",
                    },
                    "&:after": {
                        border: "none!important",
                    },
                },
                notchedOutline: {
                    borderColor: secondary,
                },
                input: {
                    height: "22px!important",
                    paddingTop: "4px!important",
                    paddingBottom: "4px!important",
                    display: "block !important",
                    "&:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 100px " + box + " inset",
                        WebkitTextFillColor: lightGrey,
                    },
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    background: primary,
                    ".MuiTableSortLabel-root.Mui-active": {
                        color: "white",
                        ".MuiSvgIcon-root": {
                            fill: "white",
                        },
                    },
                },
            },
        },
        MuiTableBody: {
            styleOverrides: {
                root: {
                    ".MuiTableRow-root": {
                        borderBottom: "1px solid " + primary + "!important",
                        "&.with-hover:hover": {
                            cursor: "pointer",
                            backgroundColor: secondary + "!important",
                            ".MuiCheckbox-root": {
                                color: lightGrey,
                            },
                            ".MuiRadio-root": {
                                color: lightGrey,
                            },
                            ".MuiOutlinedInput-notchedOutline": {
                                borderColor: "white", //primary,
                                borderWidth: "2px",
                            },
                        },
                        "&.selected-row": {
                            backgroundColor: green[800] + "!important",
                            ".MuiOutlinedInput-notchedOutline": {
                                borderColor: "white!important",
                                borderWidth: "2px",
                            },
                            ".MuiButton-textSuccess": {
                                color: "white",
                            },
                        },
                        ".MuiCheckbox-root": {
                            color: secondary,
                        },
                        ".MuiCheckbox-root.Mui-checked": {
                            color: lightGrey,
                            /*backgroundColor: 'white',
							width: '18px',
							height: '18px'*/
                        },
                        ".MuiRadio-root": {
                            color: secondary,
                        },
                        ".MuiRadio-root.Mui-checked": {
                            color: lightGrey,
                            /*backgroundColor: 'white',
							width: '18px',
							height: '18px'*/
                        },
                        ".MuiOutlinedInput-root": {
                            position: "relative",
                            left: "-14px",
                        },
                        ".MuiFormControl-root": {
                            marginTop: "0px",
                        },
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    color: "white",
                    height: "30px",
                    whiteSpace: "nowrap",
                },
            },
        },
        MuiTablePagination: {
            styleOverrides: {
                root: {
                    color: "white",
                    ".MuiSvgIcon-root": {
                        fill: "white",
                    },
                },
            },
        },
        MuiModal: {
            styleOverrides: {
                root: {
                    "&:not(.MuiPopover-root) .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                    },
                    ".MuiBox-root": {
                        //top: '50%',
                        maxHeight: "calc(100vh - 150px)",
                        overflowY: "auto",
                    },
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    "&.Mui-focused": {
                        color: lightGrey,
                    },
                    color: secondary,
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: secondary,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                containedDarkGrey: {
                    color: "white",
                },
                root: {
                    "&.Mui-disabled": {
                        color: "#ffffffad",
                        boxShadow: "none",
                        backgroundColor: "#3c3b3b",
                        pointerEvents: "all",
                    },
                    "&.Mui-disabled:hover": {
                        cursor: "not-allowed !important",
                    },
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                markLabel: {
                    color: "white",
                    fontSize: "16px",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    paddingBottom: "1px",
                    height: "20px",
                    backgroundColor: "#004559",
                    color: "white",
                    maxHeight: "200px",
                    ".MuiSvgIcon-root": {
                        fill: "white",
                    },
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    marginTop: "8px",
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    "&.forDarkBackground": {
                        color: secondary,
                    },
                    "&.forDarkBackground.Mui-checked": {
                        color: lightGrey,
                    },
                    "&.forDarkBackground:hover": {
                        color: lightGrey,
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    overflow: "hidden",
                    minHeight: "auto",
                    display: "table",
                    ".MuiBox-root": {
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    },
                },
            },
        },
        MuiButtonGroup: {
            styleOverrides: {
                grouped: {
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    "&.active": {
                        backgroundColor: secondary,
                    },
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    color: "#fff9",
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    color: background,
                    backgroundColor: secondary,
                },
            },
        },
    },
});

//REACT DOM RENDER
ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <WagmiConfig config={wagmiConfig}>
                <RainbowKitProvider chains={chains}>
                    <ThemeProvider theme={theme}>
                        <Router>
                            <App store={store} />
                        </Router>
                    </ThemeProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </React.StrictMode>
    </Provider>,
    document.getElementById("root")
);

//BROWSER AND WEB VITALS
document
    .getElementsByTagName("body")[0]
    .classList.add(
        navigator.userAgent.includes("Chrome") ? "chrome" : "firefox"
    );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
