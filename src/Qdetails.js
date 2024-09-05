import React from 'react';
import { Typography, Grid2,  TextField, FormLabel, Select, MenuItem,  FormControl, Button, InputLabel } from '@mui/material';

function Qdetails({ handleState, questionDetails, updateQuestionDetails, updateProjectDetails, projectDetails }) {
    const {QCatg} = projectDetails;
    const handleNoChange = (e)=>{
        const qn = parseInt(e.target.value)
        const newQues = []
        for(let i = 0; i < qn; i++){
            newQues.push({
                qid:i+1,
                question:'',
                option:['','']
            });
        }
        updateQuestionDetails(newQues)
    };

    const handleQuestionChange = (index, e)=>{
        const newQuestions = [...questionDetails];
        newQuestions[index].question = e.target.value;
        updateQuestionDetails(newQuestions)
    }

    const handleOptionsChange = (index, e)=>{
        const noOptions = parseInt(e.target.value);
        const newQuestions = [...questionDetails];
        newQuestions[index].option = Array(noOptions).fill('');
        updateQuestionDetails(newQuestions)
    }

    const handleOptionTextChange = (qindex, opindex, e)=>{
        const newQuestions = [...questionDetails];
        newQuestions[qindex].option[opindex] = e.target.value;
        updateQuestionDetails(newQuestions)
    }

    const handleDeleteQuestion = (index) => {
        const newQues = questionDetails.filter((_, qindex) => qindex !== index);
        updateQuestionDetails(newQues)
    }

    const handleQCatg = (e)=>{
        updateProjectDetails({
        ...projectDetails,
        [e.target.name] : e.target.value});
    }

    return (
        <>
            <Typography variant='h6' sx={{textDecoration:'underline' }} align='left'>Question Details</Typography>
                    <Grid2 container columnGap={1} sx={{alignItems:'center', justifyContent:'space-between', wrap:'nowrap', width:'100%'}}>
                    <FormLabel sx={{ verticalAlign: 'middle' }} color='primary'>Question Category :</FormLabel>
                        <Select
                            name="QCatg"
                            id="project-category"
                            variant="standard"
                            defaultValue="Single Correct"
                            label="Project Category"
                            value={QCatg}
                            onChange={handleQCatg}
                            sx={{width:'45%', margin:'0 !important' }}>
                            <MenuItem value="Single Correct">Single Correct</MenuItem>
                            <MenuItem value="Multiple Correct" disabled>Multiple Correct</MenuItem>
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
                        value={questionDetails.length}
                        onChange={handleNoChange}>
                            <MenuItem value='0' hidden disabled>0</MenuItem>
                            <MenuItem value='1'>1</MenuItem>
                            <MenuItem value='2'>2</MenuItem>
                            <MenuItem value='3'>3</MenuItem>
                            <MenuItem value='4'>4</MenuItem>
                            <MenuItem value='5'>5</MenuItem>
                    </Select>
                    </Grid2>

                    {questionDetails.map((q, qIndex) => (
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
                                    <InputLabel id="option">Number of Options</InputLabel>
                                    <Select
                                        id='optselect'
                                        variant="outlined"
                                        labelId="options"
                                        label="Number of Options"
                                        defaultValue='2'
                                        value={q.option.length}
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
                            {q.option.map((opt, optIndex) => (
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
};

export default Qdetails;