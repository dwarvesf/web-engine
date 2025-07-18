import React, { PropsWithChildren } from 'react';
import Slider from './ui/slider';

interface CSRSliderProps {
  className?: string;
}

const CSRSlider: React.FC<PropsWithChildren<CSRSliderProps>> = ({
  className,
  children,
}) => {
  return (
    <div className={className}>
      <Slider
        autoplaySpeed={8000}
        arrows={false}
        autoplay={true}
        dots={true}
        infinite={true}
        pauseOnHover={true}
      >
        {children}
      </Slider>
    </div>
  );
};

export default CSRSlider;
