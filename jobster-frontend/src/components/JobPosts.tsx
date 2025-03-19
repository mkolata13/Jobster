import { useEffect, useState } from "react";
import { getJobPosts } from "../api/jobPosts";
import { Container, Row, Col, Spinner, Form } from "react-bootstrap";
import JobPostCard from "./JobPostCard";
import { JobPost } from "../types/JobPost";
import { Helmet } from "react-helmet-async";

export default function JobPosts() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<JobPost[]>([]);

  useEffect(() => {
    getJobPosts()
      .then((data: JobPost[]) => {
        setJobPosts(data);
        setFilteredPosts(data);
        setLoading(false);
      })
      .catch((error: any) => {
        console.error("Error fetching job posts:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = jobPosts.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (category === "" || job.experienceLevel === category)
    );
    setFilteredPosts(filtered);
  }, [searchTerm, category, jobPosts]);

  if (loading) return <Spinner animation="border" className="d-block mt-4 mx-auto" />;

  const categories = Array.from(new Set(jobPosts.map((job) => job.experienceLevel)));

  return (
    <Container className="mt-4">
      <Helmet>
        <title>Home - Jobster</title>
      </Helmet>
      <h2 className="mb-4">Latest Job Posts</h2>
      <Form className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search job titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={6}>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Form>
      <Row>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((job) => (
            <Col key={job.id} md={6} lg={4}>
              <JobPostCard job={job} />
            </Col>
          ))
        ) : (
          <p className="text-center w-100">No job posts found.</p>
        )}
      </Row>
    </Container>
  );
}
