import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PermissionDecorator from '../../../decorators/permission-decorator';

function TableHeader(props){
    return (
        <Grid container justifyContent="left" alignItems="center" height="100%" sx={props.border ? { borderBottom: '1px solid white', borderColor: (theme) => theme.palette.primary.main } : {}} pb={props.border ? 1 : 0} mb={1}>
            <Grid item xs={12} sm={6} md={8} lg={9}>
                <Grid container justifyContent="left" alignItems="center" height="100%">
                    <Typography variant="h6" sx={{color: (theme) => theme.palette.lightGrey.main}}>{props.title}</Typography>
                </Grid>
            </Grid>


            {
               props.buttonOnClick && props.buttonLabel ?
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Grid container justifyContent="right" alignItems="center" height="100%">
                            <Grid item xs={12} pl={1}>
                                <PermissionDecorator showError={false} permission={props.permission}>
                                    <Button 
                                        variant="contained" 
                                        fullWidth 
                                        size="normal" 
                                        onClick={props.buttonOnClick} 
                                        color={"success"} 
                                        className={""}>
                                        {props.buttonLabel}
                                    </Button>
                                </PermissionDecorator>
                            </Grid>
                        </Grid>
                    </Grid> 
                : null

            }

            { 
                props.redirectionUrl && props.buttonLabel ? 

                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Grid container justifyContent="right" alignItems="center" height="100%">
                            <Grid item xs={12} pl={1}>
                                <Link to={props.redirectionUrl} style={{ textDecoration: 'none' }}>
                                    <PermissionDecorator showError={false} permission={props.permission}>
                                        <Button 
                                            variant="contained" 
                                            fullWidth 
                                            size="normal" 
                                            color={"success"} 
                                            className={""}>
                                            {props.buttonLabel}
                                        </Button>
                                    </PermissionDecorator>
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid> 

                : null
            }
                    
        </Grid>
    )
}

export default TableHeader;
