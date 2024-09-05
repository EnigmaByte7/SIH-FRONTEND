import React, { useEffect, useState } from 'react';
import { Grid2, Button} from '@mui/material';

const Display = ({handleState}) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('https://backend-1v0u.onrender.com/form/projects');
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json(); 
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);


    const fetchProjectDetails = async (id) => {
        try {
            const response = await fetch(`https://backend-1v0u.onrender.com/form/projects/${id}`);
            if (!response.ok) {
                throw new Error('Cant fetch');
            }
            const projectDetails = await response.json();
            setSelectedProject(projectDetails);
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    return (
<div>
            {projects.map((project) => (
                <div key={project._id} style={{ marginBottom: '20px' }}>
                    <h2>Project ID: {project._id}</h2>
                    <h2>Project Name: {project.project_name}</h2>
                    <h2>About: {project.about}</h2>

                    <Button variant="contained" color="primary" onClick={() => fetchProjectDetails(project._id)}>
                        Show Details
                    </Button>

                    {selectedProject && selectedProject._id === project._id && (
                        <div>
                            <h2>Category: {selectedProject.category}</h2>
                            <h2>Conducting Organisation: {selectedProject.conducting_org}</h2>
                            <h2>Question Category: {selectedProject.qcategory}</h2>

                            <h1>Tutorial:</h1>
                            <p>{selectedProject.tutorial.text}</p>
                            <a href={selectedProject.tutorial.vidurl}>Tutorial Video Url</a>

                            <h2>Dataset 👇</h2>
                            <div>
                                {selectedProject.ImageSet &&
                                    selectedProject.ImageSet.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.image_url}
                                            alt='I hate writhing alt text'
                                            style={{ width: '200px', height: 'auto', marginRight: '10px' }}
                                        />
                                    ))}
                            </div>

                            <h2>QuestionSet 👇</h2>
                            <div>
                                {selectedProject.questions &&
                                    selectedProject.questions.map((q, key) => (
                                        <div key={key}>
                                            <h2>{q.qid}. {q.question}</h2>
                                            {q.option && q.option.map((opt, idx) => (
                                                <h3 key={idx}>{opt}</h3>
                                            ))}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <Grid2 container justifyContent="center" columnGap={3} sx={{ marginTop: '1rem', justifyContent: 'space-between' }}>
                <Button variant="contained" onClick={()=> handleState('home')} color="primary">Back</Button>
            </Grid2>
        </div>
    );
};

export default Display;
