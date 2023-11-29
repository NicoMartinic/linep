import { styleConfirmModal } from '../../../common';
import { Box, Button, Modal, Grid, Typography } from '@mui/material';

function ConfirmModal(props) {

    return (
        <>
        <Modal
            id="modal-confirm-report"
            open={props.modalOpened}
            onClose={() => !props.isLoading ? props.setModalOpened(false) : null}
            disableBackdropClick
            >
            <Box sx={props.modalStyles ? props.modalStyles : styleConfirmModal} mt={0}>
                <Grid container justifyContent="center" alignItems="center" height="100%" pt={2}>
   
                    <Typography variant="h5" sx={{fontSize: '1.2rem', px: 5, color: (theme) => theme.palette.lightGrey.main}} mt={2}>{props.title}</Typography>
                    
                    <Grid item xs={12}>
                        {props.children}
                    </Grid>

                    {
                        !props.modalHideActions ? 
                            <Grid container justifyContent="center" alignItems="center" mb={2}>
                                <Grid item xs={4} md={4} lg={props.fullWidth ? 2 : 4} ml={1}>
                                    <Button 
                                        variant="contained"
                                        fullWidth
                                        size="normal"
                                        sx={{mt: 5}}
                                        onClick={() => {
                                            if (!props.isLoading || props.enableForcedCancel){
                                                props.setModalOpened(false)
                                            }
                                        }}
                                        color="error"
                                        className={""}>
                                            Cancelar
                                    </Button>
                                </Grid>
                                <Grid item xs={4} md={4} lg={props.fullWidth ? 2 : 4} ml={1}>
                                    <Button 
                                        variant="contained"
                                        fullWidth
                                        size="normal"
                                        sx={{mt: 5}}
                                        onClick={() => props.isLoading ? null : props.callback()
                                        }
                                        color="success"
                                        className={props.isLoading ? "state-loading" : ""}>
                                            { props.isLoading ? props.loadingLabel : "Aceptar"}
                                    </Button>
                                </Grid>
                            </Grid>
                        : <Grid container justifyContent="center" alignItems="center" mb={2}>
                            <Grid item xs={4} md={4} lg={props.fullWidth ? 2 : 4} ml={1}>
                                <Button 
                                    variant="contained"
                                    fullWidth
                                    size="normal"
                                    sx={{mt: 5}}
                                    onClick={() => {
                                        if (!props.isLoading || props.enableForcedCancel){
                                            props.setModalOpened(false)
                                        }
                                    }}
                                    color="primary"
                                    className={""}>
                                        Cerrar
                                </Button>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Box>
        </Modal>
        </>

    );
}

export default ConfirmModal;
