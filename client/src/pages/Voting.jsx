// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { getCandidates, castVote } from '../services/api';

// const Voting = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [candidates, setCandidates] = useState([]);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadCandidates();
//   }, []);

//   const loadCandidates = async () => {
//     try {
//       const response = await getCandidates(id);
//       setCandidates(response.data);
//     } catch (error) {
//       toast.error('Failed to load candidates');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVote = async () => {
//     if (!selectedCandidate) {
//       toast.error('Please select a candidate');
//       return;
//     }

//     try {
//       await castVote(id, selectedCandidate);
//       toast.success('Vote cast successfully!');
//       setTimeout(() => navigate('/voter'), 1500);
//     } catch (error) {
//       toast.error(error.response?.data?.msg || 'Voting failed');
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ textAlign: 'center', padding: '50px' }}>
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
//       <button 
//         onClick={() => navigate(-1)}
//         style={{ marginBottom: '20px', padding: '8px 16px' }}
//       >
//         ← Back
//       </button>

//       <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>Cast Your Vote</h1>

//       {candidates.length === 0 ? (
//         <p>No candidates available</p>
//       ) : (
//         <>
//           <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
//             {candidates.map(candidate => (
//               <div
//                 key={candidate._id}
//                 onClick={() => setSelectedCandidate(candidate._id)}
//                 style={{
//                   border: `2px solid ${selectedCandidate === candidate._id ? 'blue' : '#ccc'}`,
//                   padding: '15px',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   backgroundColor: selectedCandidate === candidate._id ? '#e6f3ff' : 'white'
//                 }}
//               >
//                 <h3 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>{candidate.name}</h3>
//                 <p style={{ margin: '0', color: '#666' }}>{candidate.party || 'Independent'}</p>
//               </div>
//             ))}
//           </div>

//           <button
//             onClick={handleVote}
//             disabled={!selectedCandidate}
//             style={{
//               width: '100%',
//               padding: '15px',
//               fontSize: '18px',
//               backgroundColor: !selectedCandidate ? '#ccc' : '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               cursor: !selectedCandidate ? 'not-allowed' : 'pointer'
//             }}
//           >
//             Confirm Vote
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Voting;







import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaUserCheck, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getCandidates, castVote } from '../services/api';

const Voting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    console.log('Election ID:', id);
    fetchCandidates();
  }, [id]);

  const fetchCandidates = async () => {
    try {
      console.log('Fetching candidates...');
      const response = await getCandidates(id);
      console.log('Candidates response:', response.data);
      setCandidates(response.data);
    } catch (error) {
      console.error('Fetch candidates error:', error);
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = (candidateId) => {
    console.log('Selected candidate:', candidateId);
    setSelectedCandidate(candidateId);
  };

  const handleVote = async () => {
    console.log('Vote button clicked');
    console.log('Selected candidate:', selectedCandidate);
    
    if (!selectedCandidate) {
      console.log('No candidate selected');
      toast.error('Please select a candidate');
      return;
    }

    setVoting(true);
    console.log('Casting vote for candidate:', selectedCandidate);
    
    try {
      const response = await castVote(id, selectedCandidate);
      console.log('Vote response:', response.data);
      toast.success('Vote cast successfully! 🎉');
      setTimeout(() => navigate('/voter'), 2000);
    } catch (error) {
      console.error('Vote error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.msg || 'Voting failed');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-primary-600">Cast Your Vote</h1>
        <p className="text-gray-600 mt-2">Select one candidate to vote</p>
      </motion.div>

      {candidates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg">No candidates available for this election</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {candidates.map((candidate, index) => (
              <motion.div
                key={candidate._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
                  selectedCandidate === candidate._id
                    ? 'border-4 border-primary-500 bg-primary-50'
                    : 'border border-gray-200 hover:border-primary-300'
                }`}
                onClick={() => handleCandidateSelect(candidate._id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <FaUserCheck className="text-3xl text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{candidate.name}</h3>
                    <p className="text-gray-600">{candidate.party || 'Independent'}</p>
                  </div>
                  {selectedCandidate === candidate._id && (
                    <FaCheckCircle className="text-3xl text-primary-600" />
                  )}
                </div>
                {candidate.manifesto && (
                  <p className="mt-4 text-gray-600 text-sm border-t pt-4">
                    {candidate.manifesto}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Vote Button */}
          <div className="fixed bottom-8 left-0 right-0 flex justify-center">
            <button
              onClick={handleVote}
              disabled={voting || !selectedCandidate}
              className={`px-12 py-4 text-lg font-semibold rounded-full shadow-2xl ${
                !selectedCandidate
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {voting ? 'Casting Vote...' : 'Confirm Vote'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Voting;



