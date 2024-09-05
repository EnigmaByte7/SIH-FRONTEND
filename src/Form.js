import React, { useState } from 'react';
import Nav from './Nav';
import Dataupload from './Dataupload';
import Qdetails from './Qdetails';
import PDetails from './PDetails';
import Display from './Display';
import { Typography, Grid2, Box , Snackbar, Button} from '@mui/material';

function ProjectForm() {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [projectDetails, setProjectDetails] = useState({
    Pname: '',
    Org: '',
    About: '',
    Catg: '',
    Tut: '',
    Tutlink: '',
    QCatg:''
  });

  const [questionDetails, setQuestionDetails] = useState([]);
  const [imageData, setImageData] = useState([]);

  const submitForm = async (imagesets) => {
    
    const { Pname ,Org, About, Catg, Tut, Tutlink, QCatg} = projectDetails;
    console.log(imagesets);
    try {
        const response = await fetch('https://backend-1v0u.onrender.com/form/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project_name: Pname,
                about: About,
                category: Catg,
                conducting_org: Org,
                qcategory: QCatg,
                questions: questionDetails,
                ImageSet: imagesets,
                tutorial: {
                    text: Tut,
                    vidurl: Tutlink
                }
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Project submitted successfully:', result);
        } else {
            console.error('Failed to submit project:', result);
        }
    } catch (error) {
        console.error('Error submitting project:', error);
    }
};



  const validateQdetails = ()=>{
    for(let i = 0; i < questionDetails.length; i++){
      let item = questionDetails[i];
      if(item.question === ''){
        return false;
      }
      for(let j = 0; j < item.option.length; j++){
        if(item.option[j] === ''){
          return false;
        }
      }
    }

    return true;
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleState = (direction) => {
    if(direction === 'next' && step === 1){
      const { Pname ,Org, About, Catg, Tut, Tutlink, QCatg} = projectDetails;
      if(Pname === '' || Org === '' || About === '' || Catg === '' || Tutlink === '' || Tut === ''){ 
        setMessage('Please fill all details !')
        setOpen(true);
      }
      else{
        setStep(step + 1);
      }
    }


    if (direction === 'next' && step === 2) {
      if(questionDetails.length != 0 && validateQdetails()){
        setStep(step + 1);
      }
      else{
        setMessage('Please fill all details !')
        setOpen(true);
      }
    }

     else if (direction === 'prev' && step > 1) {
      setStep(step - 1);
    }
    else if (direction === 'home' && step > 1) {
     setStep(1);
   }
  };

  const updateProjectDetails = (newDetails) => {
    setProjectDetails(newDetails);
  };

  const updateQuestionDetails = (newDetails) => {
    setQuestionDetails(newDetails);
  };

  const handleDisplay = (e)=>{
    e.preventDefault();
    setStep(4);
  }

  console.log(projectDetails, questionDetails, imageData)
  return (
    <>
      <Nav />
      <Snackbar
                open={open}
                autoHideDuration={6000}
                message={message}
                onClose={handleClose}
            />
        <Typography variant='h4' align='center' gutterBottom sx={{ marginTop: '3rem' }}>Create a new Project</Typography>
        <Typography variant='h6' align='center' gutterBottom component="p">Hello! Please consider filling all the information for setting up your project on our platform.</Typography>
                <Grid2 container justifyContent="center" sx={{ marginTop: '1rem' }}>
                    <Button variant="contained" onClick={handleDisplay} color="primary">Display all projects</Button>
                </Grid2>
        <Box component='form' sx={{ width: '50%', margin: "auto", marginTop: '2rem', p: "2rem", borderRadius: '20px', boxShadow: '3px 3px 9px rgb(159 151 151 / 50%)' }}>
            <Grid2 container rowSpacing={3} columnSpacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', p: '0 1rem 0' }}>

                {step === 1 && (
                <PDetails
                    handleState={handleState}
                    projectDetails={projectDetails}
                    updateProjectDetails={updateProjectDetails}
                />
                )}
                {step === 2  && (
                <Qdetails
                    handleState={handleState}
                    questionDetails={questionDetails}
                    updateQuestionDetails={updateQuestionDetails}
                    updateProjectDetails={updateProjectDetails}
                    projectDetails={projectDetails}
                />
                )}
                {step === 3 && (
                <Dataupload
                    handleState={handleState}
                    selectedFile={imageData}
                    setImageData={setImageData}
                    submitForm={submitForm}
                    setStep={setStep}
                />
                )}
                {step === 4 && (
                <Display handleState={handleState}/>
                )}
            </Grid2>
        </Box>
    </>
  );
}

export default ProjectForm;
