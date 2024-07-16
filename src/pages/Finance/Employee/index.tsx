import React, { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Typography
} from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useGetContactDetailsE } from "src/services/fetchGroups";
import { Header } from "src/util/commonElem";


interface Employee {
    empId: string;
    // name: string;
    firstName: string;
    lastName: string;
    monthlySalary: string;
    designation: string;
    contact: string;
    amountToBePaid: number;
}

const Index: React.FC = () => {
    const [expanded, setExpanded] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [name, setName] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [empId, setEmpId] = useState<string>('');
    const [monthlySalary, setMonthlySalary] = useState<string>('');
    const [designation, setDesignation] = useState<string>('');
    const [contact, setContact] = useState<string>('');

    // const [employees, setEmployees] = useState<Employee[]>([
    //     { empId: 'E001', firstName: 'John', lastName: 'Doe', monthlySalary: '5000', designation: 'Manager', contact: '911234567890', amountToBePaid: 0 },
    //     { empId: 'E002', firstName: 'Jane', lastName: 'Smith', monthlySalary: '4500', designation: 'Developer', contact: '911234567891', amountToBePaid: 0 },
    //     { empId: 'E003', firstName: 'Alice', lastName: 'Johnson', monthlySalary: '4000', designation: 'Designer', contact: '911234567892', amountToBePaid: 0 },
    //     { empId: 'E008', firstName: 'Frank', lastName: 'Lee', monthlySalary: '4900', designation: 'Manager', contact: '911234567897', amountToBePaid: 0 },
    //     { empId: 'E009', firstName: 'Grace', lastName: 'Brown', monthlySalary: '4600', designation: 'Developer', contact: '911234567898', amountToBePaid: 0 },
    //     { empId: 'E010', firstName: 'Hank', lastName: 'Davis', monthlySalary: '5300', designation: 'Designer', contact: '911234567899', amountToBePaid: 0 },
    //     { empId: 'E011', firstName: 'Ivy', lastName: 'Lee', monthlySalary: '5400', designation: 'Manager', contact: '911234567800', amountToBePaid: 0 },
    //     { empId: 'E012', firstName: 'Jack', lastName: 'Wilson', monthlySalary: '4100', designation: 'Developer', contact: '911234567801', amountToBePaid: 0 },
    //     { empId: 'E014', firstName: 'Liam', lastName: 'Walker', monthlySalary: '5100', designation: 'Manager', contact: '911234567803', amountToBePaid: 0 },
    //     { empId: 'E015', firstName: 'Mia', lastName: 'Scott', monthlySalary: '4300', designation: 'Developer', contact: '911234567804', amountToBePaid: 0 },
    //     { empId: 'E018', firstName: 'Parker', lastName: 'Allen', monthlySalary: '4600', designation: 'Developer', contact: '911234567807', amountToBePaid: 0 },
    //     { empId: 'E019', firstName: 'Quinn', lastName: 'Perez', monthlySalary: '4700', designation: 'Designer', contact: '911234567808', amountToBePaid: 0 },
    //     { empId: 'E020', firstName: 'Riley', lastName: 'Thomas', monthlySalary: '4800', designation: 'Manager', contact: '911234567809', amountToBePaid: 0 },
    // ]);
    

    const { data: contactData, refetch, isLoading, isError } = useGetContactDetailsE();

    useEffect(() => {
        if (contactData) {
            const mappedEmployee = contactData.map((emp) => ({
                empId: emp.employeeCode,
                // name: `${emp.firstName} ${emp.lastName}`,
                firstName : emp.firstName,
                lastName: emp.lastName,
                monthlySalary: emp.salary,
                designation: emp.designation,
                contact: emp.contactNumber,
                amountToBePaid: 0,
            }));
            setEmployees(mappedEmployee);
        }
    }, [contactData]);

    const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
    const [downloadEmpId, setDownloadEmpId] = useState<string | null>(null);
    const [shareEmpId, setShareEmpId] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewContent, setPreviewContent] = useState<string>('');
    const [filter, setFilter] = useState<string>('');
    const [designationFilter, setDesignationFilter] = useState<string>('');
    const [minSalaryFilter, setMinSalaryFilter] = useState<string>('');
    const [maxSalaryFilter, setMaxSalaryFilter] = useState<string>('');

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);

    //BACKEND CALL FOR GETTING DATA Employees:True | Student:False
    // const {
    //     data: contactData,
    //     refetch: refetchContactDetails,
    //     isLoading,
    //     isError
    // } = useGetContactDetails();

    const handleSelect = () => {
        const newEmployee: Employee = { empId, firstName, lastName, monthlySalary, designation, contact, amountToBePaid: 0 };
        setEmployees([...employees, newEmployee]);
        clearInputs();
    };

    const handleEdit = (empId: string) => {
        const employee = employees.find(e => e.empId === empId);
        if (employee) {
            setEmpId(employee.empId);
            // setName(employee.name);
            setFirstName(employee.firstName);
            setLastName(employee.lastName);
            setMonthlySalary(employee.monthlySalary);
            setDesignation(employee.designation);
            setContact(employee.contact);
            setEditingEmpId(empId);
            // setShareEmpId(empId);
        }
    };

    const handleSave = () => {
        if (editingEmpId) {
            const updatedEmployees = employees.map(emp => {
                if (emp.empId === editingEmpId) {
                    return {
                        empId,
                        firstName,
                        lastName,
                        monthlySalary,
                        designation,
                        contact,
                        amountToBePaid: parseFloat(emp.amountToBePaid.toString()),
                    };
                }
                return emp;
            });
            setEmployees(updatedEmployees);
            clearInputs();
            setEditingEmpId(null);
        }
    };

    const handleInputChange = (empId: string, field: keyof Employee, value: string | number) => {
        const updatedEmployees = employees.map(emp => {
            if (emp.empId === empId) {
                // Parse value to ensure it's treated as a number
                return {
                    ...emp,
                    [field]: field === 'amountToBePaid' ? parseFloat(value.toString()) : value,
                };
            }
            return emp;
        });
        setEmployees(updatedEmployees);

        if (field === 'amountToBePaid' && value !== '' && !isNaN(Number(value))) {
            setShareEmpId(empId);
        } else {
            setShareEmpId(null);
        }
    };

    const getMonthInWords = (month) => {
        const monthsInWords = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        return monthsInWords[month - 1]; // Adjust for zero-based index
    };

    const generatePDF = (employee: Employee) => {
        const doc = new jsPDF();
        const currentDate = new Date();
        const companyName = "Financial Management System";

        doc.setFontSize(16);
        doc.text(companyName, 105, 15, { align: 'center' });

        doc.setFontSize(14);
        doc.text('Salary Slip', 105, 25, { align: 'center' });

        // Add employee details
        doc.setFontSize(12);
        doc.text(`Employee Name: ${employee.firstName} ${employee.lastName}`, 10, 50);
        doc.text(`Designation: ${employee.designation}`, 10, 58);
        doc.text(`Month & Year: ${getMonthInWords(currentDate.getMonth() + 1)}, ${currentDate.getFullYear()}`, 10, 66);

        doc.setFontSize(12);
        const tableColumn = ["Monthly Salary", "Amount Paid"];
        const tableRows = [[employee.monthlySalary, employee.amountToBePaid]];

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 70
        });

        doc.text(`Amount paid (in words): `, 10, 95);

        doc.text('Signature of the Employee ', 150, 105);

        return doc;
    };



    const handleShare = (empId: string) => {
        const employee = employees.find(e => e.empId === empId);
        if (employee) {
            const doc = generatePDF(employee);


            const pdfContent = doc.output('datauristring');
            setPreviewContent(pdfContent);
            setPreviewOpen(true);
            setDownloadEmpId(empId);
        }
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
        setDownloadEmpId(null);
    };

    const handleDownloadPDF = (empId: string | null) => {
        if (empId) {
            const employee = employees.find(e => e.empId === empId);
            if (employee) {
                const doc = generatePDF(employee);
                doc.save("employee_details.pdf");
            }
        }
    };

    const handleSendWhatsapp = (empId: string): void => {
        const employee = employees.find(e => e.empId === empId);
        if (employee) {
            const message = `Hello ${employee.firstName} ${employee.lastName}, I would like to share my salary slip with you. Can you please help me?`;
            alert(message);
        }
    };

    const clearInputs = () => {
        // setName('');
        setFirstName('');
        setLastName('');
        setEmpId('');
        setMonthlySalary('');
        setDesignation('');
        setContact('');
    };

    const filteredEmployees = employees.filter(employee => {
        const matchesNameOrId = (
            `${employee.firstName} ${employee.lastName} ${employee.empId}`.toLowerCase()
        ).includes(filter.toLowerCase()) || employee.empId.toLowerCase().includes(filter.toLowerCase());
        const matchesDesignation = employee.designation.toLowerCase().includes(designationFilter.toLowerCase());
        const matchesSalaryRange = (!minSalaryFilter || parseFloat(employee.monthlySalary) >= parseFloat(minSalaryFilter)) &&
            (!maxSalaryFilter || parseFloat(employee.monthlySalary) <= parseFloat(maxSalaryFilter));

        return matchesNameOrId && matchesDesignation && matchesSalaryRange;
    });

    const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChange = () => {
        setExpanded(!expanded);
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading employee data</div>;


    return (
        <Card sx={{ marginBottom: 10, boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <CardHeader title={<Header name={"Employee"} />} />
            <Divider />
            <CardContent sx={{ padding: 0 }}>
                {/* <Accordion expanded={expanded} onChange={handleChange}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{editingEmpId === null ? 'Add Employee' : 'Edit Employee'}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Employee ID"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Monthly Salary"
                            value={monthlySalary}
                            onChange={(e) => setMonthlySalary(e.target.value)}
                            type="number"
                            inputProps={{ step: "0.01" }} // Allow floating-point numbers
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Designation"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Contact include 91"
                            value={contact}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                                if (value.length <= 12) {
                                    setContact(value);
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={editingEmpId === null ? handleSelect : handleSave}
                        >
                            {editingEmpId === null ? 'Add' : 'Save'}
                        </Button>
                    </Grid>
                </Grid>
                </AccordionDetails>
                </Accordion> */}
                <Typography fontWeight={700} sx={{ px: 1.5, py: 1.5 }}>Filter</Typography>
                <Grid container spacing={2} sx={{ px: 1.5, pb: 2 }}>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
                            label="Filter by Name or Employee ID"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
                            label="Filter by Designation"
                            value={designationFilter}
                            onChange={(e) => setDesignationFilter(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
                            label="Min Salary"
                            value={minSalaryFilter}
                            onChange={(e) => setMinSalaryFilter(e.target.value)}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
                            label="Max Salary"
                            value={maxSalaryFilter}
                            onChange={(e) => setMaxSalaryFilter(e.target.value)}
                            type="number"
                        />
                    </Grid>
                </Grid>
                <Divider />
                <div style={{ overflowX: 'auto' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '10%' }}>Actions</TableCell>
                                <TableCell style={{ width: '10%' }}>Employee ID</TableCell>
                                <TableCell colSpan={2} align="center" style={{ width: '25%' }}>
                                    Name</TableCell>
                                <TableCell style={{width: '15% '}}>Monthly Salary</TableCell>
                                <TableCell style={{width: '15% '}}>Designation</TableCell>
                                <TableCell style={{width: '15% '}}>Contact</TableCell>
                                <TableCell style={{width: '30% '}}>Amount to Be Paid</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell />
                                <TableCell />
                                <TableCell style={{ width: '15%' }}>First Name</TableCell>
                                <TableCell style={{ width: '15%' }}>Last Name</TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                    </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((employee, index) => (
                                    <TableRow key={employee.empId}>
                                        <TableCell style={{ width: '10%' }}>
                                            {editingEmpId === employee.empId ? (
                                                <Button color="primary" onClick={handleSave}>Save</Button>
                                            ) : (
                                                <Button color="primary" onClick={() => handleEdit(employee.empId)}><ModeEditIcon /></Button>
                                            )}
                                            {shareEmpId === employee.empId && (
                                                <Button color="secondary" onClick={() => handleShare(employee.empId)}><ShareIcon /></Button>
                                            )}
                                            {downloadEmpId === employee.empId && (
                                                <Button color="secondary" onClick={() => handleDownloadPDF(employee.empId)}>Download</Button>
                                            )}
                                        </TableCell>
                                        <TableCell style={{ width: '10%' }}>
                                            {editingEmpId === employee.empId ? (
                                                <TextField
                                                    value={empId}
                                                    onChange={(e) => setEmpId(e.target.value)}
                                                />
                                            ) : (
                                                <Typography variant="body1">{employee.empId}</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell style={{ width: '10%' }}>
                                            {editingEmpId === employee.empId ? (
                                                <TextField
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                />
                                            ) : (
                                                <Typography variant="body1">{employee.firstName}</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell style={{ width: '10%' }}>
                                            {editingEmpId === employee.empId ? (
                                                <TextField
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                />
                                            ) : (
                                                <Typography variant="body1">{employee.lastName}</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell style={{ width: '15%' }}>
                                            {editingEmpId === employee.empId ? (
                                                <TextField
                                                    value={monthlySalary}
                                                    onChange={(e) => setMonthlySalary(e.target.value)}
                                                />
                                            ) : (
                                                <Typography variant="body1">{employee.monthlySalary}</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell style={{ width: '15%' }}>
                                            {editingEmpId === employee.empId ? (
                                                <TextField
                                                    value={designation}
                                                    onChange={(e) => setDesignation(e.target.value)}
                                                />
                                            ) : (
                                                <Typography variant="body1">{employee.designation}</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell style={{ width: '15%' }}>
                                            {editingEmpId === employee.empId ? (
                                                <TextField
                                                    value={contact}
                                                    onChange={(e) => setContact(e.target.value)}
                                                />
                                            ) : (
                                                <Typography variant="body1">{employee.contact}</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell style={{ minWidth: '20%' }}>
                                            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                {editingEmpId === employee.empId ? (
                                                    <Typography variant="body1">{employee.amountToBePaid}</Typography>

                                                ) : (
                                                    <TextField
                                                        value={employee.amountToBePaid}
                                                        onChange={(e) => handleInputChange(employee.empId, 'amountToBePaid', e.target.value)}
                                                        type="number"
                                                        InputProps={{ inputProps: { min: 0, step: 1 } }}
                                                        style={{ width: '100%' }}
                                                    />
                                                )}
                                                {/* <Typography
                                                    variant="caption"
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        color: 'gray',
                                                        alignSelf: 'flex-end'
                                                    }}
                                                >
                                                    Balance: {parseFloat(student.monthlyFee) - parseFloat(student.feePaid.toString())} 
                                                </Typography> */}

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                <TableCell colSpan={8} align="center">No data available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20, 25, 30, 40]}
                    component="div"
                    count={filteredEmployees.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </CardContent>
            
            {/* Modal for PDF Preview and Download */}
            <Dialog open={previewOpen} onClose={handleClosePreview} fullWidth maxWidth="md">
                <DialogTitle>Preview PDF</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <iframe
                            title="PDF Preview"
                            src={previewContent}
                            width="100%"
                            height="500"
                            style={{ border: "none" }}
                        ></iframe>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleSendWhatsapp(shareEmpId)} variant="outlined" color="secondary">Share</Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDownloadPDF(shareEmpId)}
                    >
                        Download
                    </Button>
                    <Button onClick={handleClosePreview} variant="outlined" color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}

export default Index;

