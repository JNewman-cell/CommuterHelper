import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Row, Col, Table, Alert } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Route, Router, Routes, Link } from 'react-router-dom';
import TimeDropdown from './components/TimeDropdown';
import AddressAutocomplete from './components/AddressAutocomplete';
import { db } from './firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

import "./CommutePage.css"
import { useAuth } from './contexts/AuthContext';

const CommutePage = () => {
    const [homeAddress, setHomeAddress] = useState('');
    const [workAddress, setWorkAddress] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [error, setError] = useState('');
    const [userCommute, setUserCommute] = useState([]);
    const { currentUser } = useAuth();
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        // Set departureDate to today by default
        const today = new Date().toISOString().split('T')[0];
        setDepartureDate(today);
        // Set departureTime to a default time when the component mounts
        // You can adjust the default time as needed
        setDepartureTime('8:00 AM');
        
    }, []); // Empty dependency array ensures the effect runs only once

    useEffect(() => {
        // This effect runs whenever commuteData changes
        const resetValues = () => {
          setHomeAddress('');
          setWorkAddress('');
          setDepartureTime('8:00 AM');
        };
    
        // If there is data in commuteData, reset the values
        if (userCommute.length > 0) {
          resetValues();
        }
      }, [userCommute]);

    const fetchCommuteData = async () => {
        try {
            // Create a reference to the Firestore document
            const userDocRef = doc(db, 'users', currentUser.uid);

            // Get the document snapshot
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                // If the document exists, extract the commute data
                const { home, work, departureTime } = userDocSnapshot.data();

                if (home && work && departureTime)
                {
                    // Update state with the fetched commute data
                    setUserCommute([{ home, work, departureTime }]);
                }
                console.log('Commute data fetched successfully:', { home, work, departureTime });
            } else {
                console.log('No commute data found for the user');
            }
        } catch (error) {
            console.error('Error fetching commute data:', error);
        }
    };

    useEffect(() => {
        // Fetch commute data when the component mounts
        fetchCommuteData();
    }, [currentUser.uid, db]); // Add dependencies if needed

    const planCommute = async () => {
        if (!homeAddress && !await isValidAddress(homeAddress)) {
                setError('Please enter a valid home address.');
                return;
        }
        if (!workAddress && !await isValidAddress(workAddress)) {
        setError('Please enter a valid work address.');
        return;
        }
        
        // Validate if departureTime is selected before planning the commute
        if (!departureTime) {
            setError('Please select a departure time.');
            return;
        }

        // Reset error when planning the commute is successful
        setError('');
        
        const selectedTimeParts = departureTime.split(' ');
        const time = selectedTimeParts[0];
        const meridiem = selectedTimeParts[1];
        const [hours, minutes] = time.split(':');
        const machineReadableTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

        if (meridiem === 'PM') {
            const militaryHours = parseInt(hours, 10) + 12;
            machineReadableTime = `${militaryHours}:${minutes}`;
        }

        const combinedDepartureTime = `${departureDate}T${machineReadableTime}`;

        // Create a reference to the Firestore collection
        const userDocRef = doc(db, 'users', currentUser.uid);
    
        // Set information for the user
        const commuteData = {
            home: homeAddress,
            work: workAddress,
            departureTime: combinedDepartureTime
            // Add other user-specific data as needed
        };

        try {
            await setDoc(userDocRef, commuteData, { merge: true });
            console.log('Commute data updated successfully');
            const {home, work, departureTime} = commuteData
            setHomeAddress('');
            setDepartureTime('8:00 AM');
            setWorkAddress('');
            setResetKey((prevKey) => prevKey + 1);
            setUserCommute([{ home, work, departureTime }]);
        } catch (error) {
            console.error('Error updating commute data:', error);
        }
        
    };

    const isValidAddress = async (address) => {
        // Use a geocoding service to validate the address
        // For example, using Google Maps Geocoding API
        const apiKey = 'GOOGLE_MAPS_API_KEY';
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
        const data = await response.json();
    
        return data.results.length > 0;
    };

    const formatTimeForDisplay = (timeString) => {
        const [datePart, timePart] = timeString.split('T');
        const [hours, minutes] = timePart.substring(0, 5).split(':');
      
        // Convert hours to 12-hour format with AM/PM
        const formattedHours = parseInt(hours, 10) % 12 || 12;
        
        return `${formattedHours}:${minutes} ${hours < 12 ? 'AM' : 'PM'}`;
      };      

    const handleHomeAddressChange = (address) => {
        setHomeAddress(address);
        console.log(address);
    };

    const handleWorkAddressChange = (address) => {
        setWorkAddress(address);
    };

    return (
        <div className='commutebody bg-light'>
            <div className='menu-bar'>
                <div className='group'>
                    <Link to="/signup" className="title">
                        Commuter Helper
                    </Link>
                </div>
                <div className='group'>
                    { (!currentUser) ? <div>
                        <Link to="/signup" className="signUp">
                            Sign Up
                        </Link>
                        <Link to="/login" className="item">
                            Login
                        </Link>
                    </div> :
                        <div>
                            <Link to="/dashboard" className="item">
                                Log out
                            </Link>
                        </div>
                    }
                </div>
            </div>

            {currentUser ? (
            <div className="bg-light p-5">
                <Form className="custom-form">
                    {error && <Alert variant="danger">{error}</Alert>}

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group controlId="homeAddress" className='address-form-group'>
                                <Form.Label>Enter Your Home Address:</Form.Label>
                                <AddressAutocomplete
                                key={resetKey}
                                value={homeAddress}
                                onChange={handleHomeAddressChange}
                                placeholder="Home address"
                                className="w-75 address-autocomplete"
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group controlId="workAddress" className='address-form-group'>
                                <Form.Label>Enter Your Work Address:</Form.Label>
                                <AddressAutocomplete
                                key={resetKey}
                                value={workAddress}
                                onChange={handleWorkAddressChange}
                                placeholder="Work address"
                                className="w-75 address-autocomplete"
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <div className="pt-5"></div>
                    <div className="pt-5"></div>
                    <div className="pt-5"></div>
                    <div className="pt-5"></div>


                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group controlId="departureTime" className="mt-4">
                                <Form.Label>Departure Time:</Form.Label>
                                <TimeDropdown
                                selectedTime={departureTime}
                                onTimeChange={(newTime) => setDepartureTime(newTime)}
                                required
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-6 d-flex align-items-end justify-content-start">
                            <Button variant="primary" onClick={planCommute} className="btn-lg">
                                Plan Commute
                            </Button>
                        </div>
                    </div>
                </Form>

                {/* Display the user's commutes in a table */}
                <div className='d-flex w-100 justify-content-center m-2'>
                    <h2>Your Scheduled Commute</h2>
                </div>
                <div className="d-flex justify-content-center mt-5 bg-light">
                    <Table className='custom-table'>
                        <thead>
                            <tr>
                                <th>Home Address</th>
                                <th>Work Address</th>
                                <th>Departure Time</th>
                                {/* Add additional columns if needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {userCommute.map((commute, index) => (
                                <tr key={index}>
                                    <td>{commute.home}</td>
                                    <td>{commute.work}</td>
                                    <td>{formatTimeForDisplay(commute.departureTime)}</td>
                                    {/* Add additional cells if needed */}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>)
            : null}
        </div>
    );
};

export default CommutePage;
