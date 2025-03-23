import { useEffect, useState } from "react";
import { Button, Card, ListGroup, Spinner, Alert, Badge, Row, Col, Container } from "react-bootstrap";
import { getMyJobPosts, getJobPostApplications } from "../api/jobPosts";
import { ApplicationStatus } from "../enums/ApplicationStatus";
import { changeApplicationStatus } from "../api/jobApplications";
import { downloadCv } from "../api/user";
import { JobPost } from "../types/JobPost";

interface JobApplication {
    id: number;
    jobSeekerId: number;
    firstName: string;
    lastName: string;
    cvPath: string;
    applicationStatus: ApplicationStatus;
}

const EmployerJobPosts = () => {
    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [selectedJobPost, setSelectedJobPost] = useState<number | null>(null);
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchJobPosts();
    }, []);

    const fetchJobPosts = async () => {
        try {
            setLoading(true);
            const data = await getMyJobPosts();
            setJobPosts(data);
        } catch (err) {
            setError("Failed to fetch job posts.");
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (jobPostId: number) => {
        try {
            setLoading(true);
            const data = await getJobPostApplications(jobPostId);
            setApplications(data);
            setSelectedJobPost(jobPostId);
        } catch (err) {
            setError("Failed to fetch applications.");
        } finally {
            setLoading(false);
        }
    };

    const updateApplicationStatus = async (applicationId: number, status: ApplicationStatus) => {
        try {
            await changeApplicationStatus(applicationId.toString(), status.toString());
            setApplications((prev) =>
                prev.map((app) => (app.id === applicationId ? { ...app, applicationStatus: status } : app))
            );
        } catch (err) {
            setError("Failed to update application status.");
        }
    };

    const handleDownloadCv = async (cvPath: string, applicantName: string) => {
        try {
            const fileData = await downloadCv(cvPath);
            const blob = new Blob([fileData], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${applicantName}_CV.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            setError("Failed to download CV.");
        }
    };

    return (
        <Container className="mt-4">
            <h2>My Job Posts</h2>

            {loading && <div className="d-flex justify-content-center my-3"><Spinner animation="border" variant="primary" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                {jobPosts.map((job) => (
                    <Col key={job.id} md={6} lg={4} className="mb-4">
                        <Card onClick={() => fetchApplications(job.id)} style={{ cursor: "pointer" }} className="shadow-sm">
                            <Card.Body>
                                <Card.Title>{job.title} ({job.jobTitle})</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{job.companyName}</Card.Subtitle>
                                <Card.Text><strong>Location:</strong> {job.location} {job.remote && "(Remote)"}</Card.Text>
                                <Card.Text><strong>Salary:</strong> ${job.monthlySalary.toLocaleString()}/month</Card.Text>
                                <Card.Text><strong>Experience Level:</strong> {job.experienceLevel}</Card.Text>
                                <Card.Text><strong>Job Type:</strong> {job.jobType} | <strong>Contract:</strong> {job.contractType}</Card.Text>
                                <Card.Text><strong>Skills:</strong> {job.demandedSkills}</Card.Text>
                                <Card.Text><strong>Function:</strong> {job.jobFunction}</Card.Text>
                                <Card.Text className="text-muted">Posted on: {new Date(job.creationDate).toLocaleDateString()}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {selectedJobPost !== null && (
                <div className="mt-4">
                    <h3>Applications for Job #{selectedJobPost}</h3>
                    {applications.length === 0 ? (
                        <p>No applications found.</p>
                    ) : (
                        <ListGroup>
                            {applications.map((app) => (
                                <ListGroup.Item key={app.id} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{app.firstName} {app.lastName}</strong> - 
                                        <Badge
                                            className="ms-2"
                                            bg={app.applicationStatus === ApplicationStatus.ACCEPTED ? "success" : 
                                                app.applicationStatus === ApplicationStatus.REJECTED ? "danger" : "warning"}
                                        >
                                            {app.applicationStatus.toString()}
                                        </Badge>
                                    </div>
                                    <div className="ms-auto">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleDownloadCv(app.cvPath, `${app.firstName}_${app.lastName}`)}
                                        >
                                            Download CV
                                        </Button>
                                        {app.applicationStatus === ApplicationStatus.PENDING && (
                                            <>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => updateApplicationStatus(app.id, ApplicationStatus.ACCEPTED)}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => updateApplicationStatus(app.id, ApplicationStatus.REJECTED)}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </div>
            )}
        </Container>
    );
};

export default EmployerJobPosts;
