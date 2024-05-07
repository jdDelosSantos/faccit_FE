import jsPDF from "jspdf";
import "jspdf-autotable";
import FaithLogo from "../../Assets/images/FAITH LOGO.png";

const getAcademicYear = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (month >= 8) {
    return `A.Y ${year} - ${year + 1}`;
  } else {
    return `A.Y ${year - 1} - ${year}`;
  }
};

const generatePDFmonth = (
  monthStudentAttendances,
  monthClassName,
  startDate,
  endDate
) => {
  console.log(monthStudentAttendances);
  const date = new Date(startDate);
  const academicYear = getAcademicYear(date);
  const doc = new jsPDF();
  const formattedStudents = [...monthStudentAttendances].sort(
    (classes1, classes2) => classes1.std_lname.localeCompare(classes2.std_lname)
  );
  const imgWidth = 60; // Set the desired width of the image (adjust as needed)
  const imgHeight = 20;
  doc.addImage(FaithLogo, "PNG", 70, 10, imgWidth, imgHeight); // Position the image (x, y, width, height)

  // Add the heading text
  doc.setFontSize(18); // Set the font size for the heading
  doc.text(`Attendance Report for`, 71, 43); // Add the heading text (x, y)
  doc.text(`${monthClassName} (${academicYear})`, 60, 53); // Add the heading text (x, y)
  doc.setFont("helvetica"); // Change "helvetica" to your desired font name
  doc.setFontSize(10);
  doc.text(`Date Range from: ${startDate} - ${endDate}`, 14, 68); // Add the heading text (x, y)

  // Define the columns for the table
  const columns = [
    { header: "Faith ID", dataKey: "faithId" },
    { header: "Name", dataKey: "name" },
    { header: "Course, Level & Section", dataKey: "courseDetails" },
    { header: "Absent Count", dataKey: "absent_count" },
    { header: "Late Count", dataKey: "late_count" },
    { header: "Present Count", dataKey: "present_count" },
    // Add the late count header
  ];

  // Create a new array with the desired format
  const formattedData = formattedStudents.map((record) => ({
    faithId: `${record.faith_id}`,
    name: `${record.std_lname}, ${record.std_fname}`,
    courseDetails: `${record.std_course}-${record.std_level}${record.std_section}`,
    present_count: record.present_count,
    late_count: record.late_count,
    absent_count: record.open_count - record.late_count - record.present_count,
  }));

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
  doc.autoTable(columns, formattedData, tableSettings);

  // Save the PDF
  doc.save(`${monthClassName} - ${startDate}_${endDate}.pdf`);
};

export default generatePDFmonth;
