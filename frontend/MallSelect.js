import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function MallSelect() {
  const [malls, setMalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMalls();
  }, []);

  const fetchMalls = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(`${API}/api/malls`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMalls(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load malls. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMallSelect = (mallId) => {
    navigate(`/slots/${mallId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            background: "#fff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px"
          }}>
            🅿️
          </div>
          <h1 style={{
            color: "#fff",
            fontSize: "28px",
            fontWeight: "700",
            margin: 0
          }}>Smart Parking</h1>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 24px",
            background: "rgba(255, 255, 255, 0.2)",
            color: "#fff",
            border: "2px solid #fff",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#fff";
            e.target.style.color = "#667eea";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.2)";
            e.target.style.color = "#fff";
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          padding: "48px 40px"
        }}>
          <h2 style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#1a202c",
            margin: "0 0 8px"
          }}>Select a Mall</h2>
          <p style={{
            color: "#718096",
            fontSize: "16px",
            margin: "0 0 32px"
          }}>
            Choose a shopping mall to view available parking slots
          </p>

          {/* Error Message */}
          {error && (
            <div style={{
              background: "#fee",
              border: "1px solid #fcc",
              color: "#c33",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "24px",
              fontSize: "14px"
            }}>
              {error}
              <button
                onClick={fetchMalls}
                style={{
                  marginLeft: "12px",
                  padding: "4px 12px",
                  background: "#c33",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                border: "4px solid #e2e8f0",
                borderTopColor: "#667eea",
                borderRadius: "50%",
                margin: "0 auto 16px",
                animation: "spin 1s linear infinite"
              }} />
              <p style={{ color: "#718096", fontSize: "16px" }}>Loading malls...</p>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* Malls Grid */}
          {!loading && malls.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px"
            }}>
              {malls.map((mall) => (
                <div
                  key={mall._id || mall.id}
                  onClick={() => handleMallSelect(mall._id || mall.id)}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "12px",
                    padding: "32px 24px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: "56px",
                    height: "56px",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    marginBottom: "16px"
                  }}>
                    🏬
                  </div>

                  {/* Mall Name */}
                  <h3 style={{
                    color: "#fff",
                    fontSize: "24px",
                    fontWeight: "700",
                    margin: "0 0 8px"
                  }}>
                    {mall.name}
                  </h3>

                  {/* Mall Details */}
                  {mall.location && (
                    <p style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: "14px",
                      margin: "0 0 8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span>📍</span> {mall.location}
                    </p>
                  )}

                  {mall.totalSlots !== undefined && (
                    <p style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: "14px",
                      margin: "0",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span>🚗</span> {mall.availableSlots || 0} / {mall.totalSlots} slots available
                    </p>
                  )}

                  {/* Arrow Icon */}
                  <div style={{
                    position: "absolute",
                    bottom: "24px",
                    right: "24px",
                    width: "32px",
                    height: "32px",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    color: "#fff"
                  }}>
                    →
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && malls.length === 0 && !error && (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#718096"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🏬</div>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1a202c",
                margin: "0 0 8px"
              }}>No Malls Available</h3>
              <p style={{ margin: "0", fontSize: "14px" }}>
                There are no malls in the system yet. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}