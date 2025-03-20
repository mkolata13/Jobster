import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobPost, applyToJobPost } from "../api/jobPosts";
import { Container, Spinner, Button, Alert } from "react-bootstrap";
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
      <h2>{jobPost.title}</h2>
      <p><strong>Company:</strong> {jobPost.companyName}</p>
      <p><strong>Location:</strong> {jobPost.location}</p>
      <p><strong>Job Type:</strong> {jobPost.jobType} ({jobPost.contractType})</p>
      <p><strong>Experience Level:</strong> {jobPost.experienceLevel}</p>
      <p><strong>Monthly Salary:</strong> ${jobPost.monthlySalary}</p>
      <p><strong>Remote:</strong> {jobPost.remote ? "Yes" : "No"}</p>
      <p><strong>Job Function:</strong> {jobPost.jobFunction}</p>
      <p><strong>Skills Required:</strong> {jobPost.demandedSkills}</p>
      <p><strong>Description:</strong> {jobPost.description}</p>

      {roles?.includes("ROLE_JOB_SEEKER") && (
        <Button variant="primary" className="mt-3" onClick={handleApply}>
          Apply
        </Button>
      )}

      {success && <Alert variant="success" className="mt-3">{success}</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
}
