import React from "react";

const TestTable = ({ facilities }) => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const times = [];

  // Generate time slots from 7:00 AM to 9:00 PM in 30-minute intervals
  for (let hour = 7; hour <= 21; hour++) {
    const hourStr = hour.toString().padStart(2, "0");
    times.push(`${hourStr}:00`, `${hourStr}:30`);
  }

  const renderCell = (day, time) => {
    const classSchedule = facilities.find(
      (facility) =>
        facility.class_day === day &&
        facility.start_time <= time &&
        facility.end_time > time
    );

    if (classSchedule) {
      const { start_time, end_time, laboratory, class_code } = classSchedule;
      const startIndex = times.indexOf(start_time);
      const endIndex = times.indexOf(end_time);
      const rowSpan = endIndex - startIndex + 1;

      return (
        <td
          rowSpan={rowSpan}
          style={{ textAlign: "center", verticalAlign: "middle" }}
          key={`${day}-${start_time}`}
        >
          {`${laboratory} ${class_code}`}
        </td>
      );
    }

    return null;
  };

  return (
    <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
      <thead>
        <tr>
          <th></th>
          {daysOfWeek.map((day) => (
            <th key={day}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {times.map((time) => (
          <tr key={time}>
            <td>{time}</td>
            {daysOfWeek.map(
              (day) =>
                renderCell(day, time) || <td key={`${day}-${time}`}>&nbsp;</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TestTable;
