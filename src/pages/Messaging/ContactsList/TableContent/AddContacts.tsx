import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    MenuItem,
    Paper,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { SubmitHandler, useForm } from 'react-hook-form';
import loggedInUser from 'src/util/loggedInUser';
import { useAddContactDetails } from 'src/services/fetchGroups';

export interface IAddContactFormInput {
    firstName: string;
    lastName: string;
    contactNumber: string;
    groupName: string;
    designation?: string;
    salary?: string;
    fees?: string;
}


interface TextTem {
    groupName: string | null;
}

interface AcceptBtnProps {
    setAddGroupTxt: (value: string | null) => void;
    addGroupTxt: string | null;
}
const GroupComponent = ({
    addGroup = true,
    // register,
    // errors,
    // groupError,
    // handleSubmit,
    // handleSubmitAddGroup
    addContactBridge,
    setAddContactBridge,
    isEmployee,
    setIsEmployee
}) => {
    const [groupName, setGroupName] = useState<string>(null);
    const [switchVal, setSwitchVal] = useState<boolean>(false);
    const [err, setErr] = useState(null);
    const [suc, setSuc] = useState(null);
    const { mutateAsync: addContactDetails, isError } = useAddContactDetails(isEmployee);

    const GroupBtn = () => {
        return (
            <Button
                variant="outlined"
                onClick={handleSwitchComp}
                sx={{
                    width: '100%'
                }}
            >
                + Add Group
            </Button>
        );
    };

    const groupnames = useMemo(() => {
        const groupSet = new Set();
        addContactBridge?.map((data) => groupSet.add(data.groupName));
        const groupList = Array.from(groupSet);
        return groupList.concat([<GroupBtn key={'AddGroup'} />]);
    }, [addContactBridge]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IAddContactFormInput>();

    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors }
    // } = useForm<IAddContactFormInput>();

    // const subHandleSubmit = (dataVal) => {
    //     groupnames.push(dataVal);
    // };
    // console.log(groupnamess, 'ssss');

    const handleChange = (e) => {
        setGroupName(e.target.value);
    };

    const handleSwitchComp = () => {
        setSwitchVal(true);
    };

    // const groupnames = [
    //     <GroupBtn key={'AddGroup'} />,
    //     'Group 1',
    //     'Group 2',
    //     'Group 3'
    // ];

    const handleSubmitAddContact: SubmitHandler<IAddContactFormInput> = async (
        dataVal
    ) => {
        const data = isEmployee ? {
            owner: loggedInUser(),
            firstName: dataVal.firstName,
            lastName: dataVal.lastName,
            contactNumber: dataVal.contactNumber,
            groupName: groupName ? groupName : dataVal.groupName,
            designation: dataVal.designation,
            salary: dataVal.salary,
        } : {
            owner: loggedInUser(),
            firstName: dataVal.firstName,
            lastName: dataVal.lastName,
            contactNumber: dataVal.contactNumber,
            groupName: groupName ? groupName : dataVal.groupName,
            fees: dataVal.fees,
        };

        if (data.groupName) {
            addContactDetails(data)
                .then((data) => {
                    setSuc('Data Added Successfully : ' + JSON.stringify(data));
                    const contactDetails = [...addContactBridge];
                    contactDetails.push(data);
                    setAddContactBridge(contactDetails);
                    setTimeout(() => {
                        setSuc(null);
                    }, 3000);
                })
                .catch((err) => {
                    setErr(err.response.data.message);
                    setTimeout(() => {
                        setErr(null);
                    }, 3000);
                });
        }
    };

    const widthMaps = {
        xs: '100%', // 0px - 600px
        sm: '75%', // 600px - 960px
        md: '50%', // 960px - 1280px
        lg: '25%' // 1280px and up
    };

    const widthMaps2 = {
        xs: '100%', // 0px - 600px
        sm: '75%', // 600px - 960px
        md: '50%', // 960px - 1280px
        lg: '70%' // 1280px and up
    };

    return (
        <Grid sx={{ backgroundColor: 'rgb(249, 249, 249)' }}>
            <Box
                style={{
                    padding: 20,
                    border: '1px solid gray',
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
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
                    <Grid
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: { ...widthMaps },
                            gap: 2
                        }}
                    >
                        <Switch
                            value={isEmployee}
                            onChange={() => setIsEmployee(!isEmployee)}
                        />
                        <Typography fontWeight={800}>
                            {isEmployee ? 'Entry for Employee' : 'Entry for Student'}
                        </Typography>
                    </Grid>
                    <TextField
                        sx={{ width: { ...widthMaps } }}
                        size="small"
                        id="outlined-required"
                        label="First Name"
                        {...register('firstName', {
                            required: '* First Name is Required'
                        })}
                    />
                    <TextField
                        sx={{ width: { ...widthMaps } }}
                        size="small"
                        id="outlined-required"
                        label="Last Name"
                        {...register('lastName', {
                            required: '* Last Name is Required'
                        })}
                    />
                    <TextField
                        sx={{ width: { ...widthMaps } }}
                        size="small"
                        id="outlined-required"
                        label="Contact Number"
                        {...register('contactNumber', {
                            required: '* Contact Number is Required'
                        })}
                    />
                </Grid>
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

                    {isEmployee && <TextField
                        sx={{ width: { ...widthMaps } }}
                        size="small"
                        id="outlined-required"
                        label="Designation"
                        {...register('designation', {
                            required: '* Designation is Required'
                        })}
                    />}
                    {isEmployee ?
                        <TextField
                            sx={{ width: { ...widthMaps } }}
                            size="small"
                            id="outlined-required"
                            label="Salary"
                            {...register('salary', {
                                required: '* Salary is Required'
                            })}
                        /> :
                        <TextField
                            sx={{ width: { ...widthMaps } }}
                            size="small"
                            id="outlined-required"
                            label="Fees"
                            {...register('fees', {
                                required: '* Fees is Required'
                            })}
                        />}
                    {!switchVal && (
                        <TextField
                            sx={{ width: { ...widthMaps } }}
                            size="small"
                            id="outlined-select-currency"
                            select
                            label="Group Name"
                            value={groupName}
                            onChange={handleChange}
                        >
                            {groupnames?.map((option, indx) =>
                                typeof option === 'string' ? (
                                    <MenuItem key={indx} value={option}>
                                        {option}
                                    </MenuItem>
                                ) : (
                                    <Grid>{option}</Grid>
                                )
                            )}
                        </TextField>
                    )}
                    {switchVal && (
                        <Grid
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            <TextField
                                sx={{ width: { ...widthMaps2 } }}
                                size="small"
                                id="outlined-required"
                                label="Group Name"
                                {...register('groupName', {
                                    required: '* Group Name is Required'
                                })}
                            />
                            <Paper
                                // variant="outlined"
                                // size="small"
                                sx={{
                                    height: '30px',
                                    backgroundColor: 'rgba(186, 255, 202, 0.8)',
                                    border: '1px solid green',
                                    color: 'green',
                                    borderRadius: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        cursor: 'pointer' // Change cursor on hover
                                    }
                                }}
                                onClick={() => setGroupName(null)}
                            >
                                <DoneIcon />
                            </Paper>
                            <Paper
                                sx={{
                                    height: '30px',
                                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                    border: '1px solid red',
                                    color: 'red',
                                    borderRadius: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        cursor: 'pointer' // Change cursor on hover
                                    }
                                }}
                                onClick={() => setSwitchVal(false)}
                            >
                                <ClearIcon />
                            </Paper>
                        </Grid>
                    )}
                    <Button
                        sx={{ width: { ...widthMaps } }}
                        variant="outlined"
                        size="small"
                        onClick={handleSubmit(handleSubmitAddContact)}
                    >
                        + Add
                    </Button>
                </Grid>
                {/* {!switchVal ? (
                    
                ) : (
                    <TextField
                        sx={{ width: '25%' }}
                        size="small"
                        id="outlined-select-currency"
                        select
                        label="Add Group"
                    >
                        <MenuItem key={0}>
                            <TextField
                                size="small"
                                id="outlined-required"
                                label="Group Name"
                            />
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    backgroundColor: 'rgba(186, 255, 202, 0.8)',
                                    borderColor: 'green',
                                    color: 'green'
                                }}
                            // onClick={btnHandleSub(subHandleSubmit)}
                            >
                                <DoneIcon />
                            </Button>
                            <Button
                                onClick={() => setSwitchVal(false)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                    borderColor: 'red',
                                    color: 'red'
                                }}
                            >
                                <ClearIcon />
                            </Button>
                        </MenuItem>
                    </TextField>
                )} */}
            </Box>
            {err && (
                <Grid
                    sx={{
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        // borderColor: 'green',
                        borderBottom: '1px solid gray',
                        borderLeft: '1px solid gray',
                        borderRight: '1px solid gray',
                        borderRadius: '5px'
                    }}
                >
                    <Typography color={'error'} padding={0.5} fontWeight={'semibold'}>
                        {err}
                    </Typography>
                </Grid>
            )}
            {suc && (
                <Grid
                    sx={{
                        backgroundColor: 'rgba(186, 255, 202, 0.8)',
                        // borderColor: 'green',
                        borderBottom: '1px solid gray',
                        borderLeft: '1px solid gray',
                        borderRight: '1px solid gray',
                        borderRadius: '5px'
                    }}
                >
                    <Typography color={'sucess'} padding={0.5} fontWeight={'semibold'}>
                        {suc}
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
};

function AddContacts({ addContactBridge, setAddContactBridge, isEmployee, setIsEmployee }) {
    return (
        // <Container>
        <Grid sx={{ marginX: 2 }}>
            <Paper sx={{ background: 'gray' }}>
                <GroupComponent
                    isEmployee={isEmployee}
                    setIsEmployee={setIsEmployee}
                    addContactBridge={addContactBridge}
                    setAddContactBridge={setAddContactBridge}
                />
            </Paper>
        </Grid>
        // </Container>
    );
}

export default AddContacts;
