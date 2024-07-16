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
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import QRCode from 'qrcode.react';
import io from "socket.io-client";
import axios, { AxiosResponse } from 'axios';
import { number } from 'prop-types';
import { lazy, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import DropzoneDialogExample from 'src/components/DropZone';
import BasicTable from 'src/components/Table';
import RecentOrders from 'src/content/applications/Transactions/RecentOrders';
import { useAddMessages, useFetchMessages } from 'src/services/fetchMessages';
import { useAddNewSender, verifyNewSender } from 'src/services/fetchNewSender';
import Countdown from 'react-countdown';
import VerifyIcon from 'src/svgAssests/VerifyIcon';
import ErrorIcon from 'src/svgAssests/ErrorIcon';
import { Loader } from 'src/router';
import loggedInUser from 'src/util/loggedInUser';

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
export interface INewSenderInput {
  owner: string,
  connectionNumber: string;
}

const token = localStorage?.getItem("token");
const socket = (io as any).connect(`${process.env.REACT_APP_WHATSAPP_HOST}`, {
  extraHeaders: {
    Authorization: `Bearer ${token}`,
  },
});


function NewSender() {

  const [qrcode, setQrCode] = useState<string>("");
  const [requestVerify, setRequestVerify] = useState<Boolean>(false)
  const [verificationNumber, setVerificationNumber] = useState<string>()
  const [requestVerifyData, setRequestVerifyData] = useState<Boolean>()
  const [requestingQr, setRequestingQr] = useState<Boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<INewSenderInput>();

  const ContactList = Loader(
    lazy(() => import('src/pages/Messaging/ContactsList/index'))
  )
  const { mutateAsync: addNewSender, isLoading: loadingQrCode } = useAddNewSender();
  const { data, refetch: handleVerifySender, isLoading: verificationLoading, isError } = verifyNewSender(verificationNumber);

  const createSessionForWhatsapp = (numb) => {
    socket.emit("createSession", {
      id: numb,
    });
  };

  const addingSender = async (dataVal: INewSenderInput) => {
    if (dataVal.owner && dataVal.connectionNumber) {
      addNewSender(dataVal)
    }
  }

  useEffect(() => {
    socket.emit("connected", "Hello from client");
    socket.on("qr", (data) => {
      const { qr } = data;
      console.log("QR RECEIVED", qr);
      setQrCode(qr);
      setRequestingQr(false)
    });

    socket.on("ready", (data) => {
      setQrCode("")
      setRequestVerify(true)
      setRequestVerifyData(true)
      setTimeout(() => {
        setRequestVerify(false)
        setRequestVerifyData(false)
      }, 8000);
      const dataNew: INewSenderInput = {
        owner: loggedInUser(),
        connectionNumber: data.id,
      }
      addingSender(dataNew)
    });
    socket.on("createSession-error", (err) =>
      console.log("createSession-error" + err)
    )
  }, []);



  const handleVerify = () => {
    handleVerifySender()
    setRequestVerify(false)
    // setRequestVerifyData(true)
    // setTimeout(() => {
    //   setRequestVerifyData(false)
    // }, 3000);
  }

  const onSubmit: SubmitHandler<INewSenderInput> = async (dataVal) => {
    setVerificationNumber(dataVal.connectionNumber)
    setRequestingQr(true)
    createSessionForWhatsapp(dataVal.connectionNumber)
    // await addNewSender(dataVal).then((res) => {
    //   console.log(res.data);
    //   setQrCode(res.data)
    // });
  };


  const ErrorDisplay = ({ own }: { own: string }) => {
    return (
      <Grid item sx={{ p: 1 }}>
        <Typography color="error">Invalid {own}</Typography>
      </Grid>
    );
  };

  return (
    <Container maxWidth="xl">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
        marginTop={1}
      >
        <Grid item xs={12}>
          <Card>
            <CardHeader title="New Sender" />
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
                  flexDirection: 'row',
                  gap: 2,
                  width: '100%'
                }}
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Grid
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '50%'
                  }}
                >
                  <div>
                    <TextField
                      id="outlined-input"
                      {...register('connectionNumber', { required: true })}
                      label="Register new sender incl. '91'"
                      type="text"
                      defaultValue={''}
                      fullWidth
                    />
                    {errors.connectionNumber && (
                      <ErrorDisplay own={'Connection Number'} />
                    )}
                  </div>
                  <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Button sx={{ margin: 0.5, width: '50%' }} variant="contained" size="small" type="submit">
                      Send Request
                    </Button>
                    {/* {requestVerify &&
                      <Button sx={{ margin: 0.5, width: '50%' }} variant="outlined" size="small" onClick={handleVerify}>
                        Request for verification
                      </Button>
                    } */}
                  </Grid>
                </Grid>
                {requestingQr && <Grid sx={{ width: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}><CircularProgress /><Typography>Requesting QrCode ⏳</Typography></Grid>}
                {qrcode != "" && (
                  <Grid
                    sx={{
                      width: '40%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {<QRCode value={qrcode} />}
                    <Typography>
                      Note: Check Your Whatsapp / Linked Devices for
                      verification
                    </Typography>
                    <Countdown
                      date={Date.now() + 10000 * 6}
                      intervalDelay={0}
                      precision={3}
                      renderer={(props) => {
                        const totalSeconds = Math.floor(props.total / 1000);
                        const minutes = Math.floor(totalSeconds / 60);
                        const seconds = totalSeconds % 60;
                        if (seconds == 0) {
                          setQrCode("");
                        }
                        return (
                          <div>
                            The Above QrCode is valid till -{' '}
                            {minutes < 10 ? '0' : ''}
                            {minutes}:{seconds < 10 ? '0' : ''}
                            {seconds}
                          </div>
                        );
                      }}
                    />
                  </Grid>)}
                {requestVerify && (requestVerifyData ?
                  <Grid
                    sx={{
                      width: '40%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <VerifyIcon />
                    <Typography color={"#00b300"}>Sender verified successfully</Typography>
                  </Grid> :
                  <Grid
                    sx={{
                      width: '40%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <ErrorIcon />
                    <Typography color={"#ff0000"}>Verification unsuccessfull</Typography>
                  </Grid>
                )}
              </Box>
            </CardContent>
            <Divider />
            <ContactList />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default NewSender;
