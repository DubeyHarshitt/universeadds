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
import { useGetContactDetails } from "src/services/fetchGroups";
import { Header } from "src/util/commonElem";

interface Student {
    studentId: string;
    // name: string;
    firstName: string;
    lastName: string;
    monthlyFee: string;
    courseEnroll: string;
    contact: string;
    feePaid: number;
}

const Index: React.FC = () => {
    const [expanded, setExpanded] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [studentId, setStudentId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [monthlyFee, setMonthlyFee] = useState<string>('');
    const [courseEnroll, setCourseEnroll] = useState<string>('');
    const [contact, setContact] = useState<string>('');

    // const [students, setStudents] = useState([
    //     { studentId: 'S001', firstName: 'John',lastName: 'Doe', monthlyFee: '1000', courseEnroll: 'Mathematics', contact: '911234567890', feePaid: 0 },
    //     { studentId: 'S002', firstName: 'Jane',lastName: 'Smith', monthlyFee: '900', courseEnroll: 'Science', contact: '911234567891', feePaid: 0 },
    //     // Add more initial student data as needed
    // ]);

    const { data: contactData, refetch, isLoading, isError } = useGetContactDetails();

    useEffect(() => {
        if (contactData) {
            const mappedStudents = contactData.map((student) => ({
                studentId: student.studentCode,
                // name: `${student.firstName} ${student.lastName}`,
                firstName: student.firstName,
                lastName: student.lastName,
                monthlyFee: student.fees,
                courseEnroll: student.groupName,
                contact: student.contactNumber,
                feePaid: 0,
            }));
            setStudents(mappedStudents);
        }
    }, [contactData]);


    const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
    const [shareStudentId, setShareStudentId] = useState<string | null>(null); // State for tracking shared student id
    const [previewOpen, setPreviewOpen] = useState<boolean>(false); // State for modal visibility
    const [previewContent, setPreviewContent] = useState<string>(""); // State for PDF content preview
    const [filter, setFilter] = useState<string>(''); // State for filter input
    const [courseFilter, setCourseFilter] = useState<string>(''); // State for course filter
    const [minFeeFilter, setMinFeeFilter] = useState<string>(''); // State for minimum fee filter
    const [maxFeeFilter, setMaxFeeFilter] = useState<string>(''); // State for maximum fee filter
    const [downloadStudentId, setDownloadStudentId] = useState<string | null>(null); // State for tracking which PDF to download


    // Pagination state
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const handleSelect = (): void => {
        const newStudent: Student = { studentId, firstName, lastName, monthlyFee, courseEnroll, contact, feePaid: 0 };
        setStudents([...students, newStudent]);
        clearInputs();
    };

    //BACKEND CALL FOR GETTING DATA Employees:True | Student:False
    // const {
    //     data: contactData,
    //     refetch: refetchContactDetails,
    //     isLoading,
    //     isError
    // } = useGetContactDetails();

    const handleEdit = (studentId: string): void => {
        const student = students.find(student => student.studentId === studentId);
        if (student) {
            setStudentId(student.studentId);
            // setName(student.name);
            setFirstName(student.firstName);
            setLastName(student.lastName);
            setMonthlyFee(student.monthlyFee);
            setCourseEnroll(student.courseEnroll);
            setContact(student.contact);
            setEditingStudentId(studentId);
            // setShareStudentId(studentId);
        }
    };

    const handleSave = (): void => {
        if (editingStudentId !== null) {
            const updatedStudents = students.map(student =>
                student.studentId === editingStudentId ? { studentId, firstName, lastName, monthlyFee, courseEnroll, contact, feePaid: student.feePaid } : student
            );
            setStudents(updatedStudents);
            clearInputs();
            setEditingStudentId(null);
        }
    };

    const handleInputChange = (studentId: string, field: keyof Student, value: string | number): void => {
        const updatedStudents = students.map(student =>
            student.studentId === studentId ? { ...student, [field]: value } : student
        );
        setStudents(updatedStudents);
        if (field === 'feePaid' && value !== '' && !isNaN(Number(value))) {
            setShareStudentId(studentId); // Enable share button for this studentId
        } else {
            setShareStudentId(null); // Disable share button if feePaid is not valid
        }
    };

    const getMonthInWords = (month) => {
        const monthsInWords = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        return monthsInWords[month - 1]; // Adjust for zero-based index
    };

    const generatePDF = (student: Student) => {
        const doc = new jsPDF();
        const currentDate = new Date();
        const companyName = "Financial Management System";
        // doc.addImage(imageBase64, 'JPEG', 10, 10, 30, 30);    
        doc.setFontSize(16);
        doc.text(companyName, 105, 15, { align: 'center' });

        doc.setFontSize(14);
        doc.text('Salary Slip', 105, 25, { align: 'center' });

        // Add employee details
        doc.setFontSize(12);
        doc.text(`Employee Name: ${student.firstName} ${student.lastName}`, 10, 50);
        doc.text(`Course: ${student.courseEnroll}`, 10, 58);
        doc.text(`Month & Year: ${getMonthInWords(currentDate.getMonth() + 1)}, ${currentDate.getFullYear()}`, 10, 66);


        doc.setFontSize(12);
        const tableColumn = ["Monthly Fee", "Fee Paid"];
        const tableRows = [[student.monthlyFee, student.feePaid]];

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 70
        });

        doc.text(`Amount paid (in words): `, 10, 95);

        doc.text('Signature of the Employee ', 150, 105);
        //for signature
        // doc.addImage(imageBase64, 'JPEG', 10, 10, 30, 30); 

        return doc;
    };


    const handleShare = (studentId: string): void => {
        const student = students.find(student => student.studentId === studentId);
        if (student) {
            const doc = generatePDF(student);


            const pdfContent = doc.output('datauristring');
            setPreviewContent(pdfContent);
            setPreviewOpen(true);
            setDownloadStudentId(studentId); // Set the studentId for the download button
        }
    };

    const handleClosePreview = (): void => {
        setPreviewOpen(false);
        setDownloadStudentId(null); // Reset download studentId on modal close
    };

    const handleDownloadPDF = (studentId: string | null): void => {
        if (studentId === null) return;

        const student = students.find(student => student.studentId === studentId);
        if (student) {
            const doc = generatePDF(student);

            doc.save("student_list.pdf");
        }
    };

    const handleSendWhatsapp = (studentId: string): void => {
        const student = students.find(student => student.studentId === studentId);
        if (student) {
            const message = `Hello ${student.firstName} ${student.lastName}, I would like to share my salary slip with you. Can you please help me?`;
            alert(message);
        }
    };

    const clearInputs = (): void => {
        setStudentId('');
        // setName('');
        setFirstName('');
        setLastName('');
        setMonthlyFee('');
        setCourseEnroll('');
        setContact('');
    };

    const filteredStudents = students.filter(student => {
        const matchesNameOrId = (
            `${student.firstName.toLowerCase()} ${student.lastName.toLowerCase()}`
        ).includes(filter.toLowerCase()) || student.studentId.toLowerCase().includes(filter.toLowerCase());
        const matchesCourse = student.courseEnroll.toLowerCase().includes(courseFilter.toLowerCase());
        const matchesFeeRange = (!minFeeFilter || parseFloat(student.monthlyFee) >= parseFloat(minFeeFilter)) && (!maxFeeFilter || parseFloat(student.monthlyFee) <= parseFloat(maxFeeFilter));

        return matchesNameOrId && matchesCourse && matchesFeeRange;
    });

    const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChange = () => {
        setExpanded(!expanded);
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading student details</div>;

    return (
        <Card sx={{ marginBottom: 2, boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <CardHeader title={<Header name={"Student"} />} />
            <Divider />
            <CardContent sx={{ padding: 0 }}>
                {/* <Accordion expanded={expanded} onChange={handleChange}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{editingStudentId === null ? 'Add Student' : 'Edit Student'}</Typography>
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
                                    label="Student ID"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Monthly Fee"
                                    value={monthlyFee}
                                    onChange={(e) => setMonthlyFee(e.target.value)}
                                    type="number"
                                    inputProps={{ step: "0.01" }} // Allow floating-point numbers
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Course Enroll"
                                    value={courseEnroll}
                                    onChange={(e) => setCourseEnroll(e.target.value)}
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
                                    onClick={editingStudentId === null ? handleSelect : handleSave}
                                >
                                    {editingStudentId === null ? 'Add' : 'Save'}
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
                            label="Filter by Name or Student ID"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
                            label="Filter by Course"
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
                            label="Min Monthly Fee"
                            value={minFeeFilter}
                            onChange={(e) => setMinFeeFilter(e.target.value)}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
                            label="Max Monthly Fee"
                            value={maxFeeFilter}
                            onChange={(e) => setMaxFeeFilter(e.target.value)}
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
                        <TableCell style={{ width: '10%' }}>Student ID</TableCell>
                        <TableCell colSpan={2} align="center" style={{ width: '25%' }}>
                        Name
                        </TableCell>
                        <TableCell style={{ width: '15%' }}>Monthly Fee</TableCell>
                        <TableCell style={{ width: '15%' }}>Course Enroll</TableCell>
                        <TableCell style={{ width: '15%' }}>Contact</TableCell>
                        <TableCell style={{ width: '30%' }}>Fee Paid</TableCell>
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
                    {filteredStudents.length > 0 ? (
                        filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
                        <TableRow key={student.studentId}>
                            <TableCell style={{ width: '10%' }}>
                            {editingStudentId === student.studentId ? (
                                <Button color="primary" onClick={handleSave}>Save</Button>
                            ) : (
                                <Button color="primary" onClick={() => handleEdit(student.studentId)}><ModeEditIcon /></Button>
                            )}
                            {shareStudentId === student.studentId && (
                                <Button color="secondary" onClick={() => handleShare(student.studentId)}><ShareIcon /></Button>
                            )}
                            {downloadStudentId === student.studentId && (
                                <Button color="secondary" onClick={() => handleDownloadPDF(student.studentId)}>Download</Button>
                            )}
                            </TableCell>
                            <TableCell style={{ width: '10%' }}>
                            {editingStudentId === student.studentId ? (
                                <TextField
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                />
                            ) : (
                                student.studentId
                            )}
                            </TableCell>
                            <TableCell style={{ width: '10%' }}>
                            {editingStudentId === student.studentId ? (
                                <TextField
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                />
                            ) : (
                                student.firstName
                            )}
                            </TableCell>
                            <TableCell style={{ width: '10%' }}>
                            {editingStudentId === student.studentId ? (
                                <TextField
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                />
                            ) : (
                                student.lastName
                            )}
                            </TableCell>
                            <TableCell style={{ width: '10%' }}>
                            {editingStudentId === student.studentId ? (
                                <TextField
                                value={monthlyFee}
                                onChange={(e) => setMonthlyFee(e.target.value)}
                                type="number"
                                inputProps={{ step: "0.01" }}
                                />
                            ) : (
                                student.monthlyFee
                            )}
                            </TableCell>
                            <TableCell style={{ width: '20%' }}>
                            {editingStudentId === student.studentId ? (
                                <TextField
                                value={courseEnroll}
                                onChange={(e) => setCourseEnroll(e.target.value)}
                                />
                            ) : (
                                student.courseEnroll
                            )}
                            </TableCell>
                            <TableCell style={{ width: '20%' }}>
                            {editingStudentId === student.studentId ? (
                                <TextField
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                />
                            ) : (
                                student.contact
                            )}
                            </TableCell>
                            <TableCell style={{ width: '20%' }}>
                            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                {editingStudentId === student.studentId ? (
                                <Typography variant="body1">{student.feePaid}</Typography>
                                ) : (
                                <TextField
                                    value={student.feePaid}
                                    onChange={(e) => handleInputChange(student.studentId, 'feePaid', e.target.value)}
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
                    rowsPerPageOptions={[5, 10, 20, 30, 40]}
                    component="div"
                    count={filteredStudents.length}
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
                    <Button onClick={() => handleSendWhatsapp(downloadStudentId)} variant="outlined" color="secondary">Share</Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDownloadPDF(downloadStudentId)}
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
