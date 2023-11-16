import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import ComplaintForm from './ComplaintForm';
import "./css/site.css";
import { formatDate } from './JobDetails';
import UpdateTicketModal from './UpdateTicketModal';

function Dashboard() {
  const navigateTo = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [compId, setCompId] = useState(0);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const openComplaintModal = () => {setShowComplaintModal(true);}
  const closeComplaintModal = () => {
    getComplaints();
    setShowComplaintModal(false);
  }

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const openUpdateModal = () => {setShowUpdateModal(true)};
  const closeUpdateModal = () => {setShowUpdateModal(false)};

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

  const handleNavigate = (id, status) =>{
    if(status === 1){
      setCompId(id);
      openUpdateModal();
    }else{
      navigateTo(`/job/details/${id}`);
    }
  }

  useEffect(() => {
    if(localStorage.getItem("isLoggedIn") !== "1"){
      setTimeout(() => {
        navigateTo("/gsd");
      }, 1500);
    }else{
      getComplaints();
      const intervalId = setInterval(() => {getComplaints()}, 5000);
      return () => clearInterval(intervalId);
    }
  }, [navigateTo])
  
  return (
    <>
      {localStorage.getItem("isLoggedIn") === "1" ? 
        (
          <Container className="mt-3 scrollable-container">
            <Row className='mb-2 mt-2'>
              <Col>
                <Button className='btn btn-success' onClick={openComplaintModal}>Add Ticket</Button>
              </Col>
            </Row>
            <Table striped bordered hover responsive variant='success' className='border-1'>
              <thead>
                <tr>
                  <th className="green-header">Subject</th>
                  <th className="green-header">Status</th>
                  <th className="green-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(tickets) && tickets.length > 0 ? (
                  tickets.map((ticket, index) => (
                    <tr key={index} className='ticket-cell' onClick={() => handleNavigate(ticket.comp_id, ticket.comp_status)}>
                        <td>{ticket.comp_subject}</td>
                        <td>{ticket.comp_status === 1 ? "Pending" : ticket.comp_status === 2 ? "On-Going" : "Completed"}</td>
                        <td className='ticket-date'>{formatDate(ticket.comp_date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td/>
                    <td className="text-center ticket-description">No tickets found</td>
                    <td/>
                  </tr>
                )}
              </tbody>
            </Table>
          </Container>
        ):
        <h3 className='text-center'>You need to login first</h3>
      }
      <ComplaintForm show={showComplaintModal} onHide={closeComplaintModal} />
      <UpdateTicketModal show={showUpdateModal} onHide={closeUpdateModal} compId={compId} />
    </>
  )
}

export default Dashboard