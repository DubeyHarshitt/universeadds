import { Box, Button, Grid, MenuItem, TextField } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form';


const widthMaps3 = {
    xs: '50%', // 0px - 600px
    sm: '37.5%', // 600px - 960px
    md: '25.5%', // 960px - 1280px
    lg: '12.5%' // 1280px and up
};

const widthMaps = {
    xs: '100%', // 0px - 600px
    sm: '75%', // 600px - 960px
    md: '50%', // 960px - 1280px
    lg: '25%' // 1280px and up
};

const widthMaps2 = {
    xs: '100%', // 0px - 600px
    sm: '150%', // 600px - 960px
    md: '100%', // 960px - 1280px
    lg: '50%' // 1280px and up
};

export interface IAddExpense {
    expenseType: string;
    expenseName: string;
    expenseAmount: number;
    expenseDate: Date | string;
}

function InputExpense() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<IAddExpense>({
        defaultValues: {
            expenseDate: new Date().toISOString().split('T')[0] // Set default value to today's date
        }
    });

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValue('expenseType', event.target.value as string);
    };
    // #f9f9f9,rgba(186, 255, 202, 0.8),rgba(255, 0, 0, 0.1)
    return (
        <Grid sx={{ backgroundColor: 'rgb(249, 249, 249)' }}>
            <Box
                style={{
                    padding: 20,
                    border: '1px solid gray',
                    borderRadius: '5px',
                    backgroundColor: watch('expenseType') === "Spending" ? 'rgba(255, 0, 0, 0.1)' : watch('expenseType') === "Earning" ? "rgba(186, 255, 202, 0.8)" : "#f9f9f9",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 10
                }}
            >
                <Grid
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        '@media (max-width: 600px)': {
                            flexWrap: 'wrap'
                        },
                        gap: 2,
                        width: '100%'
                    }}
                >
                    <TextField
                        sx={{ width: { ...widthMaps } }}
                        size="small"
                        id="outlined-select-currency"
                        select
                        label="Expense type"
                        onChange={handleChange}
                        {...register('expenseType', { required: '* Expense Type is Required' })}
                    >
                        {["Spending", "Earning"].map((option, indx) => (
                            <MenuItem key={indx} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        sx={{ width: { ...widthMaps2 } }}
                        size="small"
                        id="outlined-required"
                        label="Expense Name"
                        {...register('expenseName', {
                            required: '* Expense Name is Required'
                        })}
                    />
                    <TextField
                        sx={{ width: { ...widthMaps } }}
                        size="small"
                        id="outlined-required"
                        label="Expense Date"
                        type="date"
                        {...register('expenseDate', {
                            required: '* Expense Date is Required'
                        })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        sx={{ width: { ...widthMaps } }}
                        size="small"
                        id="outlined-required"
                        label="Amount"
                        {...register('expenseAmount', {
                            required: '* Expense Amount is Required'
                        })}
                        type="number"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    <Button variant='contained' sx={{ width: { ...widthMaps3 } }}>
                        + Add
                    </Button>
                </Grid>

            </Box>
        </Grid>
    )
}

export default InputExpense