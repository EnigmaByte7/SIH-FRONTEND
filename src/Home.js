import React, { useState } from 'react';
import Nav from './Nav';
import { styled } from '@mui/material/styles';
import { Typography, Grid2, Box,  TextField, FormLabel, Select, MenuItem,  FormControl, Button, InputLabel, Snackbar } from '@mui/material';
import {LoadingButton} from '@mui/lab'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import JSZip from 'jszip';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD9wktXoLshvn8knFQlSV5ND6vIKC8riLA",
  authDomain: "sih24-e5a26.firebaseapp.com",
  projectId: "sih24-e5a26",
  storageBucket: "sih24-e5a26.appspot.com",
  messagingSenderId: "825908632418",
  appId: "1:825908632418:web:0a6d95434ca1fd0777aa3b",
  measurementId: "G-PGPF0PXZ8W"
};

const app = initializeApp(firebaseConfig);

function Dataupload({handleState}){
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [load, setload] = useState(false);
    const [icon, setIcon] = useState(< CloudUploadIcon />)
    const [buttontext, setButtontext] = useState('UPLOAD FILE')
    const [color, setColor] = useState('primary')
    const [selectedFile, setselectedFile] = useState(null)

    const handleFile = (e)=>{
        if (e.target.files[0].name.includes('.zip')){
            setselectedFile(e.target.files[0])
            setIcon(< CheckCircleSharpIcon />)
            setColor('success')
            setButtontext('FILE UPLOADED')
        }
        else{
            setOpen(true);
            setMessage('Please upload a .zip file only')
        }
    }
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

      const submitFile = async () => {
        if (!selectedFile) {
          setOpen(true);
          setMessage('No file selected. Please upload a .zip file first.');
          return;
        }
    
        setload(true);
        const storage = getStorage();
        const zip = new JSZip();
        const imageUrls = [];
    
        try {
          const zipData = await zip.loadAsync(selectedFile);
    
          for (const [fileName, file] of Object.entries(zipData.files)) {
            if (!file.dir && fileName.match(/\.(jpg|jpeg|png)$/i)) {
              const fileData = await file.async('blob');
              const storageRef = ref(storage, `uploads/${fileName}`);
              await uploadBytes(storageRef, fileData);
              const downloadURL = await getDownloadURL(storageRef);
              imageUrls.push(downloadURL);
            }
          }
    
          setIcon(<CheckCircleSharpIcon />);
          setColor('success');
          setButtontext('UPLOAD COMPLETE');
          setload(false);
    
          setOpen(true);
          setMessage('File uploaded and unzipped successfully!');
    
          console.log('Uploaded Image URLs:', imageUrls);
        } catch (error) {
          setload(false);
          setOpen(true);
          setMessage(`Error during file upload: ${error.message}`);
        }
      };

    return(
        <>
            
            <Snackbar
                open={open}
                autoHideDuration={6000}
                message={message}
                onClose={handleClose}
            />
            <Typography variant='h6' sx={{textDecoration:'underline' }} align='left'>Upload Dataset</Typography>
            
            <Grid2 container columnGap={1} sx={{alignItems:'center', justifyContent:'space-between', wrap:'nowrap', width:'100%'}}>
                <Typography variant='h6' align='center'>Please upload your dataset as a .zip file only.</Typography>
                <LoadingButton
                id='upload-btn'
                    component="label"
                    role={undefined}
                    loading={load}
                    variant="contained"
                    tabIndex={-1}
                    color={color}
                    startIcon={icon}>
                    {buttontext}
                    <VisuallyHiddenInput
                        type="file"
                        onChange={handleFile}
                    />
                </LoadingButton>
            </Grid2>
            
            <Grid2 container justifyContent="center" columnGap={3} sx={{ marginTop: '1rem', justifyContent: 'space-between' }}>
                <Button variant="contained" onClick={()=> {
                    handleState('next')
                    submitFile()
                }} color="primary">Create</Button>
                <Button variant="contained" onClick={()=> handleState('prev')} color="primary">Back</Button>
            </Grid2>
        </>
    )
}

