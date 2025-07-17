import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { cn } from '../utils';
import Button from './ui/button';
import Section from './section';
import { appConfigService } from '../services/app-config';

interface Office {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface OfficeMapProps {
  className?: string;
  offices?: Office[];
  mapHeight?: number;
  mapApiKey?: string;
  officeMarkerIcon?: string;
}

const OfficeMap: React.FC<OfficeMapProps> = ({
  className,
  offices = [],
  mapHeight = 572,
  mapApiKey,
  officeMarkerIcon = '/content/contact/svg/office-location.svg',
}) => {
  const [selectedOffice, setSelectedOffice] = useState(0);

  const apiKey = mapApiKey || appConfigService.getValue('GOOGLE_API');

  const selectedOfficeData = offices[selectedOffice];

  const mapCenter = {
    lat: selectedOfficeData?.lat || 0,
    lng: selectedOfficeData?.lng || 0,
  };

  const mapContainerStyle = {
    width: '100%',
    height: `${mapHeight}px`,
  };

  const mapOptions = {
    zoom: 15,
    center: mapCenter,
    styles: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ saturation: 36 }, { color: '#000000' }, { lightness: 40 }],
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [
          { visibility: 'on' },
          { color: '#000000' },
          { lightness: 16 },
        ],
      },
      {
        featureType: 'all',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{ color: '#000000' }, { lightness: 20 }],
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#000000' }, { lightness: 17 }, { weight: 1.2 }],
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#000000' }, { lightness: 20 }],
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#000000' }, { lightness: 21 }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{ color: '#000000' }, { lightness: 17 }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#000000' }, { lightness: 29 }, { weight: 0.2 }],
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#000000' }, { lightness: 18 }],
      },
      {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#000000' }, { lightness: 16 }],
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#000000' }, { lightness: 19 }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#000000' }, { lightness: 17 }],
      },
    ],
    mapTypeControl: false, // Hide the map/satellite toggle
  };

  const onMarkerClick = useCallback((index: number) => {
    setSelectedOffice(index);
  }, []);

  if (!offices.length) {
    return null;
  }

  return (
    <Section fullWidth className={cn('pt-4 pb-16', className)}>
      <div>
        <div className="dwarves-container mb-6 flex w-full flex-wrap gap-2 md:justify-between">
          {offices.map((office, index) => (
            <Button
              key={office.name}
              variant="ghost"
              onClick={() => setSelectedOffice(index)}
              className={cn('text-sm', {
                'bg-primary-light/40': index === selectedOffice,
                'text-muted-foreground': index !== selectedOffice,
              })}
            >
              {office.name}
            </Button>
          ))}
        </div>

        <div className="bg-grayscale-100">
          <div className="text-center">
            <div className="mx-auto w-full overflow-hidden">
              {apiKey ? (
                <LoadScript googleMapsApiKey={apiKey}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={15}
                    options={mapOptions}
                  >
                    {offices.map((office, index) => (
                      <Marker
                        key={office.name}
                        position={{ lat: office.lat, lng: office.lng }}
                        onClick={() => onMarkerClick(index)}
                        icon={{
                          url: officeMarkerIcon,
                        }}
                      />
                    ))}
                  </GoogleMap>
                </LoadScript>
              ) : (
                <div
                  className="bg-grayscale-200 flex items-center justify-center rounded-lg"
                  style={{ height: `${mapHeight}px` }}
                >
                  <div className="text-center">
                    <div className="mb-2 text-3xl">📍</div>
                    <p className="text-foreground/70 text-sm">
                      Map API key required
                    </p>
                    <p className="text-foreground/50 text-xs">
                      Coordinates: {selectedOfficeData?.lat || 0},{' '}
                      {selectedOfficeData?.lng || 0}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default OfficeMap;
