import React, { useState } from 'react';
import { Mail, Phone, MapPin, Users, Target, Heart, Award, Globe, Shield } from 'lucide-react';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Kashish Barnwal',
     
      
    },
    {
      name: 'Sri Gayathri K',
      
      
    },
    {
      name: 'Asray Kumar',
     
    },
    {
      name: 'Manav Sahay',
      
    },
    {
      name: 'Sai Kamalesh',
     
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We prioritize building strong local communities and supporting neighborhood businesses.'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Every service provider is verified and background-checked for your peace of mind.'
    },
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'We maintain high standards through our rating system and quality assurance processes.'
    },
    {
      icon: Globe,
      title: 'Local Impact',
      description: 'Supporting local economies by keeping business within the community.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-400 opacity-20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-400 opacity-15 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              About Go Local
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto animate-fade-in-up leading-relaxed">
              Connecting communities through trusted local service partnerships. We believe everyone deserves 
              access to reliable, professional services while supporting their neighborhood economy.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Our Mission
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Goal</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To create a seamless platform where skilled local professionals can connect with 
                      customers who need reliable services, fostering trust and excellence in every interaction 
                      while strengthening community bonds.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Impact</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We prioritize building strong community connections, ensuring that both service 
                      providers and customers benefit from our platform while keeping economic value 
                      within local neighborhoods.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative animate-slide-in-right">
              <img
                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-lg">
                <div className="text-3xl font-bold">8K+</div>
                <div className="text-sm">Verified Providers</div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-2xl shadow-lg">
                <div className="text-3xl font-bold text-blue-600">25K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our commitment to the community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals working to make your local service experience exceptional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="text-center group animate-fade-in-up"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="relative inline-block mb-6">
                
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
               
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Description */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Platform overview"
                className="rounded-2xl shadow-xl w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl"></div>
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Project Overview</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Go Local is more than just a service marketplace - it's a community-driven platform 
                  that prioritizes trust, quality, and fair compensation for skilled local professionals.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We leverage cutting-edge technology to ensure secure transactions, efficient matching, 
                  and transparent communication between all parties involved, while maintaining a strong 
                  focus on supporting local economies.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">75K+</div>
                  <div className="text-sm text-gray-600">Jobs Completed</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact Information
            </h2>
            <p className="text-xl text-gray-600">
              Get in touch with us for any questions or support
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Email</h3>
                <p className="text-gray-600">support@golocal.com</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Phone</h3>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Office</h3>
                <p className="text-gray-600">123 Tech Park, Chennai<br />Tamil Nadu 600001</p>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl text-center">
              <h4 className="text-xl font-bold mb-4">Quick Response Guarantee</h4>
              <p className="text-blue-100 mb-6">
                We typically respond to all inquiries within 2 hours during business hours. 
                For urgent matters, please call our support line directly.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Online Support Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;