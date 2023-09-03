import React, { useEffect } from "react";
import { Space } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetchAuthenticated from "../hooks/useFetchAuthenticated";

const PatreonRedirect: React.FC = () => {
  const { result, fetchAuthenticated } = useFetchAuthenticated();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (result) {
      console.log("Acquiring Token");
      console.log("Redirect params", Array.from(searchParams.entries()));
      if (searchParams.has("code")) {
        fetchAuthenticated(
          "http://localhost:8080/private/patreon?" + searchParams,
        ).finally(() => navigate("/"));
      }
    }
  }, [result, searchParams]);

  return (
    <Space>
      <p>Conectando a Patreon...</p>
    </Space>
  );
};

export default PatreonRedirect;
