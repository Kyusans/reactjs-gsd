import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import ComplaintForm from './ComplaintForm';
import "./css/site.css";

function Dashboard() {
  const navigateTo = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  
  const openComplaintModal = () => {setShowComplaintModal(true);}

  const closeComplaintModal = () => {
    getComplaints();
    setShowComplaintModal(false);
  }

  const getComplaints = () => {
    const url = localStorage.getItem("url") + "users.php";
    const jsonData = {userId: localStorage.getItem("userId")};
    const formData = new FormData();
    formData.append("operation", "getComplaints");
    formData.append("json", JSON.stringify(jsonData));
    axios({ url: url, data: formData, method: "post" })
      .then((res) => {
        if (res.data !== 0) {
          setTickets(res.data);
        }
      })
      .catch((err) => {
        alert("There was an unexpected error: " + err);
      });
  };

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const formattedDate = `${month} ${day}`;
    return formattedDate;
  }

  useEffect(() => {
    if(localStorage.getItem("isLoggedIn") !== "1"){
      setTimeout(() => {
        navigateTo("/");
      }, 1500);
    }else{
      getComplaints();
    }
  }, [navigateTo])
  
  return (
    <>
      {localStorage.getItem("isLoggedIn") === "1" ? 
        (
          <Container className="mt-3">
            <Row className='mb-2 mt-2'>
              <Col className='text-end'>
                <Button className='btn btn-success' onClick={openComplaintModal}>Add Complaint</Button>
              </Col>
            </Row>
            <Table striped bordered hover size='sm' variant='success' className='border-2 text-center'>
              <thead>
                <tr>
                  <th className="green-header">Subject</th>
                  <th className="green-header">Description</th>
                  <th className="green-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(tickets) && tickets.length > 0 ? (
                  tickets.map((ticket, index) => (
                    <tr key={index} className='ticket-cell'>
                        <td>{ticket.comp_subject}</td>
                        <td className="ticket-description">
                          {ticket.comp_description.length > 50
                              ? `${ticket.comp_description.slice(0, 50)}...`
                              : ticket.comp_description}
                        </td>
                        <td className='ticket-date'>{formatDate(ticket.comp_date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center">No tickets available</td>
                  </tr>
                )}
              </tbody>

            </Table>
          </Container>
        ):
        <h3 className='text-center'>You need to login first</h3>
      }
      <ComplaintForm show={showComplaintModal} onHide={closeComplaintModal} />
    </>
  )
}

export default Dashboard