import React, { createContext, useState } from 'react';
import axios from 'axios';
import { experiences as dummyExperiences } from '../assets/assets'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Ensure axios has a usable baseURL. Prefer VITE_BACKEND_URL, otherwise fall back
// to localhost:5000 so dev requests go to the API server instead of the dev server.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
axios.defaults.baseURL = BACKEND_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Here we will define all the global states and functions that we want to share across our app

    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY;

    // tokens/auth removed - app uses public, no-login flow
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    // experiences list (renamed from cars) and a filtered view used by search
    const [experiences, setExperiences] = useState([]);
    const [filteredExperiences, setFilteredExperiences] = useState([]);

    // Now some function to get data from the backend
    
    // No auth: fetchUser removed. Keep user state for optional owner flows.

    // Function to fetch all experiences from the backend
    const fetchExperiences = async () => {
        // If no backend URL is configured, use bundled dummy experiences
        const backend = import.meta.env.VITE_BACKEND_URL;
        if (!backend) {
            setExperiences(dummyExperiences);
            setFilteredExperiences(dummyExperiences);
            return;
        }

        try {
            const {data} = await axios.get('/api/experiences');
            if (data && data.success) {
                setExperiences(data.experiences || []);
                setFilteredExperiences(data.experiences || []);
            } else {
                // if backend responded but with non-success, fall back to local data
                toast.error(data?.message || 'Failed to load experiences from server — using local data');
                setExperiences(dummyExperiences);
                setFilteredExperiences(dummyExperiences);
            }
        } catch (error) {
            // network / connection refused -> fall back to bundled data
            if (!error.response) {
                // silent fallback for offline/dev convenience
                setExperiences(dummyExperiences);
                setFilteredExperiences(dummyExperiences);
                toast.error('Backend unreachable — using local demo data');
                return;
            }
            toast.error(error.message || 'Error loading experiences');
        }
    };



    // initial data fetch (experiences)
    useEffect(() => {
        fetchExperiences();
    }, []);

    // expose both new and old keys for a smooth transition
    const value = {
        navigate, currency, axios,
        experiences, setExperiences,
        filteredExperiences, setFilteredExperiences,
        fetchExperiences,

        // expose date/time selection so pages can read/update selections
        pickupDate, setPickupDate, returnDate, setReturnDate,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};





// Now we have to provide the suport of this appcontext to our entire app
// So we will go to main.jsx and wrap our app with this AppProvider