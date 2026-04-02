import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import artistService from '../services/artistService';
import ArtistVote from '../components/ArtistVote';
import '../styles/Pages.css';
import { toast } from 'react-toastify';

const ArtistVoting = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userVotes, setUserVotes] = useState([]);

  useEffect(() => {
    fetchArtists();
  }, [eventId]);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const data = await artistService.getArtistsByEvent(eventId);
      setArtists(data);
      // Get user's votes from local storage or API
      const votes = JSON.parse(localStorage.getItem(`event_${eventId}_votes`) || '[]');
      setUserVotes(votes);
    } catch (error) {
      toast.error('Failed to fetch artists');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (artistId) => {
    try {
      await artistService.voteForArtist(artistId);
      const newVotes = [...userVotes, artistId];
      setUserVotes(newVotes);
      localStorage.setItem(`event_${eventId}_votes`, JSON.stringify(newVotes));
      toast.success('Vote submitted successfully!');
      fetchArtists();
    } catch (error) {
      toast.error('Failed to vote for artist');
    }
  };

  return (
    <div className="artist-voting-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="page-header">
        <h1>Vote for Your Favorite Artists</h1>
        <p>Help shape the event's entertainment lineup</p>
      </div>

      {loading ? (
        <div className="loading">Loading artists...</div>
      ) : artists.length > 0 ? (
        <div className="artists-grid">
          {artists.map(artist => (
            <ArtistVote
              key={artist._id}
              artist={artist}
              onVote={handleVote}
              hasVoted={userVotes.includes(artist._id)}
            />
          ))}
        </div>
      ) : (
        <div className="no-events">
          <p>No artists for this event yet</p>
        </div>
      )}
    </div>
  );
};

export default ArtistVoting;
