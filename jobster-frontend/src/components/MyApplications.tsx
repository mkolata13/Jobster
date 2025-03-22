import { useState, useEffect } from "react";
import { getUserJobApplications } from "../api/jobApplications";
import { Container, Table, Spinner, Alert } from "react-bootstrap";

// Define the type for a job application
interface JobApplication {
    id: string;
    companyName: string;
    title: string;
    jobTitle: string;
    applicationStatus: string;
    applicationDate: string;
}

const MyApplications = () => {
    const [applications, setApplications] = useState<JobApplication[]>([]); // Typing the state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getUserJobApplications();
                setApplications(data);
            } catch (err) {
                setError("Failed to load applications.");
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" />
                <p>Loading applications...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">My Applications</h2>
            {applications.length === 0 ? (
                <Alert variant="info">No job applications found.</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Title</th>
                            <th>Job Title</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td>{app.companyName}</td>
                                <td>{app.title}</td>
                                <td>{app.jobTitle}</td>
                                <td>{app.applicationStatus}</td>
                                <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default MyApplications;
