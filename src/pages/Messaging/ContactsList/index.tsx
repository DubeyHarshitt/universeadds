import { Box, Card, CardContent, CardHeader, Divider, Grid, Tab, Tabs, Typography } from "@mui/material";
import { lazy, useState } from "react";
import { Loader } from "src/router";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddContacts from "./TableContent/AddContacts";

const SwitchTabs = Loader(
    lazy(() => import('src/components/SwitchTabs/index'))
)

const Table = Loader(
    lazy(() => import('src/pages/Messaging/ContactsList/TableContent/Table'))
)


const ViewContacts = () => {
    const [addContactBridge, setAddContactBridge] = useState([])
    const [isEmployee, setIsEmployee] = useState<boolean>(false);

    return (
        <Grid item>
            <AddContacts addContactBridge={addContactBridge} setAddContactBridge={setAddContactBridge} isEmployee={isEmployee} setIsEmployee={setIsEmployee} />
            <Table addContactBridge={addContactBridge} setAddContactBridge={setAddContactBridge} isEmployee={isEmployee} />
        </Grid>
    )
}


const BulkUpload = () => {
    return (
        <>Helo</>
    )
}
const BulkHeader = () => {
    return (
        <Grid sx={{ display: "flex", flexDirection: "row", alignItems: 'center', gap: 0.5 }}>
            <UploadFileIcon fontSize="inherit" />
            <Typography >Bulk Upload</Typography>
        </Grid>
    )
}

function index() {
    return (
        <Card>
            <CardHeader title="Contact Lists" />
            <Divider />
            {/* <TabsDemo /> */}
            <SwitchTabs headers={["View / Add Contacts", <BulkHeader key={"Bulk Unpload"} />]} content={[<ViewContacts key={"view contact"} />, "Two"]} />
        </Card>
    )
}

export default index