function Qdetails({handleState}){
    const [qno, setqno] = useState(0);
    const [question, setQuestion] = useState([]);
    const handleNoChange = (e)=>{
        const qn = parseInt(e.target.value)
        const newQues = []
        for(let i = 0; i < qn; i++){
            newQues.push({
                qid:i+1,
                question:'',
                options:['','']
            });
        }
        setQuestion(newQues);
        setqno(question.length)
    };

    const handleQuestionChange = (index, e)=>{
        const newQuestions = [...question];
        newQuestions[index].question = e.target.value;
        setQuestion(newQuestions);
    }

    const handleOptionsChange = (index, e)=>{
        const noOptions = parseInt(e.target.value);
        const newQuestions = [...question];
        newQuestions[index].options = Array(noOptions).fill('');
        setQuestion(newQuestions)
    }

    const handleOptionTextChange = (qindex, opindex, e)=>{
        const newQuestions = [...question];
        newQuestions[qindex].options[opindex] = e.target.value;
        setQuestion(newQuestions)
    }

    const handleDeleteQuestion = (index) => {
        const newQues = question.filter((_, qindex) => qindex !== index);
        setQuestion(newQues)
    }

    console.log(qno)
    console.log(question)
    return (
        <>
            <Typography variant='h6' sx={{textDecoration:'underline' }} align='left'>Question Details</Typography>
                    <Grid2 container columnGap={1} sx={{alignItems:'center', justifyContent:'space-between', wrap:'nowrap', width:'100%'}}>
                    <FormLabel sx={{ verticalAlign: 'middle' }} color='primary'>Question Category :</FormLabel>
                        <Select
                            id="project-category"
                            variant="standard"
                            defaultValue="Classification"
                            label="Project Category"
                            sx={{width:'45%', margin:'0 !important' }}>
                            <MenuItem value="Classification">Single Correct</MenuItem>
                            <MenuItem value="Review Based" disabled>Multiple Correct</MenuItem>
                        </Select>
                    </Grid2>
                    
                    <Grid2 container columnGap={1} sx={{alignItems:'center', justifyContent:'space-between', wrap:'nowrap', width:'100%'}}>
                    <FormLabel sx={{ verticalAlign: 'middle' }} color='primary'>Number of Questions :</FormLabel>
                    <Select 
                        id='qselect'
                        variant='standard'
                        defaultValue='0'
                        label='Number of Questions'
                        sx={{width: '45%', margin:'0 !important' }}
                        value={question.length}
                        onChange={handleNoChange}>
                            <MenuItem value='0' hidden disabled>0</MenuItem>
                            <MenuItem value='1'>1</MenuItem>
                            <MenuItem value='2'>2</MenuItem>
                            <MenuItem value='3'>3</MenuItem>
                            <MenuItem value='4'>4</MenuItem>
                            <MenuItem value='5'>5</MenuItem>
                    </Select>
                    </Grid2>

                    {question.map((q, qIndex) => (
                        <Grid2 container spacing={2} key={q.qid} sx={{ marginTop: '1rem' ,alignItems:'center', justifyContent:'space-between', wrap:'nowrap', width:'100%'}} alignItems="center">
                            <Grid2 item xs={5}>
                                <TextField
                                    fullWidth
                                    label={`Question ${q.qid}`}
                                    variant="outlined"
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(qIndex, e)}
                                />
                            </Grid2>

                            <Grid2 >
                                <FormControl>
                                    <InputLabel id="options">Number of Options</InputLabel>
                                    <Select
                                        id='optselect'
                                        variant="outlined"
                                        labelId="options"
                                        label="Number of Options"
                                        defaultValue='2'
                                        value={q.options.length}
                                        sx={{width:'200px'}}
                                        onChange={(e) => handleOptionsChange(qIndex, e)}
                                    >
                                        <MenuItem value='2'>2</MenuItem>
                                        <MenuItem value='3'>3</MenuItem>
                                        <MenuItem value='4'>4</MenuItem>
                                        <MenuItem value='5'>5</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid2>

                                                        
                            <Grid2 item xs={2}>
                                <Button color="secondary" variant='contained'  onClick={() => handleDeleteQuestion(qIndex)}>
                                    Delete
                                </Button>
                            </Grid2>

                            <Grid2 alignItems="center" sx={{ marginTop: '1rem' ,alignItems:'center', justifyContent:'space-between', wrap:'nowrap', width:'100%'}} container spacing={2}>
                            {q.options.map((opt, optIndex) => (
                                <Grid2 item xs={10} key={optIndex}>
                                    <TextField
                                        fullWidth
                                        label={`Option ${optIndex + 1}`}
                                        variant="outlined"
                                        value={opt}
                                        onChange={(e) => handleOptionTextChange(qIndex, optIndex, e)}
                                    />
                                </Grid2>
                            ))}
                            </Grid2>

                        </Grid2>
                    ))}
                    <Grid2 container justifyContent="center" columnGap={3} sx={{ marginTop: '1rem', justifyContent: 'space-between' }}>
                        <Button variant="contained" onClick={()=> handleState('next')} color="primary">Continue</Button>
                        <Button variant="contained" onClick={()=> handleState('prev')} color="primary">Back</Button>
                    </Grid2>
        </>
    )
}

