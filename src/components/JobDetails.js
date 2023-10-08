import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Container, Form, Spinner, Row, Col, FloatingLabel, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import "./css/site.css";

export default function JobDetails() {
  const { compId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [newComment, setNewComment] = useState("");
  const navigateTo = useNavigate();

  const handleBackButtonClick = () => {
    navigateTo(-1);
  };

  useEffect(() => {
    const getJobDetails = async () => {
      setIsLoading(true);
      try {
        const url = localStorage.getItem("url") + "admin.php";
        const jsonData = { compId: compId };
        const formData = new FormData();
        formData.append("json", JSON.stringify(jsonData));
        formData.append("operation", "getJobDetails");
        const res = await axios({ url: url, data: formData, method: "post" });
        // console.log("res ni details: " + JSON.stringify(res.data));
        if (res.data !== 0) {
          setDetails(res.data);
          setIsLoading(false);
        }
      } catch (err) {
        alert("There was an unexpected error: " + err);
      }
    };

    getJobDetails();
  }, [compId]);

  return (
    <>
      {isLoading ?
        <Container className='mt-3 text-center'>
          <Spinner animation='border' variant='success' />
        </Container>
        :
        <>
          <Card border='secondary'>
            <Card.Body>
              <Button variant='outline-danger button-m' onClick={() => handleBackButtonClick()}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </Button>
              <h3 className='text-center mt-3'>Job details</h3>
              <Form>
                <Row className='mt-5'>
                  <Col>
                    <FloatingLabel controlId="subject" label="Subject">
                      <Form.Control type="text" value={details.comp_subject} readOnly />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel controlId="status" label="Status">
                      <Form.Control type="text" value={details.joStatus_name} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="locationCategory" label="Location Category">
                      <Form.Control type="text" value={details.locCateg_name} readOnly />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel controlId="location" label="Location">
                      <Form.Control type="text" value={details.location_name} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="priority" label="Priority">
                      <Form.Control type="text" value={details.priority_name} readOnly />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel controlId="complaintBy" label="Complaint By">
                      <Form.Control type="text" value={details.fac_name} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="user" label="Job Created By">
                      <Form.Control type="text" value={details.user_full_name} readOnly />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel controlId="createDate" label="Date Created">
                      <Form.Control type="text" value={details.job_createDate} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col>
                    <FloatingLabel controlId="description" label="Description">
                      <Form.Control as="textarea" style={{ height: '200px' }} value={details.job_description} readOnly />
                    </FloatingLabel>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
            {localStorage.getItem("userLevel") !== "" && details.joStatus_id === 2 ?
              <Card.Footer className='text-center'>
                <Button className='mt-2' variant='outline-success'>Mark as done</Button>
              </Card.Footer>  : <></>
            }
          </Card>

          <Card className='mt-3' border='secondary'>
            <Card.Body>
              <Form>
                <FloatingLabel label="Add a comment..">
                  <Form.Control as="textarea" style={{ height: '75px' }} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder='Add a comment..' />
                </FloatingLabel>
                <Container className='mt-3 text-end'>
                  <Button>Submit</Button>
                </Container>
              </Form>
            </Card.Body>
          </Card>
        </>
      }
    </>
  )
}
