import React, { useState } from 'react';
import '../styles/Components.css';

const ArtistVote = ({ artist, onVote, hasVoted }) => {
  const [voting, setVoting] = useState(false);

  const handleVote = async () => {
    setVoting(true);
    await onVote(artist._id);
    setVoting(false);
  };

  return (
    <div className="artist-card">
      <div className="artist-image">
        <img src={artist.image || '/default-artist.jpg'} alt={artist.name} />
      </div>
      <div className="artist-info">
        <h4>{artist.name}</h4>
        <p className="genre">{artist.genre}</p>
        <p className="bio">{artist.bio}</p>
        <div className="vote-info">
          <span className="votes">{artist.votes} Votes</span>
          <button 
            className={`btn-vote ${hasVoted ? 'voted' : ''}`}
            onClick={handleVote}
            disabled={voting || hasVoted}
          >
            {hasVoted ? 'Voted' : 'Vote'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistVote;
