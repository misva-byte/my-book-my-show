import jsPDF from "jspdf";

/**
 * Generates and downloads a movie ticket PDF
 */
export const downloadTicket = ({
  movieName,
  date,
  time,
  seats,
  theatreName = "Movie Theatre",
  ticketCount,
}) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("🎟 Movie Ticket", 20, 20);

  doc.setFontSize(12);
  doc.text(`Movie: ${movieName}`, 20, 40);
  doc.text(`Theatre: ${theatreName}`, 20, 50);
  doc.text(`Date: ${date}`, 20, 60);
  doc.text(`Time: ${time}`, 20, 70);
  doc.text(`Seats: ${seats || `${ticketCount} Ticket(s)`}`, 20, 80);

  doc.setFontSize(10);
  doc.text(
    "Please arrive 15 minutes before showtime.\nEnjoy the show!",
    20,
    100
  );

  doc.save(`${movieName}-ticket.pdf`);
};
    