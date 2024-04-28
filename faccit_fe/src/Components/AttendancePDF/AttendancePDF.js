import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FaithLogo from "../../Assets/images/FAITH LOGO.png";
import "jspdf-autotable";

const generatePDF = (
  studentAttendances,
  date,
  className,
  startTime,
  endTime
) => {
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
  doc.text(`${className} ${date}`, 73, 53); // Add the heading text (x, y)

  doc.setFont("helvetica"); // Change "helvetica" to your desired font name
  doc.setFontSize(10);
  doc.text(`Attendance Report from: ${startTime}- ${endTime}`, 14, 68); // Add the heading text (x, y)

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

  const presentStudents = formattedData.filter(
    (record) => record.status === "Present"
  ).length;
  const presentStudentsRow = {
    faithId: "",
    name: "",
    courseDetails: "",
    status: `TOTAL PRESENT: ${presentStudents}`,
  };

  const formattedDataWithPresentStudentsRow = [
    ...formattedData,
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
  doc.autoTable(columns, formattedDataWithPresentStudentsRow, tableSettings);

  const formatStartTime = startTime.padStart(5, "0").slice(0, 5); // Formats to "09.00"
  const formatEndTime = endTime.padStart(5, "0").slice(0, 5); // Formats to "09.00"
  // Save the PDF
  doc.save(`${date} - ${className}_${formatStartTime}${formatEndTime}.pdf`);
};

export default generatePDF;
