import { Box, Container, Grid, Tab, Tabs, Typography } from '@mui/material';
import React, { SyntheticEvent, useState } from 'react'

type SwitchTabProps = {
    headers: string[],
    content: React.ComponentType<any>[]
}
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Grid>
                    {children}
                </Grid>
                // <Box sx={{ p: 3 }}>
                // <Typography></Typography>
                // </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

function index(props: SwitchTabProps) {
    const { headers, content } = props;
    const [value, setValue] = useState(0);
    console.log(headers, content, 'con');

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Container maxWidth="lg" sx={{ marginY: 2 }}>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    {/* <Card> */}
                    {/* <CardHeader title={value} />
                    <Divider /> */}
                    {/* <CardContent> */}
                    <Box sx={{ width: '100%' }}>
                        <Tabs
                            variant="scrollable"
                            scrollButtons="auto"
                            textColor="primary"
                            indicatorColor="primary"
                            value={value}
                            onChange={handleChange}
                        // aria-label="basic tabs example"
                        >
                            {headers?.map((head, index) => {
                                return <Tab
                                    key={index}
                                    label={head}
                                    {...a11yProps(index)}
                                    sx={{ border: value !== index && "1px solid #e0e0e0" }}
                                />
                            })}
                        </Tabs>
                        <Grid sx={{ marginTop: 2 }}>
                            {content?.map((cont, index) => { return <TabPanel key={index} value={value} index={index}>{cont}</TabPanel> })}
                        </Grid>
                    </Box>
                    {/* </CardContent> */}
                    {/* </Card> */}
                </Grid>
            </Grid>
        </Container>
    )
}

export default index