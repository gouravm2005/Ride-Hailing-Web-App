import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, MapPin, Shield, Clock, Bell, CreditCard, Users, ArrowRight, Menu, X, Play, CheckCircle, Route } from 'lucide-react';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated Features
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Ride Booking",
      description: "Book a ride instantly with accurate pickup and destination points."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Driver Matching",
      description: "Get matched with nearby verified drivers in seconds."
    },
    {
      icon: <Route className="w-8 h-8" />,
      title: "Live Ride Tracking",
      description: "Track your ride in real-time with ETA updates."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Real-time Notifications",
      description: "Stay updated on every action with instant notifications."
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Seamless Payments",
      description: "Pay easily and securely through multiple payment options."
    }
  ];

  const handlenavigateUser = () => {
    navigate('/userSignup');
  };

  const handlenavigateCaptain = () => {
    navigate('/captainSignup');
  };

  const stats = [
    { number: "860K", label: "Rides / month" },
    { number: "45K", label: "Active drivers" },
    { number: "120", label: "Cities served" },
    { number: "4.9", label: "Avg. rating" }
  ];

  const testimonials = [
    {
      name: "Sara K.",
      role: "Frequent Rider",
      rating: 5,
      comment: "EzRyde has transformed my daily commute. Always reliable, professional drivers, and competitive prices!"
    },
    {
      name: "Anuj R.",
      role: "Student",
      rating: 5,
      comment: "As a student, I love the affordable rates and the safety features. Never had a bad experience!"
    },
    {
      name: "Ramesh P.",
      role: "Driver Partner",
      rating: 5,
      comment: "Great platform for drivers! Flexible hours, good earnings, and excellent support team."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                EzRyde
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`font-medium hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                Features
              </a>
              <a href="#how-it-works" className={`font-medium hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                How it Works
              </a>
              <a href="#testimonials" className={`font-medium hover:text-blue-600 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                Reviews
              </a>
              <button
                onClick={handlenavigateUser}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                Features
              </a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                How it Works
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                Reviews
              </a>
              <button
                onClick={handlenavigateUser}
                className="w-full mt-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="block">EzRyde</span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium mt-3 text-blue-200">
              Every Ride, A Step Ahead
            </span>
          </h1>

          <p className="text-xl sm:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Experience the future of transportation with safe, reliable, and affordable rides at your fingertips.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={handlenavigateUser}
              className="group bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Book Your Ride
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              EzRyde brings real-world ride-hailing experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From booking to payment — the flow is smooth and user-friendly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Book Ride</h3>
              <p className="text-gray-600 leading-relaxed">
                Enter pickup & destination, then request a ride instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Driver Match</h3>
              <p className="text-gray-600 leading-relaxed">
                Nearest verified driver accepts your ride request.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ride Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Track your ride live with ETA updates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                4
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">End & Pay</h3>
              <p className="text-gray-600 leading-relaxed">
                End ride, confirm payment, and rate your experience.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button onClick={handlenavigateUser} className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105">
              Start Riding Now
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join early adopters experiencing EzRyde for their daily transportation needs..
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Try the Platform?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of users who have made EzRyde their preferred choice for reliable transportation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handlenavigateUser}
              className="group bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <Users className="inline-block mr-2 w-5 h-5" />
              Book a Ride
            </button>
            <button
              onClick={handlenavigateCaptain}
              className="group border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              <Car className="inline-block mr-2 w-5 h-5" />
              Become a Driver
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">EzRyde</span>
              </div>
              <p className="text-gray-400 max-w-md">
                A ride-hailing platform built with MERN stack for project showcase. Not an actual service, but a real experience simulation.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div> <h3 className="font-bold mb-4">Support</h3> <ul className="space-y-2 text-gray-400"> <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li> <li><a href="#" className="hover:text-white transition-colors">Safety</a></li> <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li> </ul> </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} EzRyde Project. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
