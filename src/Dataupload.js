import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Grid2, Button, Snackbar } from '@mui/material';
import {LoadingButton} from '@mui/lab'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import JSZip from 'jszip';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);



function Dataupload({ handleState, imageData, setImageData, submitForm , setStep}) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [load, setload] = useState(false);
    const [icon, setIcon] = useState(< CloudUploadIcon />)
    const [buttontext, setButtontext] = useState('UPLOAD FILE')
    const [color, setColor] = useState('primary')
    const [selectedFile, setSelectedFile] = useState(null)

    const handleFile = (e)=>{
        if (e.target.files[0].name.includes('.zip')){
            setSelectedFile(e.target.files[0])
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
        const imagesets = [];
    
        try {
          const zipData = await zip.loadAsync(selectedFile);
    
          for (const [fileName, file] of Object.entries(zipData.files)) {
            if (!file.dir && fileName.match(/\.(jpg|jpeg|png)$/i)) {
              const fileData = await file.async('blob');
              const storageRef = ref(storage, `uploads/${fileName}`);
              await uploadBytes(storageRef, fileData);
              const downloadURL = await getDownloadURL(storageRef);
              const imageitem = {
                image_url : downloadURL,
                votes: {}
              };
              imagesets.push(imageitem);
            }
          }
    
          setImageData(imagesets)
          await submitForm(imagesets);

          setIcon(<CheckCircleSharpIcon />);
          setColor('success');
          setButtontext('UPLOAD COMPLETE');
          setload(false);
    
          setOpen(true);
          setMessage('File uploaded and unzipped successfully!');
          setStep(4)

    
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
                <LoadingButton variant="contained" 
                    loading={load} onClick={()=> {
                    handleState('next')
                    submitFile()
                }} color="primary">Create</LoadingButton>
                <LoadingButton variant="contained" onClick={()=> handleState('prev')} color="primary">Back</LoadingButton>
            </Grid2>
        </>
    )
}


export default Dataupload;