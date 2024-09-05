import React from 'react';
import { Typography, Grid2,  TextField, FormLabel, Select, MenuItem,  FormControl, Button } from '@mui/material';

function PDetails({ handleState, projectDetails, updateProjectDetails }) {
    const { Pname, Org, About, Catg, Tut, Tutlink } = projectDetails;
  
    const handleChange = (e) => {
      updateProjectDetails({
        ...projectDetails,
        [e.target.name]: e.target.value,
      });
    };
    return (
        <> 
            <Typography variant='h6' sx={{textDecoration:'underline' }} align='left'>Project Details</Typography>
                    <Grid2 container columnGap={1} sx={{ alignItems: 'center' ,width: '100%', justifyContent:'space-between', wrap:'nowrap'}}>
                        <TextField id="outlined-basic" name='Pname' variant="outlined" sx={{width: '45%'}} value = {Pname} onChange={handleChange} label='Project Name'/>
                        <TextField id="outlined-basic" name='Org' label='Organising Body' sx={{width: '45%'}} value = {Org} onChange={handleChange} variant="outlined" />
                    </Grid2>
                
                    
                    <Grid2 container columnGap={1} sx={{ alignItems: 'center', width: '100%' }}>
                        <TextField fullWidth id="outlined-multiline-flexible" name='About' value={About} onChange={handleChange} label='Describe your project' multiline maxRows={4} />
                    </Grid2>

                    <Grid2 container columnGap={1} sx={{ alignItems: 'center', width: '100%'}}>
                        <FormControl fullWidth sx={{flexDirection:'row', justifyContent:'space-around'}}>
                        <FormLabel sx={{ verticalAlign: 'middle', width:'50%' }} color='primary'>Project Category :</FormLabel>
                            <Select
                                name='Catg'
                                labelId="project-category-label"
                                id="project-category"
                                variant="standard"
                                defaultValue="Classification"
                                label="Project Category"
                                value={Catg}
                                onChange={handleChange}
                                sx={{width:'50%', margin:'0 !important' }}
                            >
                                <MenuItem value="Classification">Classification</MenuItem>
                                <MenuItem value="Review Based" disabled>Review Based</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid2>

                    <Grid2 container columnGap={1} sx={{ alignItems: 'center', width: '100%' }}>
                        <TextField fullWidth id="tutorial-text" name='Tut' value={Tut} onChange={handleChange} label='Tutorial' multiline maxRows={4} />
                    </Grid2>
                    
                    <Grid2 container columnGap={1} sx={{ alignItems: 'center', width: '100%' }}>
                        <TextField fullWidth id="tutorial-link" name='Tutlink' onChange={handleChange} value={Tutlink} label='Tutorial Video' />
                    </Grid2>

                    <Grid2 container justifyContent="center" sx={{ marginTop: '1rem' }}>
                        <Button variant="contained" onClick={() => handleState('next')} color="primary">Continue</Button>
                    </Grid2>
        </>
    )
};

export default PDetails;