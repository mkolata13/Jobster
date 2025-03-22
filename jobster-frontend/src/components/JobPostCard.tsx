import { Card, Button } from "react-bootstrap";
import { JobPost } from "../types/JobPost";

interface JobPostCardProps {
  job: JobPost;
}

export default function JobPostCard({ job }: JobPostCardProps) {
  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <Card.Title>{job.title}</Card.Title>
        <Card.Subtitle className="text-muted mb-2">
          {job.companyName} - {job.location} {job.remote ? "(Remote)" : ""}
        </Card.Subtitle>
        <Card.Text>
          <strong>Job Function:</strong> {job.jobFunction} <br />
          <strong>Experience:</strong> {job.experienceLevel} <br />
          <strong>Contract:</strong> {job.contractType} <br />
          <strong>Job Type:</strong> {job.jobType} <br />
          <strong>Salary:</strong> ${job.monthlySalary.toLocaleString()}<br />
          <strong>Skills:</strong> {job.demandedSkills} <br />
        </Card.Text>
        <Button variant="primary" href={`/job-posts/${job.id}`}>
          View Details
        </Button>
      </Card.Body>
      <Card.Footer className="text-muted">
        Posted on {new Date(job.creationDate).toLocaleDateString()}
      </Card.Footer>
    </Card>
  );
}
