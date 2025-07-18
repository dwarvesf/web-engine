import React, { Component, ReactNode } from 'react';
import { cn } from '../../utils';

interface ArrowProps {
  onClick?: () => void;
  rel: 'prev' | 'next';
  className?: string;
}

const Arrow: React.FC<ArrowProps> = ({ onClick, rel, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'slick-arrow py-3 text-3xl text-gray-600 transition-colors hover:text-gray-800 focus:outline-none',
        `slick-${rel}`,
        className,
      )}
      aria-label={`${rel === 'next' ? 'Next' : 'Previous'} slide`}
    >
      {rel === 'next' ? (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
        </svg>
      ) : (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
        </svg>
      )}
    </button>
  );
};

interface SliderSettings {
  arrows?: boolean;
  dots?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  easing?: string;
  autoplay?: boolean;
  autoplaySpeed?: number;
  infinite?: boolean;
  fade?: boolean;
  cssEase?: string;
  pauseOnHover?: boolean;
  className?: string;
}

interface SliderProps extends SliderSettings {
  children: ReactNode;
  className?: string;
}

interface SliderState {
  loaded: boolean;
  Slider?: any;
}

const defaultSettings: SliderSettings = {
  arrows: true,
  dots: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  easing: 'ease-in',
  autoplay: false,
  autoplaySpeed: 3000,
  infinite: true,
  fade: false,
  cssEase: 'ease',
  pauseOnHover: true,
};

class Slider extends Component<SliderProps, SliderState> {
  state: SliderState = { loaded: false };

  componentDidMount() {
    // Dynamic import for react-slick to support SSR
    import('react-slick')
      .then(m => {
        this.setState({
          loaded: true,
          Slider: m.default,
        });
      })
      .catch(err => {
        console.error('Failed to load react-slick:', err);
      });
  }

  render() {
    const { children, className, ...settings } = this.props;
    const { loaded, Slider: SlickSlider } = this.state;

    const sliderSettings = {
      ...defaultSettings,
      ...settings,
      prevArrow: <Arrow rel="prev" />,
      nextArrow: <Arrow rel="next" />,
      dotsClass: 'slick-dots mt-4',
      appendDots: (dots: ReactNode) => (
        <div>
          <ul className="flex justify-center">{dots}</ul>
        </div>
      ),
      customPaging: (i: number) => (
        <button
          id={`slider-dot-${i}`}
          type="button"
          className="focus:ring-primary mx-1 inline-block rounded p-1 focus:ring-2 focus:outline-none"
          aria-label={`Go to slide ${i + 1}`}
          title={`Go to slide ${i + 1}`}
        >
          <div className="slick-paging h-2 w-2 rounded-full bg-gray-300 transition-colors hover:bg-gray-400" />
        </button>
      ),
    };

    if (!loaded) {
      // Render first child during SSR or while loading
      const firstChild = React.Children.toArray(children)[0] || null;
      return (
        <div className={cn('slider-loading', className)}>{firstChild}</div>
      );
    }

    return (
      <div className={cn('slider-container', className)}>
        <SlickSlider {...sliderSettings}>{children}</SlickSlider>
      </div>
    );
  }
}

export default Slider;
