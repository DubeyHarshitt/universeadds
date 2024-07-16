import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { number } from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import DropzoneDialogExample from 'src/components/DropZone';
import BasicTable from 'src/components/Table';
import RecentOrders from 'src/content/applications/Transactions/RecentOrders';
import { useAddMessages, useFetchMessages } from 'src/services/fetchMessages';
import io from 'socket.io-client';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useGetContactDetails, useGetContactDetailsE } from 'src/services/fetchGroups';
import loggedInUser from 'src/util/loggedInUser';
import { useFetchSenders } from 'src/services/fetchNewSender';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
export interface IFormInput {
  sender: string;
  message: string;
  receivers: string[];
}

const token = localStorage?.getItem('token');
// `${process.env.REACT_APP_WHATSAPP_HOST}`
const socket = (io as any).connect(`${process.env.REACT_APP_WHATSAPP_HOST}`, {
  extraHeaders: {
    Authorization: `Bearer ${token}`
  }
});

type ScheduleResponse = {
  message: string;
  response: string;
};
function index() {
  const ref = useRef<any>(null);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [files, setFiles] = useState([]);
  console.log('files', files);
  const [modalData, setModalData] = useState<ScheduleResponse>({
    message: '',
    response: ''
  });
  const [selectedDateTime, setSelectedDateTime] = useState<string>();
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [isSmallerThanSm, setIsSmallerThanSm] = useState(window.innerWidth < 960);
  const [categorizingData, setCategorizingData] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormInput>();

  useEffect(() => {
    socket.on('schedule-response', (data) => {
      console.log('schedule-res', data);
      setModalData(data);
    });
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallerThanSm(window.innerWidth < 960);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // const { data, isLoading, refetch } = useFetchMessages();

  const parseAxiosResponse = (
    response: AxiosResponse<any, any>
  ): IFormInput[] => {
    // Assuming the response data is an array of objects with properties matching IFormInput
    return response.data.map((item: any) => {
      // Transform each item to match IFormInput
      return {
        sender: item.sender,
        message: item.message,
        receivers: item.receivers
      };
    });
  };

  // Usage example
  // const parsedData: IFormInput[] = !isLoading && parseAxiosResponse(data);

  const {
    data: contactData,
    refetch: refetchContactDetails,
    isLoading,
    isError
  } = useGetContactDetails();

  const {
    data: contactDataE,
    refetch: refetchContactDetailsE,
    isLoading: loadingEmployeeList,
    isError: ErrorEmployee
  } = useGetContactDetailsE();

  const {
    data: senderData,
    refetch: refetchSenderData,
    isLoading: isLoadingSenders,
    isError: isErrorSenders
  } = useFetchSenders();

  const categorizeData = useMemo(() => {
    const formatData = {};
    contactData?.concat(contactDataE)?.forEach((item) => {
      if (!formatData[item?.groupName]) {
        formatData[item?.groupName] = [];
      }
      formatData[item?.groupName].push(item);
    });
    return formatData;
  }, [contactData, contactDataE]);

  console.log(categorizeData, contactData, contactDataE, 'categorizeData');

  useEffect(() => {
    console.log(contactData, contactDataE, 'contactData');

  }, [contactData, contactDataE])
  // const categorizeData = (data) => {
  //   const categorizedData = {};
  //   data?.forEach(item => {
  //     if (!categorizedData[item.groupName]) {
  //       categorizedData[item.groupName] = [];
  //     }
  //     categorizedData[item.groupName].push(item);
  //   });
  //   return categorizedData;
  // };
  // console.log(categorizeData(contactData), 'categorizeData');

  // const { mutateAsync: addMessages } = useAddMessages();

  const onSubmit: SubmitHandler<IFormInput> = async (dataVal) => {
    if (dataVal?.receivers?.length > 0) {
      const receiversList = dataVal?.receivers?.flatMap((group) => {
        return categorizeData[group].map((unit) => {
          return unit.contactNumber;
        });
      });
      console.log(receiversList, 'receivers', categorizeData);
      dataVal.receivers = receiversList;
    } else {
      return;
    }
    // const { data, isLoading } = useFetchMessages();
    // addMessages(dataVal);
    if (files.length > 0) {
      if (files[0].type.startsWith('image')) {
        dataVal['media'] = 'image';
      } else if (files[0].type.startsWith('application')) {
        dataVal['media'] = 'application/pdf';
      }
      dataVal['file'] = files[0];
      dataVal["timestamp"] = selectedDateTime ? selectedDateTime : "";
    } else {
      dataVal['media'] = 'text';
      dataVal['file'] = [];
      dataVal['timestamp'] = selectedDateTime ? selectedDateTime : '';
    }
    console.log(dataVal, 'dataval');

    socket.emit('send-message', dataVal);
  };

  const handleChange = (event: SelectChangeEvent<typeof numbers>) => {
    const {
      target: { value }
    } = event;
    setNumbers(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const ErrorDisplay = ({ own }: { own: string }) => {
    return (
      <Grid item sx={{ p: 1 }}>
        <Typography color="error">Invalid {own}</Typography>
      </Grid>
    );
  };

  const handleClose = () => {
    setModalData({ message: '', response: '' });
  };
  console.log(selectedGroups, 'groups');
  const handleToggleChecks = (groupName) => {
    setSelectedGroups((prevSelectedGroups) =>
      prevSelectedGroups.includes(groupName)
        ? prevSelectedGroups.filter((name) => name !== groupName)
        : [...prevSelectedGroups, groupName]
    );
  };

  const getMinDateTime = (date?: string) => {
    if (date) {
      let format = new Date(date)
      format.setMinutes(format.getMinutes() + 5);
      return format.toString();
    }
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 5);
    return currentTime.toString();
  };


  return (
    <Grid style={{ padding: 0, border: "1px solid #eeeee4", borderRadius: "8px", boxShadow: "none" }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12} width={"100%"}>
          <Card>
            <CardHeader title="Whatsapp Messaging" />
            <Divider />
            <CardContent>
              <Box
                component="form"
                sx={{
                  // '& .MuiTextField-root, & .MuiOutlinedInput-root, & .MuiButton-root': {
                  //   // m: 1,
                  //   width: '60ch'
                  // },
                  // '& .MuiButton-root': {
                  //   // m: 1,
                  //   width: '20ch'
                  // },
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2,
                  width: '100%'
                }}
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  <Grid
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 2,
                      justifyContent: 'center'
                    }}
                  >
                    <TextField
                      id="outlined-select"
                      {...register('sender', { required: true })}
                      select
                      label="Select Sender"
                      defaultValue={''}
                      sx={{ width: { xs: '100%', sm: '50%' } }}
                    // onChange={handleChange}
                    // helperText="Please select sender number"
                    >
                      {senderData?.map((option) => (
                        <MenuItem
                          key={option.connectionNumber}
                          value={option.connectionNumber}
                        >
                          {option.connectionNumber}
                        </MenuItem>
                      ))}
                    </TextField>
                    <DateTimePicker
                      label="Schedule Message"
                      value={selectedDateTime}
                      onChange={(newValue) => setSelectedDateTime(newValue)}
                      minDateTime={getMinDateTime()}
                      renderInput={(props) => (
                        <TextField {...props} sx={{ width: '60%' }} />
                      )}
                    />
                    {errors.sender && <ErrorDisplay own={'Sender'} />}
                  </Grid>
                  <div>
                    <TextField
                      ref={ref}
                      id="outlined-password-input"
                      {...register('message', { required: true })}
                      label="Message"
                      type="text"
                      multiline
                      rows={4} // Adjust the number of visible rows as needed
                      defaultValue={''}
                      fullWidth
                    />
                    {errors.message && <ErrorDisplay own={'Message'} />}
                  </div>
                  <Grid>
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-checkbox-label">
                        Select Receiver
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        {...register('receivers', { required: true })}
                        multiple
                        value={numbers}
                        onChange={handleChange}
                        input={<OutlinedInput label="Select Receiver" />}
                        renderValue={() => selectedGroups.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {Object.keys(categorizeData)?.map((gname, ind) => (
                          <MenuItem key={ind} value={gname} >
                            <Checkbox
                              checked={selectedGroups.includes(gname)}
                              onChange={() => handleToggleChecks(gname)}
                            />
                            <ListItemText primary={gname} onClick={(event) => event.preventDefault()} />
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.receivers && <ErrorDisplay own={'Receiver'} />}
                    </FormControl>
                  </Grid>
                  {!isSmallerThanSm && <Grid
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'column' },
                      width: '100%'
                    }} >
                    <Button sx={{ margin: 1 }} variant="contained" type="submit">
                      Send Message
                    </Button>
                  </Grid>}
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <Grid sx={{ width: '100%' }}>
                    <DropzoneDialogExample files={files} setFiles={setFiles} />
                  </Grid>
                </Grid>
                {isSmallerThanSm && <Grid
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'column' },
                    width: '100%',
                  }} >
                  <Button sx={{ margin: 1 }} variant="contained" type="submit">
                    Send Message
                  </Button>
                </Grid>}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default index;
// Whatsapp Page