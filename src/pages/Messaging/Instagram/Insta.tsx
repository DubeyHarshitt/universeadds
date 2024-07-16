import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
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
import { lazy, useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import DropzoneDialogExample from 'src/components/DropZone';
import BasicTable from 'src/components/Table';
import RecentOrders from 'src/content/applications/Transactions/RecentOrders';
import { useAddMessages, useFetchMessages } from 'src/services/fetchMessages';
import io from 'socket.io-client';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useGetContactDetails } from 'src/services/fetchGroups';
import loggedInUser from 'src/util/loggedInUser';
import { useFetchSenders } from 'src/services/fetchNewSender';
import { useScheduleInstagram } from 'src/services/instagramMessages';
import { axiosInstance } from 'src/services/axiosInstance';
import { Loader } from 'src/router';
import VerifyIcon from 'src/svgAssests/VerifyIcon';
import ErrorIcon from 'src/svgAssests/ErrorIcon';

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
export interface IFormInputInsta {
  sender: string;
  description: string;
  file: File;
  scheduledTime: string | undefined;
}


type ScheduleResponse = {
  centerIcon: JSX.Element | null;
  message: string;
};
function index() {

  const [loader, setLoader] = useState<boolean>(false)
  const [files, setFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalData, setModalData] = useState<ScheduleResponse>({
    centerIcon: <VerifyIcon />,
    message: ''
  });
  const [selectedDateTime, setSelectedDateTime] = useState<string>();
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [isSmallerThanSm, setIsSmallerThanSm] = useState(window.innerWidth < 960);

  const Modal = Loader(
    lazy(() => import('src/components/Modal/index'))
  );


  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormInputInsta>();

  const {
    data: contactData,
    refetch: refetchContactDetails,
    isLoading,
    isError
  } = useGetContactDetails();
  const {
    data: senderData,
    refetch: refetchSenderData,
    isLoading: isLoadingSenders,
    isError: isErrorSenders
  } = useFetchSenders();

  const { mutate } = useScheduleInstagram();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallerThanSm(window.innerWidth < 960);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categorizeData = useMemo(() => {
    const formatData = {};
    contactData?.forEach((item) => {
      if (!formatData[item.groupName]) {
        formatData[item.groupName] = [];
      }
      formatData[item.groupName].push(item);
    });
    return formatData;
  }, [contactData]);

  console.log(senderData, 'senderData');

  const onSubmit: SubmitHandler<IFormInputInsta> = async (dataVal) => {
    setLoader(true)
    const formData = new FormData()
    formData.append('file', files[0].file)
    formData.append('scheduledTime', selectedDateTime)
    formData.append('userName', dataVal.sender)
    formData.append('description', dataVal.description)
    mutate(formData, {
      onSuccess: (data) => {
        setLoader(false)
        console.log(data, 'dataFound');
        setModalData({ centerIcon: <VerifyIcon />, message: data?.message })
        setModalOpen(true)
      },
      onError: (error) => {
        setLoader(false)
        console.log(error, 'errorFound');
        setModalData({ centerIcon: <ErrorIcon />, message: "Error In Scheduling" })
        setModalOpen(true)
      }
    });
  };


  const getMinDateTime = (date?: string) => {
    if (date) {
      let format = new Date(date);
      format.setMinutes(format.getMinutes() + 5);
      return format.toString();
    }
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 5);
    return currentTime.toString();
  };

  return (
    <Container
      maxWidth="xl"
      style={{
        padding: 0,
        border: '1px solid #eeeee4',
        borderRadius: '8px',
        boxShadow: 'none'
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Instagram Messaging" />
            <Divider />
            <CardContent>
              <Box
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2,
                  width: '100%'
                }}
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* Left Grid */}
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    justifyContent: 'center'
                  }}
                >
                  {/* UserName Field */}
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
                    {["test_universeads"]?.map((option) => (
                      <MenuItem
                        key={option}
                        value={option}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    id="post-description"
                    label="Post Description"
                    type="text"
                    multiline
                    rows={4}
                    defaultValue={''}
                    fullWidth
                    {...register('description', { required: true })}
                  />
                  <DateTimePicker
                    label="Schedule Time"
                    value={selectedDateTime}
                    onChange={(newValue) => setSelectedDateTime(newValue)}
                    minDateTime={getMinDateTime()}
                    renderInput={(props) => (
                      <TextField {...props} sx={{ width: '100%' }} />
                    )}
                  />
                  {!isSmallerThanSm && <Grid
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'column' },
                      width: '100%'
                    }} >
                    <Button sx={{ margin: 1 }} variant="contained" type="submit" disabled={loader}>
                      Send Message {loader && <Grid sx={{ display: 'flex', justifyContent: 'center', px: 1 }}><CircularProgress size={20} sx={{ color: 'gray' }} /></Grid>}
                    </Button>
                  </Grid>}

                </Grid>
                {/* Right Grid */}
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
                    <DropzoneDialogExample allowedType={"image/jpeg, image/jpg"} files={files} setFiles={setFiles} />
                  </Grid>

                  {isSmallerThanSm && <Grid
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'column' },
                      width: '100%',
                      py: 2
                    }} >
                    <Button sx={{ margin: 1 }} variant="contained" type="submit">
                      Send Message
                    </Button>
                  </Grid>}
                  <Modal open={modalOpen} setOpen={setModalOpen} centerIcon={modalData.centerIcon} message={modalData.message} />
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
export default index;
// Instagram Page

