import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";

const VotingPage = () => {
  const [positions, setPositions] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const { electionId } = useParams();
  const electionIdd = parseInt(electionId);

  // Fetch positions for election
  const fetchPositions = () => {
    fetch(
      `http://localhost:5231/api/Position/electionId?electionId=${electionIdd}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("failed to load positions data");
        return response.json();
      })
      .then((data) => {
        setPositions(data);
      })
      .catch((error) => {
        console.error("failed to load positions from db", error);
        alert("failed to load data");
      });
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const currentPosition = positions[currentPositionIndex];
  const isLastPosition = currentPositionIndex === positions.length - 1;

  // Select candidate for the current position
  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidates((prev) => {
      const existing = prev.find(
        (c) => c.positionId === currentPosition.id
      );
      if (existing) {
        // Replace existing choice
        return prev.map((c) =>
          c.positionId === currentPosition.id
            ? { ...c, candidateId }
            : c
        );
      } else {
        // Add new choice
        return [
          ...prev,
          { positionId: currentPosition.id, candidateId },
        ];
      }
    });
  };

  const handleNext = () => {
    if (currentPositionIndex < positions.length - 1) {
      setCurrentPositionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPositionIndex > 0) {
      setCurrentPositionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitVote = () => {
    const payload = {
      electionId: electionIdd,
      selectedCandidates, // already in array format
    };

    console.log("Submitting payload:", payload);

    fetch("http://localhost:5231/Api/Vote", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to submit vote");
        return response.json();
      })
      .then((data) => {
        console.log(data);
        alert("Vote submitted successfully!");
      })
      .catch((error) => {
        console.error("Error submitting vote:", error);
        alert("Failed to submit vote");
      });
  };

  if (positions.length === 0) {
    return (
      <div className="flex items-center justify-center text-teal-400">
        <Spinner />
      </div>
    );
  }

  const selectedForCurrent =
    selectedCandidates.find((c) => c.positionId === currentPosition.id)
      ?.candidateId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cast Your Vote
          </h1>
          <p className="text-gray-600">
            Your voice matters. Select your preferred candidates for each
            position.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Position {currentPositionIndex + 1} of {positions.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(
                ((currentPositionIndex + 1) / positions.length) * 100
              )}
              % Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentPositionIndex + 1) / positions.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Current Position */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {currentPosition.name}
            </h2>
            <p className="text-gray-600">{currentPosition.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPosition.candidates.map((candidate) => {
              const candidateName = `${candidate.firstName} ${candidate.lastName}`;
              const imageUrl = `http://localhost:5231${candidate.imageUrl}`;

              return (
                <div
                  key={candidate.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedForCurrent === candidate.id
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                  }`}
                  onClick={() => handleCandidateSelect(candidate.id)}
                >
                  <div className="text-center">
                    <img
                      src={imageUrl}
                      alt={candidateName}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {candidateName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {candidate.description}
                    </p>
                    <div
                      className={`w-6 h-6 rounded-full border-2 mx-auto ${
                        selectedForCurrent === candidate.id
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedForCurrent === candidate.id && (
                        <svg
                          className="w-4 h-4 text-white mx-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentPositionIndex === 0}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentPositionIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Previous
          </button>

          {!isLastPosition ? (
            <button
              onClick={handleNext}
              disabled={!selectedForCurrent}
              className={`px-8 py-2 rounded-lg font-medium ${
                !selectedForCurrent
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next Position
            </button>
          ) : (
            <button
              onClick={handleSubmitVote}
              disabled={!selectedForCurrent}
              className={`px-8 py-2 rounded-lg font-medium ${
                !selectedForCurrent
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Submit Vote
            </button>
          )}
        </div>

        {/* Selections Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Your Selections
          </h3>
          <div className="space-y-2">
            {positions.map((position) => {
              const selected = selectedCandidates.find(
                (c) => c.positionId === position.id
              );
              if (!selected) return null;

              const candidate = position.candidates.find(
                (c) => c.id === selected.candidateId
              );
              return (
                <div
                  key={position.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <span className="text-gray-600">{position.name}:</span>
                  <span className="font-medium text-gray-800">
                    {candidate?.firstName} {candidate?.lastName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;
