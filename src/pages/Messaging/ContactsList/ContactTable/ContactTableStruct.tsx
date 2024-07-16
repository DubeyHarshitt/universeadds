import { FC, ChangeEvent, useState, Component } from 'react';
import { add, format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  Button,
  Grid,
  TextField
} from '@mui/material';

import Label from 'src/components/Label';
import { CryptoOrder, CryptoOrderStatus } from 'src/models/crypto_order';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import { SubmitHandler, useForm } from 'react-hook-form';
// import { useAddGroup } from 'src/services/fetchGroups';
import loggedInUser from 'src/util/loggedInUser';
import { ContactGroups } from './ContactTableSchema';

export interface IGroupCreateForm {
  owner: number;
  groupName: string;
}

interface RecentOrdersTableProps {
  className?: string;
  cryptoOrders: CryptoOrder[];
  data: ContactGroups[];
}

interface Filters {
  status?: CryptoOrderStatus;
}

const getStatusLabel = (cryptoOrderStatus: CryptoOrderStatus): JSX.Element => {
  const map = {
    failed: {
      text: 'Failed',
      color: 'error'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    },
    pending: {
      text: 'Pending',
      color: 'warning'
    }
  };

  const { text, color }: any = map[cryptoOrderStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  cryptoOrders: CryptoOrder[],
  filters: Filters
): CryptoOrder[] => {
  return cryptoOrders.filter((cryptoOrder) => {
    let matches = true;

    if (filters.status && cryptoOrder.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  cryptoOrders: CryptoOrder[],
  page: number,
  limit: number
): CryptoOrder[] => {
  return cryptoOrders.slice(page * limit, page * limit + limit);
};

const ContactTableStruct: FC<RecentOrdersTableProps> = ({
  cryptoOrders,
  data
}) => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [addGroup, setAddGroup] = useState(false);
  const [groupError, SetGroupError] = useState({ error: false, message: '' });
  const [groupData, SetGroupData] = useState({ success: false, data: {} });
  const [finalGroup, setFinalGroup] = useState<CryptoOrder[]>(cryptoOrders);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  console.log(finalGroup, 'final');

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'completed',
      name: 'Completed'
    },
    {
      id: 'pending',
      name: 'Pending'
    },
    {
      id: 'failed',
      name: 'Failed'
    }
  ];

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedCryptoOrders(
      event.target.checked
        ? cryptoOrders.map((cryptoOrder) => cryptoOrder.id)
        : []
    );
  };

  const handleSelectOneCryptoOrder = (
    event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: string
  ): void => {
    if (!selectedCryptoOrders.includes(cryptoOrderId)) {
      setSelectedCryptoOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId
      ]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredCryptoOrders = applyFilters(cryptoOrders, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    page,
    limit
  );
  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 &&
    selectedCryptoOrders.length < cryptoOrders.length;
  const selectedAllCryptoOrders =
    selectedCryptoOrders.length === cryptoOrders.length;
  const theme = useTheme();

  const def = [{ id: 0, owner: '0', groupName: 'Group 0' }];
  // const { mutateAsync: addGroupData } = useAddGroup();

  const handleSubmitAddGroup: SubmitHandler<IGroupCreateForm> = async (
    dataVal
  ) => {
    const data = {
      owner: loggedInUser(),
      groupName: dataVal.groupName
    };
    // addGroupData(data)
    //   .then((res) => {
    //     if (res) {
    //       const tem = finalGroup;
    //       tem.push(res);
    //       setFinalGroup(tem);
    //     }
    //   })
    //   .catch((err) => {
    //     SetGroupError({ error: true, message: err.response.data.message });
    //   });
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IGroupCreateForm>();

  const handleAddGroup = () => {
    setAddGroup(!addGroup)
  };

  const GroupComponent = ({
    addGroup,
    register,
    errors,
    groupError,
    handleSubmit,
    handleSubmitAddGroup
  }) => {
    if (addGroup) {
      return (
        <Box
          style={{
            padding: 20,
            backgroundColor: '#f9f9f9',
            borderRight: '3px solid #5cb85c',
            borderLeft: '3px solid #5cb85c',
            borderBottom: '1px solid #ededed ',
            borderTop: '1px solid #ededed ',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Grid>
            <TextField
              id="outlined-required"
              label="Group Name"
              {...register('groupName', {
                required: '* Group Name is Required'
              })}
            />
            {errors.groupName && (
              <Typography color={'error'}>
                {errors.groupName.message}
              </Typography>
            )}
            {groupError.error && (
              <Typography color={'error'}>{groupError.message}</Typography>
            )}
          </Grid>
          <Grid
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              gap: 10,
              alignItems: 'center'
            }}
          >
            <Typography>Total Contacts : 0</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleSubmit(handleSubmitAddGroup)}
            >
              + Save Group
            </Button>
          </Grid>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box
              width={300}
              sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
            >
              <Button variant="outlined" fullWidth onClick={handleAddGroup}>
                + Add Group
              </Button>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Contact List"
        />
      )}
      <Divider />
      <GroupComponent
        addGroup={addGroup}
        register={register}
        errors={errors}
        groupError={groupError}
        handleSubmit={handleSubmit}
        handleSubmitAddGroup={handleSubmitAddGroup}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllCryptoOrders}
                  indeterminate={selectedSomeCryptoOrders}
                  onChange={handleSelectAllCryptoOrders}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Status</TableCell>
              {/* <TableCell>Source</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Status</TableCell> */}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ width: '100%' }}>
            {console.log(finalGroup, 'finallist', addGroup)}
            {paginatedCryptoOrders?.map((group, idx) => {
              return (
                <TableRow
                  hover
                  key={idx}
                // selected={isCryptoOrderSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                    // checked={isCryptoOrderSelected}
                    // onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    //   handleSelectOneCryptoOrder(event, cryptoOrder.id)
                    // }
                    // value={isCryptoOrderSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {group.groupName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {format(new Date(), 'MMMM dd yyyy')}
                    </Typography>
                  </TableCell>
                  {/* <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        Total Contacts: {group.totalContacts}
                      </Typography>
                    </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredCryptoOrders.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

ContactTableStruct.propTypes = {
  cryptoOrders: PropTypes.array.isRequired
};

ContactTableStruct.defaultProps = {
  cryptoOrders: []
};

export default ContactTableStruct;
