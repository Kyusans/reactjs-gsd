import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Container, Dropdown, Pagination, Table } from "react-bootstrap";
import JobOrderModal from "./JobOrderModal";
import "./css/site.css";
import JobDetails, { formatDate } from "./JobDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faPlay, faThList } from "@fortawesome/free-solid-svg-icons";
import AlertScript from "./AlertScript";

function AdminComplaintTable({ allData, refreshData }) {
  // const navigateTo = useNavigate();
  const [statusType, setStatusType] = useState(parseInt(localStorage.getItem("selectedStatus")));
  const [tickets, setTickets] = useState(0);
  const [ticketId, setTicketId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 20;
  const [showJobOrderModal, setShowJobOrderModal] = useState(false);
  const showPagination = tickets.length > ticketsPerPage;
  const [showJobDetails, setShowJobDetails] = useState(false);

  const hideJobDetails = async () => {
    await refreshData();
    setShowJobDetails(false);
  }

  const handleClose = async () => {
    await refreshData();
    setShowJobOrderModal(false)
  };
  const handleShow = (id, status) => {
    if (status === 1) {
      setTicketId(id);
      setShowJobOrderModal(true);
    } else {
      setTicketId(id);
      setShowJobDetails(true);
      // navigateTo(`/job/details/${id}`);
    }
  };

  const handleSetStatus = (status) => {
    localStorage.setItem("selectedStatus", status);
    setStatusType(status);
  }

  useEffect(() => {
    if (allData) {
      if (statusType === 0) {
        setTickets(allData);
      } else {
        const filterdData = allData.filter(item => item.comp_status === statusType);
        setTickets(filterdData);
      }
    }
    //console.log("alldata: " + allData);
  }, [allData, statusType]);

  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const displayedTickets = tickets ? tickets.slice(startIndex, endIndex) : 0;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  }
  const handleFirstPage = () => {
    setCurrentPage(1);
  };
  const handleLastPage = () => {
    const lastPage = Math.ceil(tickets.length / ticketsPerPage);
    setCurrentPage(lastPage);
  };

  return (
    <>
      <Dropdown className="mb-2 ms-3">
        <Dropdown.Toggle variant={statusType === 0 ? "primary" : statusType === 1 ? "dark" : statusType === 2 ? "warning text-dark" : statusType === 3 ? "success" : "primary"}>
          {statusType === 0 ? "All Tickets" : statusType === 1 ? "Pending Tickets" : statusType === 2 ? "On-going Tickets" : statusType === 3 ? "Completed Tickets" : "Select Ticket Type"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleSetStatus(0)}>
            <FontAwesomeIcon icon={faThList} className="me-2" />All Ticket
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSetStatus(1)} className="text-dark">
            <FontAwesomeIcon icon={faClock} className="me-2 text-dark" />Pending
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSetStatus(2)} className="text-warning">
            <FontAwesomeIcon icon={faPlay} className="me-2 text-warning" />On-going
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSetStatus(3)} className="text-success">
            <FontAwesomeIcon icon={faCheck} className="me-2" />Completed
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Container fluid>

        {displayedTickets.length <= 0 ?
          <AlertScript show={true} variant={"dark"} message={"No tickets yet"} />
          :
          <Table striped bordered hover responsive variant="success" className="border-1 ">
            <thead>
              <tr>
                <th className="green-header">Subject</th>
                <th className="green-header">Status</th>
                <th className="green-header">Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(displayedTickets) && displayedTickets.map((ticket, index) => (
                <tr
                  key={index}
                  onClick={() => handleShow(ticket.comp_id, ticket.comp_status)}
                  className="clickable"
                >
                  <td className={`ticket-date ${ticket.joStatus_name === "Pending" ? "ticket-unread" : ""}`}>{ticket.comp_subject}</td>
                  <td className={`ticket-date ${ticket.joStatus_name === "Pending" ? "ticket-unread" : ""}`}>
                    {ticket.joStatus_name === "Pending" ? (
                      <span><FontAwesomeIcon icon={faClock} className="me-2 text-dark" />Pending</span>
                    ) : ticket.joStatus_name === "On-Going" ? (
                      <span><FontAwesomeIcon icon={faPlay} className="me-2 text-warning" />On-Going</span>
                    ) : (
                      <span><FontAwesomeIcon icon={faCheck} className="me-2 text-success" />Completed</span>
                    )}
                  </td>

                  <td className={`ticket-date ${ticket.joStatus_name === "Pending" ? "ticket-unread" : ""}`}>
                    {formatDate(ticket.comp_date)}
                  </td>
                </tr>
              )
              )}
            </tbody>
          </Table>
        }

        {showPagination && (
          <div className="d-flex justify-content-end mt-2">
            <Pagination>
              <Pagination.First onClick={handleFirstPage} />
              <Pagination.Prev onClick={handlePreviousPage} />
              {Array.from({ length: Math.ceil(tickets.length / ticketsPerPage) }, (_, index) => (
                <Pagination.Item
                  key={index}
                  active={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={handleNextPage} />
              <Pagination.Last onClick={handleLastPage} />
            </Pagination>
          </div>
        )}
        <JobOrderModal show={showJobOrderModal} onHide={handleClose} ticketId={ticketId} />
        <JobDetails show={showJobDetails} onHide={hideJobDetails} compId={ticketId} />
      </Container>

    </>
  );
}

export default AdminComplaintTable;
