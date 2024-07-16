import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTable, useGroupBy, useExpanded } from 'react-table';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, CircularProgress, Grid, TableContainer, TableHead, TextField, Typography } from '@mui/material';
import { useGetContactDetails, useGetContactDetailsE } from 'src/services/fetchGroups';
import loggedInUser from 'src/util/loggedInUser';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function useControlledState(state, { instance }) {
    return React.useMemo(() => {
        if (state.groupBy.length) {
            return {
                ...state,
                hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter(
                    (d, i, all) => all.indexOf(d) === i
                ),
            }
        }
        return state
    }, [state])
}


function Table({ columns, data }) {
    const [currentPage, setCurrentPage] = useState(0)
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
    } = useTable(
        {
            columns,
            data,
        },
        useGroupBy,
        useExpanded,
        // Our custom plugin to add the expander column
        hooks => {
            hooks.useControlledState.push(useControlledState)
            hooks.visibleColumns.push((columns, { instance }) => {
                if (!instance.state.groupBy.length) {
                    return columns
                }
                return [
                    {
                        id: 'expander', // Make sure it has an ID
                        // Build our expander column
                        Header: ({ allColumns, state: { groupBy } }) => {
                            return groupBy.map(columnId => {
                                const column = allColumns.find(d => d.id === columnId)

                                return (
                                    <span key={columnId} {...column.getHeaderProps()}>
                                        {column.canGroupBy ? (
                                            // If the column can be grouped, let's add a toggle
                                            <span {...column.getGroupByToggleProps()}>
                                                {column.isGrouped ? '-> ' : '<- '}
                                            </span>
                                        ) : null}
                                        {column.render('Header')}{' '}
                                    </span>
                                )
                            })
                        },
                        Cell: ({ row }) => {
                            if (row.canExpand) {
                                const groupedCell = row.allCells.find(d => d.isGrouped)

                                return (
                                    <Grid sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                                        {...row.getToggleRowExpandedProps({
                                            style: {
                                                // We can even use the row.depth property
                                                // and paddingLeft to indicate the depth
                                                // of the row
                                                paddingLeft: `${row.depth * 2}rem`,
                                            },
                                        })}
                                    >
                                        {row.isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />} {groupedCell.render('Cell')}{' '}
                                        ({row.subRows.length})
                                    </Grid>
                                )
                            }

                            return null
                        },
                    },
                    ...columns,
                ]
            })
        }
    )

    const firstPageRows = rows.slice(currentPage, currentPage + 10)
    const handlePagination = (position: string) => {
        console.log(currentPage, rows.length);
        if (position === "back") {
            if (currentPage > 0) setCurrentPage((prev) => prev - 10)
        } else {
            if (currentPage + 10 != rows.length) setCurrentPage((prev) => prev + 10)
        }
    }
    useEffect(() => {
        if (state.groupBy.length > 0) {
            setCurrentPage(0)
        }
    }, [state])

    return (
        <TableContainer>
            {/* <pre>
                <code>{JSON.stringify({ state }, null, 2)}</code>
            </pre>
            <Legend /> */}
            <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '10px' }}>
                <thead>
                    {headerGroups.map((headerGroup, index) => (
                        <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, idx) => (
                                <th key={idx} {...column.getHeaderProps()} style={{
                                    padding: '8px',
                                    borderBottom: '2px solid #ccc',
                                    backgroundColor: '#f2f2f2',
                                    fontWeight: 'bold',
                                    borderRadius: '5px',
                                    textAlign: 'left',
                                    fontSize: '14px',
                                }}>
                                    {column.canGroupBy ? (
                                        // If the column can be grouped, let's add a toggle
                                        <span {...column.getGroupByToggleProps()}>
                                            {column.isGrouped ? '- ' : '<- '}
                                        </span>
                                    ) : null}
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {firstPageRows?.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr key={i} {...row.getRowProps()}>
                                {row.cells.map((cell, ix) => {
                                    return (
                                        <td
                                            key={ix}
                                            // For educational purposes, let's color the
                                            // cell depending on what type it is given
                                            // from the useGroupBy hook
                                            {...cell.getCellProps()}
                                            style={{
                                                background: cell.isGrouped
                                                    ? '#0aff0082'
                                                    : cell.isAggregated
                                                        ? '#ffa50078'
                                                        : cell.isPlaceholder
                                                            ? '#ff000042'
                                                            : 'white',
                                                // background: 'white'
                                            }}
                                        >
                                            {cell.isAggregated
                                                ? // If the cell is aggregated, use the Aggregated
                                                // renderer for cell
                                                cell.render('Aggregated')
                                                : cell.isPlaceholder
                                                    ? null // For cells with repeated values, render null
                                                    : // Otherwise, just render the regular cell
                                                    cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <br />
            {/* <div>Showing the first 100 results of {rows.length} rows</div> */}
            <Grid>
                <Button disabled={state.groupBy.length > 0} onClick={() => handlePagination("back")}><KeyboardArrowLeftIcon /></Button>
                <Button disabled={state.groupBy.length > 0} onClick={() => handlePagination("front")}><KeyboardArrowRightIcon /></Button>
            </Grid>
        </TableContainer >
    )
}


function Table2({ addContactBridge, setAddContactBridge, isEmployee }) {
    const columns = React.useMemo(
        () => {
            if (isEmployee) {
                return [
                    {
                        Header: 'Name',
                        columns: [
                            {
                                Header: 'Employee Code',
                                accessor: 'employeeCode',
                            },
                            {
                                Header: 'First Name',
                                accessor: 'firstName',
                                aggregate: 'count',
                                Aggregated: ({ value }) => `${value} Names`,
                            },
                            {
                                Header: 'Last Name',
                                accessor: 'lastName',
                                aggregate: 'uniqueCount',
                                Aggregated: ({ value }) => `${value} Names`,
                            },
                            {
                                Header: 'Designation',
                                accessor: 'designation',
                                aggregate: 'uniqueCount',
                                Aggregated: ({ value }) => `${value} Designation`,
                            },
                            {
                                Header: 'Salary',
                                accessor: 'salary',
                            },
                        ],
                    },
                    {
                        Header: 'Info',
                        columns: [
                            {
                                Header: 'Contact Number',
                                accessor: 'contactNumber',
                                aggregate: 'uniqueCount',
                                Aggregated: ({ value }) => `${value} Contacts`,
                            },
                            {
                                Header: 'Group Name',
                                accessor: 'groupName',
                                aggregate: 'uniqueCount',
                                Aggregated: ({ value }) => `${value} Groups`,
                            },
                        ],
                    },
                    {
                        Header: 'Action',
                        columns: [
                            {
                                Header: 'Action',
                                accessor: 'action',
                                Cell: ({ row }) => (
                                    <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                        <Button size='small'>Edit</Button>
                                        <Button size="small" >Delete</Button>
                                    </Grid>
                                ),
                            },
                        ]
                    }
                ];
            } else {
                return [
                    {
                        Header: 'Name',
                        columns: [
                            {
                                Header: 'Student Code',
                                accessor: 'studentCode',
                            },
                            {
                                Header: 'First Name',
                                accessor: 'firstName',
                                aggregate: 'count',
                                Aggregated: ({ value }) => `${value} Names`,
                            },
                            {
                                Header: 'Last Name',
                                accessor: 'lastName',
                                aggregate: 'uniqueCount',
                                Aggregated: ({ value }) => `${value} Unique Names`,
                            },
                            {
                                Header: 'Fees',
                                accessor: 'fees',
                            },
                        ],
                    },
                    {
                        Header: 'Info',
                        columns: [
                            {
                                Header: 'Contact Number',
                                accessor: 'contactNumber',
                                aggregate: 'uniqueCount',
                                Aggregated: ({ value }) => `${value} Contacts`,
                            },
                            {
                                Header: 'Group Name',
                                accessor: 'groupName',
                            },
                        ],
                    },
                    {
                        Header: 'Action',
                        columns: [
                            {
                                Header: 'Action',
                                accessor: 'action',
                                Cell: ({ row }) => (
                                    <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                        <Button size='small'>Edit</Button>
                                        <Button size="small" >Delete</Button>
                                    </Grid>
                                ),
                            },
                        ]
                    }
                ];
            }
        },
        [isEmployee]
    );


    const { data: contactData, refetch: refetchContactDetails, isLoading, isError } = useGetContactDetails()
    const { data: contactDataE, refetch: refetchContactDetailsE, isLoading: LoadingE, isError: ErrorE } = useGetContactDetailsE()

    useEffect(() => {
        if (isEmployee) {
            setAddContactBridge(contactDataE)
        } else {
            setAddContactBridge(contactData)
        }
    }, [isEmployee, contactData, contactDataE])
    // const data = React.useMemo(() => makeData(20), [])
    console.log(contactData, 'contac');

    return (
        <Styles>
            {isLoading ? <CircularProgress /> :
                addContactBridge?.length > 0 && <Table columns={columns} data={addContactBridge} />
            }
        </Styles>
    )
}

export default Table2