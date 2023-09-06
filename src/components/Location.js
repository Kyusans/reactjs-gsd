import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Form , FloatingLabel, Container, Button, Row, Col} from 'react-bootstrap';
import AlertScript from './AlertScript';

function Location() {
  const [location, setLocation] = useState("");
  const [locationCategory, setLocationCategory] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [validated, setValidated] = useState(false);
  const [validatedCategory, setValidatedCategory] = useState(false);
  console.log("categoryId: " + categoryId);
  	//for alert
	const [showAlert, setShowAlert] = useState(false);
	const [alertVariant, setAlertVariant] = useState("");
	const [alertMessage, setAlertMessage] = useState("");


	function getAlert(variantAlert, messageAlert){
		setShowAlert(true);
		setAlertVariant(variantAlert);
		setAlertMessage(messageAlert);
	}
	sessionStorage.setItem("url", "http://localhost/complaint/php-complaints-backend/");


  const submitLocation = () =>{
    const url = localStorage.getItem("url") + "users.php";
    const jsonData = {
      location: location
    }
    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "submitLocation");
    axios({
      url: url,
      data: formData,
      method: "post",
    })
    .then((res)=>{
      if(res.data !== 0){
        getAlert("success", "Success!");
      }
    })
    .catch((err)=>{
      getAlert("danger", "There was an unexpected error: " + err);
    })
  }

  const submitLocationCategory = () =>{
    const url = localStorage.getItem("url") + "users.php";
    const jsonData = {
      location: location
    }
    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "submitLocationCategory");
    axios({
      url: url,
      data: formData,
      method: "post",
    })
    .then((res)=>{
      if(res.data !== 0){
        getAlert("success", "Success!");
      }
    })
    .catch((err)=>{
      getAlert("success", "There was an unexpected error: " + err);
    })

  }
  const getLocationCategory = () => {
    const url = sessionStorage.getItem("url") + "users.php";
    const formData = new FormData();
    formData.append("operation", "getLocationCategory");
    axios({url: url, data: formData, method: "post"})
    .then((res)=>{
      console.log(JSON.stringify(res.data));
      if(res.data !== 0){
        setLocationCategory(res.data);
      }
    })
    .catch((err)=>{
      alert("There was an unexpected error: " + err);
    })
  }
  const locationCategFormValidation = (e) =>{
		const form = e.currentTarget;
		if(form.checkValidity() === false){
			e.preventDefault();
			e.stopPropagation();
		}else{
			submitLocationCategory();
			e.preventDefault();
			e.stopPropagation();
		}
		setValidated(true);
	}

  const locationFormValidation = (e) =>{
		const form = e.currentTarget;
		if(form.checkValidity() === false){
			e.preventDefault();
			e.stopPropagation();
		}else{
			submitLocation();
			e.preventDefault();
			e.stopPropagation();
		}
		setValidatedCategory(true);
	}
  useEffect(() => {
    getLocationCategory();
  },[])
  return (
    <div>
      <AlertScript show={showAlert} variant={alertVariant} message={alertMessage} />
      <Row className='mt-5'>
        <Col className='mb-4'>
          <Container fluid="md" className='text-center'>
            <Card border='dark'>
              <Card.Header className='green-header'><h3>Location Category</h3></Card.Header>
              <Card.Body>
                <Form noValidate validated={validated} onSubmit={locationCategFormValidation}>
                  <Form.Group>
                    <FloatingLabel label="Location Category">
                      <Form.Control type='text' value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        placeholder='Location Category' 
                        required
                      />
                      <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                  <Container className='mt-3'>
                    <Button type="submit" variant='outline-success'>Submit</Button>
                  </Container>
                </Form>
              </Card.Body>
            </Card>
          </Container>
        </Col>
        <Col>
          <Container fluid="md" className='text-center'>
            <Card border='dark'>
            <Card.Header className='green-header'><h3>Location</h3></Card.Header>
              <Card.Body>
                <Form  validated={validatedCategory} onSubmit={locationFormValidation}>
                  <Form.Group className='mb-3'>
                    <Form.Select className='mb-3' onChange={(e) => setCategoryId(e.target.value)} value={categoryId} required>
                      <option value={""}>Location Category</option>
                      {locationCategory.map((items,index) => (
                      <option key={index} value={items.locCateg_id}>{items.locCateg_name}</option>)
                      )}
                    </Form.Select>
                      <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                    </Form.Group>
                  
                  <Form.Group>
                    <FloatingLabel label="Location">
                      <Form.Control type='text' value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                      placeholder='Location'
                      required
                      />
                      <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Form>
                <Container className='mt-3'>
                  <Button type='submit' variant='outline-success'>Submit</Button>
                </Container>
              </Card.Body>
            </Card>
          </Container>
        </Col>
      </Row>
    </div>
  )
}

export default Location
