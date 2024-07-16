import { Dialog, DialogTitle, Grid, Icon, List, Typography } from "@mui/material";
import { useEffect } from "react";
import styled from "styled-components";

const RotateIcon = styled(Typography)(({ }) => ({
    display: 'inline-block',
    animation: 'rotateAnimation 0.7s forwards',
    '@keyframes rotateAnimation': {
        '0%': {
            transform: 'rotate(-90deg)',
        },
        '100%': {
            transform: 'rotate(0deg)',
        },
    },
}));

function SimpleDialog({ open, setOpen, header = "", centerIcon, message
}) {
    const handleClose = () => {
        setOpen(false)
    }
    useEffect(() => {
        let timer;
        if (open) {
            timer = setTimeout(() => {
                setOpen(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [open]);
    return (
        <Dialog onClose={handleClose} open={open}>
            {/* <DialogTitle>{header}</DialogTitle> */}
            <Grid sx={{ width: '310px', height: '150px', p: 5, display: "flex", flexDirection: 'column', alignItems: 'center', gap: 0.4, overflow: 'hidden' }}>
                <RotateIcon>{centerIcon}</RotateIcon>
                <Typography fontWeight={800}>{message}</Typography>
            </Grid>

        </Dialog>
    );
}
export default SimpleDialog;