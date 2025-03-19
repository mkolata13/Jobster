import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobPost } from "../api/jobPosts";
import { Container, Spinner, Button } from "react-bootstrap";
import { JobPost } from "../types/JobPost";
import { Helmet } from "react-helmet-async";

export default function JobPostDetails() {
  const { id } = useParams<{ id: string }>();
  const [jobPost, setJobPost] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);

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
      <Button variant="primary" className="mt-3">Apply</Button>
    </Container>
  );
}
