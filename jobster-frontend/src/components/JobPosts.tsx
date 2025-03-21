import { useEffect, useState } from "react";
import { getJobPosts } from "../api/jobPosts";
import { Container, Row, Col, Spinner, Form, Button } from "react-bootstrap";
import JobPostCard from "./JobPostCard";
import { JobPost } from "../types/JobPost";
import { Helmet } from "react-helmet-async";
import { ContractType } from "../enums/ContractType";
import { ExperienceLevel } from "../enums/ExperienceLevel";
import { JobType } from "../enums/JobType";

export default function JobPosts() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [contractCategory, setContractCategory] = useState<string>("");
  const [experienceCategory, setExperienceCategory] = useState<string>("");
  const [jobTypeCategory, setJobTypeCategory] = useState<string>("");
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
    const filtered = jobPosts.filter((job) => {
      const matchesSearchTerm =
        job.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesContractType =
        !contractCategory || job.contractType === contractCategory;
      const matchesExperienceLevel =
        !experienceCategory || job.experienceLevel === experienceCategory;
      const matchesJobType =
        !jobTypeCategory || job.jobType === jobTypeCategory;

      return (
        matchesSearchTerm &&
        matchesContractType &&
        matchesExperienceLevel &&
        matchesJobType
      );
    });
    setFilteredPosts(filtered);
  }, [
    searchTerm,
    contractCategory,
    experienceCategory,
    jobTypeCategory,
    jobPosts,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setContractCategory("");
    setExperienceCategory("");
    setJobTypeCategory("");
  };

  if (loading) return <Spinner animation="border" className="d-block mt-4 mx-auto" />;

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
            <Form.Select
              value={contractCategory}
              onChange={(e) => setContractCategory(e.target.value)}
            >
              <option value="">All Contract Types</option>
              {Object.values(ContractType).map((contract) => (
                <option key={contract} value={contract}>
                  {contract}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={6}>
            <Form.Select
              value={experienceCategory}
              onChange={(e) => setExperienceCategory(e.target.value)}
            >
              <option value="">All Experience Levels</option>
              {Object.values(ExperienceLevel).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Select
              value={jobTypeCategory}
              onChange={(e) => setJobTypeCategory(e.target.value)}
            >
              <option value="">All Job Types</option>
              {Object.values(JobType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Button variant="secondary" className="mt-3" onClick={clearFilters}>
          Clear Search
        </Button>
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
