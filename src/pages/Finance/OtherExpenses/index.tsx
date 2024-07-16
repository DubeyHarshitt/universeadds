import { Grid } from '@mui/material'
import React, { lazy } from 'react'
import { Loader } from 'src/router';


const InputExpenses = Loader(
    lazy(() => import('src/pages/Finance/OtherExpenses/InputExpense'))
);


const TableExpenses = Loader(
    lazy(() => import('src/pages/Finance/OtherExpenses/TableExpenses'))
);

function index() {
    return (
        <Grid>
            <Grid><InputExpenses /></Grid>
            <Grid><TableExpenses /></Grid>
        </Grid>
    )
}

export default index