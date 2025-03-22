import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobPost, applyToJobPost } from "../api/jobPosts";
import { Container, Spinner, Button, Alert, Card } from "react-bootstrap";
import { JobPost } from "../types/JobPost";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";

export default function JobPostDetails() {
  const { id } = useParams<{ id: string }>();
  const [jobPost, setJobPost] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { roles } = useAuth();

  useEffect(() => {
    getJobPost(Number(id))
      .then((data: JobPost) => {
        setJobPost(data);
        setLoading(false);
      })
      .catch((error: any) => {
        console.error("Error fetching job post:", error);
        setLoading(false);
      });
  }, [id]);

  const handleApply = async () => {
    if (!jobPost) return;
    try {
      await applyToJobPost(jobPost.id);
      setSuccess("Application submitted successfully!");
      setError(null);
    } catch (error) {
      console.error("Error applying to job post:", error);
      setError("Failed to apply for the job.");
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mt-4 mx-auto" />;
  if (!jobPost) return <p className="text-center mt-4">Job post not found.</p>;

  return (
    <Container className="mt-4">
      <Helmet>
        <title>{jobPost.title} - Jobster</title>
      </Helmet>

      {/* Job Post Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>{jobPost.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{jobPost.companyName}</Card.Subtitle>
          <Card.Text>
            <strong>Location:</strong> {jobPost.location} <br />
            <strong>Job Type:</strong> {jobPost.jobType} ({jobPost.contractType}) <br />
            <strong>Experience Level:</strong> {jobPost.experienceLevel} <br />
            <strong>Monthly Salary:</strong> ${jobPost.monthlySalary} <br />
            <strong>Remote:</strong> {jobPost.remote ? "Yes" : "No"} <br />
            <strong>Job Function:</strong> {jobPost.jobFunction} <br />
            <strong>Skills Required:</strong> {jobPost.demandedSkills} <br />
            <strong>Description:</strong> {jobPost.description}
          </Card.Text>

          {/* Apply Button for Job Seekers */}
          {roles?.includes("ROLE_JOB_SEEKER") && (
            <Button variant="primary" className="mt-3" onClick={handleApply}>
              Apply
            </Button>
          )}
        </Card.Body>
      </Card>

      {/* Success and Error Alerts */}
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
}
