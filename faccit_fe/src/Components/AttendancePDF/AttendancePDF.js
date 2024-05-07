import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FaithLogo from "../../Assets/images/FAITH LOGO.png";
import "jspdf-autotable";

const getAcademicYear = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (month >= 8) {
    return `A.Y ${year} - ${year + 1}`;
  } else {
    return `A.Y ${year - 1} - ${year}`;
  }
};

const generatePDF = (
  studentAttendances,
  dateString,
  className,
  startTime,
  endTime
) => {
  const date = new Date(dateString); // Convert the date string to a Date object
  const academicYear = getAcademicYear(date);
  const doc = new jsPDF();

  const formattedStudents = [...studentAttendances].sort((classes1, classes2) =>
    classes1.std_lname.localeCompare(classes2.std_lname)
  );

  const imgWidth = 60; // Set the desired width of the image (adjust as needed)
  const imgHeight = 20;

  doc.addImage(FaithLogo, "PNG", 70, 10, imgWidth, imgHeight); // Position the image (x, y, width, height)

  // Add the heading text
  doc.setFontSize(18); // Set the font size for the heading
  doc.text(`Attendance Report for`, 71, 43); // Add the heading text (x, y)
  doc.text(`${className} (${academicYear})`, 60, 53); // Add the heading text (x, y)

  doc.setFont("helvetica"); // Change "helvetica" to your desired font name
  doc.setFontSize(10);
  doc.text(
    `Date: ${dateString}    Time Range: ${startTime}- ${endTime}`,
    14,
    68
  ); // Add the heading text (x, y)

  // Define the columns for the table
  const columns = [
    { header: "Faith ID", dataKey: "faithId" },
    { header: "Name", dataKey: "name" },
    { header: "Course, Level & Section", dataKey: "courseDetails" },
    { header: "Attendance Status", dataKey: "status" },
  ];

  // Create a new array with the desired format
  const formattedData = formattedStudents.map((record) => ({
    faithId: `${record.faith_id}`,
    name: `${record.std_lname}, ${record.std_fname}`,
    courseDetails: `${record.std_course}-${record.std_level}${record.std_section}`,
    status: record.status,
  }));

  const absentStudents = formattedData.filter(
    (record) => record.status === "Absent"
  ).length;
  const lateStudents = formattedData.filter(
    (record) => record.status === "Late"
  ).length;
  const presentStudents = formattedData.filter(
    (record) => record.status === "Present"
  ).length;

  const lateStudentsRow = {
    faithId: "",
    name: "",
    courseDetails: "",
    status: `TOTAL LATE: ${lateStudents}`,
  };

  const absentStudentsRow = {
    faithId: "",
    name: "",
    courseDetails: "",
    status: `TOTAL ABSENT: ${absentStudents}`,
  };

  const presentStudentsRow = {
    faithId: "",
    name: "",
    courseDetails: "",
    status: `TOTAL PRESENT: ${presentStudents}`,
  };

  const formattedDataWithSummaryRows = [
    ...formattedData,
    lateStudentsRow,
    absentStudentsRow,
    presentStudentsRow,
  ];

  // Define the table settings
  const tableSettings = {
    startY: 73,
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [128, 128, 128],
      textColor: [255, 255, 255],
    },
  };

  // Create the table
  doc.autoTable(columns, formattedDataWithSummaryRows, tableSettings);

  const formatStartTime = startTime.padStart(5, "0").slice(0, 5); // Formats to "09.00"
  const formatEndTime = endTime.padStart(5, "0").slice(0, 5); // Formats to "09.00"
  // Save the PDF
  doc.save(
    `${dateString} - ${className}_${formatStartTime}${formatEndTime}.pdf`
  );
};

export default generatePDF;
