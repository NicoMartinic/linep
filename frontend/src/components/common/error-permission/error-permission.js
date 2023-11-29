import React, { useEffect } from 'react';
import { Typography, Grid } from '@mui/material';

function ErrorPermission() {

    useEffect(() => {
		document.title = "LINEP";
	}, []);

    return (
        <Grid container justifyContent="center" alignItems="center" height="100%" mt={5} mx={3} width="auto" pb={1}>
            <Typography variant="h5" sx={{color: (theme) => theme.palette.lightGrey.main}}>Acceso no permitido.</Typography>
        </Grid>
    );
}
export default ErrorPermission;