function PDetails({handleState}) {
    const [Pname, setPname] = useState('');
    const [Org, setOrg] = useState('');
    const [About, setAbout] = useState('');
    const [Catg, setCatg] = useState('');
    const [Tut, setTut] = useState('');
    const [Tutlink, setTutlink] = useState('');

    const handlePname = (e)=>{
        setPname(e.target.value);
    }
    const handleOrg = (e)=>{
        setOrg(e.target.value);
    }
    const handleAbout = (e)=>{
        setAbout(e.target.value);
    }    
    const handleCatg = (e)=>{
        setCatg(e.target.value);
    }
    const handleTut = (e)=>{
        setTut(e.target.value);
    }
    const handleTutlink = (e)=>{
        setTutlink(e.target.value);
    }

    console.log(
        Pname,
        Org,
        About.
        Catg,
        Tut,
        Tutlink
    )
    return (
        <>
            <Typography variant='h6' sx={{textDecoration:'underline' }} align='left'>Project Details</Typography>
                    <Grid2 container columnGap={1} sx={{ alignItems: 'center' ,width: '100%', justifyContent:'space-between', wrap:'nowrap'}}>
                        <TextField id="outlined-basic" variant="outlined" sx={{width: '45%'}} value = {Pname} onChange={handlePname} label='Project Name'/>
                        <TextField id="outlined-basic" label='Organising Body' sx={{width: '45%'}} value = {Org} onChange={handleOrg} variant="outlined" />
                    </Grid2>
                
                    
                    <Grid2 container columnGap={1} sx={{ alignItems: 'center', width: '100%' }}>
                        <TextField fullWidth id="outlined-multiline-flexible" value={About} onChange={handleAbout} label='Describe your project' multiline maxRows={4} />
                    </Grid2>

                    <Grid2 container columnGap={1} sx={{ alignItems: 'center', width: '100%'}}>
                        <FormControl fullWidth sx={{flexDirection:'row', justifyContent:'space-around'}}>
                        <FormLabel sx={{ verticalAlign: 'middle', width:'50%' }} color='primary'>Project Category :</FormLabel>
                            <Select
                                labelId="project-category-label"
                                id="project-category"
                                variant="standard"
                                defaultValue="Classification"
                                label="Project Category"
                                value={Catg}
                                onChange={handleCatg}
                                sx={{width:'50%', margin:'0 !important' }}
                            >
                                <MenuItem value="Classification">Classification</MenuItem>
                                <MenuItem value="Review Based" disabled>Review Based</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid2>

                    <Grid2 container columnGap={1} sx={{ alignItems: 'center', width: '100%' }}>
                        <TextField fullWidth id="tutorial-text" value={Tut} onChange={handleTut} label='Tutorial' multiline maxRows={4} />
                    </Grid2>
                    
                    <Grid2 container columnGap={1} sx={{ alignItems: 'center', width: '100%' }}>
                        <TextField fullWidth id="tutorial-link" onChange={handleTutlink} value={Tutlink} label='Tutorial Video' />
                    </Grid2>

                    <Grid2 container justifyContent="center" sx={{ marginTop: '1rem' }}>
                        <Button variant="contained" onClick={() => handleState('next')} color="primary">Continue</Button>
                    </Grid2>
        </>
    )
}

function Home() {
    const [state, setState] = useState(0);
    const handleState = (dir)=>{
        if(dir === 'next' && state < 2){
            setState(state + 1);
        }
        if(dir === 'prev' && state > 0){
            setState(state - 1);
        }
    }
    
    return (
        <div>
            <Nav />
            <Typography variant='h4' align='center' gutterBottom sx={{ marginTop: '3rem' }}>Create a new Project</Typography>
            <Typography variant='h6' align='center' gutterBottom component="p">Hello! Please consider filling all the information for setting up your project on our platform.</Typography>
            <Box component='form' sx={{ width: '50%', margin: "auto", marginTop: '2rem', p: "2rem", borderRadius: '20px', boxShadow: '3px 3px 9px rgb(159 151 151 / 50%)' }}>
                <Grid2 container rowSpacing={3} columnSpacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', p: '0 1rem 0' }}>
                    {state === 0 && <PDetails handleState={handleState} />}
                    {state === 1 && <Qdetails handleState={handleState} />}
                    {state === 2 && <Dataupload handleState={handleState} />}
                </Grid2>
            </Box>
        </div>
    );
}

export default Home;
