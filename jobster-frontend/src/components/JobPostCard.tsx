import { Card, Button } from "react-bootstrap";
import { JobPost } from "../types/JobPost";

interface JobPostCardProps {
  job: JobPost;
}

export default function JobPostCard({ job }: JobPostCardProps) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{job.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {job.companyName} - {job.location} {job.remote ? "(Remote)" : ""}
        </Card.Subtitle>
        <Card.Text>
          <strong>Job Function:</strong> {job.jobFunction} <br />
          <strong>Experience:</strong> {job.experienceLevel} <br />
          <strong>Salary:</strong> ${job.monthlySalary.toLocaleString()} / month <br />
          <strong>Contract:</strong> {job.contractType} <br />
          <strong>Job Type:</strong> {job.jobType} <br />
          {job.description.substring(0, 100)}...
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
