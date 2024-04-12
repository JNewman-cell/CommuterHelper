import React from 'react';
import Autocomplete from 'react-google-autocomplete';

const AddressAutocomplete = ({ value, onChange, placeholder, className }) => {
  return(
    <Autocomplete
      apiKey="GOOGLE_MAPS_API_KEY"
      onPlaceSelected={(place) => {
        if (place && place.formatted_address) {
          const address = place.formatted_address;
          onChange(address);
        } else {
          console.log('No place selected or not enough information about the place');
        }
      }}    
      options={{
        types: ['address'],
        componentRestrictions: { country: 'us' },
      }}
      defaultValue={value}
      placeholder={placeholder}
      className={className}
    />
  )
};

export default AddressAutocomplete;