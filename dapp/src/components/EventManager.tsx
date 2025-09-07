'use client'
import { useWriteContract, useAccount, useReadContract } from 'wagmi'
import { parseAbi } from 'viem'
import React, { useState } from 'react'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/config/contracts'

// ABI pour l'EventManager (à ajouter dans contracts.ts)
const EVENT_MANAGER_ABI = parseAbi([
  'function createEvent(uint256[] _artistIds, uint256[] _artistShares, address _organizer, uint256 _date, string _metadataURI, uint256 _ticketPrice, uint256 _totalTickets) returns (uint256 eventId, address eventAddress)',
  'function getEventAddress(uint256 _eventId) returns (address)',
  'function getTotalEvents() returns (uint256)',
  'function getEventInfo(uint256 _eventId) returns (address eventAddress, address organizer, uint256 date, uint256 ticketPrice, uint256 totalTickets, uint256 soldTickets)'
]);

export const EventManager = () => {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  // État pour le formulaire de création d'événement
  const [eventForm, setEventForm] = useState({
    artistIds: '',
    artistShares: '',
    date: '',
    metadataURI: '',
    ticketPrice: '',
    totalTickets: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateEvent = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      // Validation des données
      const artistIds = eventForm.artistIds.split(',').map(id => parseInt(id.trim()));
      const artistShares = eventForm.artistShares.split(',').map(share => parseInt(share.trim()));
      const date = Math.floor(new Date(eventForm.date).getTime() / 1000);
      const ticketPrice = BigInt(parseFloat(eventForm.ticketPrice) * 1e18); // Convertir en wei

      if (artistIds.length !== artistShares.length) {
        setError('Le nombre d\'IDs d\'artistes doit correspondre au nombre de parts');
        return;
      }

      if (!address) {
        setError('Veuillez vous connecter avec votre wallet');
        return;
      }

      // Appel au contrat EventManager pour créer l'événement
      const result = await writeContractAsync({
        address: '0x...', // Adresse de l'EventManager (à remplacer après déploiement)
        abi: EVENT_MANAGER_ABI,
        functionName: 'createEvent',
        args: [
          artistIds,
          artistShares,
          address, // organizer
          date,
          eventForm.metadataURI,
          ticketPrice,
          parseInt(eventForm.totalTickets)
        ],
      });

      setSuccess(`Event created successfully! Transaction: ${result}`);
      
      // Reset form
      setEventForm({
        artistIds: '',
        artistShares: '',
        date: '',
        metadataURI: '',
        ticketPrice: '',
        totalTickets: '',
      });
      
    } catch (error) {
      console.error("Error creating event:", error);
      setError('Error creating event: ' + (error as Error).message);
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Event Manager</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label>
          Artist IDs (comma separated):<br />
          <input
            type="text"
            value={eventForm.artistIds}
            onChange={e => setEventForm({...eventForm, artistIds: e.target.value})}
            style={{ width: '100%', height: '38px', borderRadius: '8px', padding: '8px'}}
            placeholder="1,2,3"
            disabled={isPending}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Artist shares in % (comma separated):<br />
          <input
            type="text"
            value={eventForm.artistShares}
            onChange={e => setEventForm({...eventForm, artistShares: e.target.value})}
            style={{ width: '100%', height: '38px', borderRadius: '8px', padding: '8px'}}
            placeholder="40,30,20"
            disabled={isPending}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Event date:<br />
          <input
            type="datetime-local"
            value={eventForm.date}
            onChange={e => setEventForm({...eventForm, date: e.target.value})}
            style={{ width: '100%', height: '38px', borderRadius: '8px', padding: '8px'}}
            disabled={isPending}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Metadata URI:<br />
          <input
            type="text"
            value={eventForm.metadataURI}
            onChange={e => setEventForm({...eventForm, metadataURI: e.target.value})}
            style={{ width: '100%', height: '38px', borderRadius: '8px', padding: '8px'}}
            placeholder="ipfs://..."
            disabled={isPending}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Ticket price (ETH):<br />
          <input
            type="number"
            step="0.01"
            value={eventForm.ticketPrice}
            onChange={e => setEventForm({...eventForm, ticketPrice: e.target.value})}
            style={{ width: '100%', height: '38px', borderRadius: '8px', padding: '8px'}}
            placeholder="0.1"
            disabled={isPending}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Total number of tickets:<br />
          <input
            type="number"
            value={eventForm.totalTickets}
            onChange={e => setEventForm({...eventForm, totalTickets: e.target.value})}
            style={{ width: '100%', height: '38px', borderRadius: '8px', padding: '8px'}}
            placeholder="100"
            disabled={isPending}
          />
        </label>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

      <button 
        onClick={handleCreateEvent} 
        disabled={isPending}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          cursor: isPending ? 'not-allowed' : 'pointer'
        }}
      >
        {isPending ? 'Creating...' : 'Create Event'}
      </button>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>📝 Instructions:</h4>
        <p><strong>Artist IDs:</strong> Enter artist IDs separated by commas (e.g., 1,2,3)</p>
        <p><strong>Shares:</strong> Enter revenue percentages for each artist (e.g., 40,30,20)</p>
        <p><strong>Note:</strong> You must first deploy the EventManager contract to create events.</p>
      </div>
    </div>
  );
};
