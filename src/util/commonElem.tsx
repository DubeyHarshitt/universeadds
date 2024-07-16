import { Button, Grid, Typography } from "@mui/material"
import { useNavigate } from "react-router"

type HeaderProps = {
    name: String;
}
export const Header: React.FC<HeaderProps> = ({ name }) => {
    const navigate = useNavigate()
    return (
        <Grid sx={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography fontSize={15} fontWeight={800}>{name}</Typography>
            <Button variant="contained" onClick={() => { navigate("/dashboards/messaging/new-sender") }}>Add {name}</Button>
        </Grid>
    )
}