import React from 'react';

const ProviderIllustration: React.FC = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="text-center">
                <div className="relative inline-block mb-8">
                    <img
                        src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400"
                        alt="Professional worker"
                        className="w-80 h-80 object-cover rounded-3xl shadow-2xl animate-float"
                    />
                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-2xl shadow-lg animate-bounce">
                        🔧
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 p-4 rounded-2xl shadow-lg">
                        <div className="text-2xl font-bold text-blue-600">8K+</div>
                        <div className="text-sm text-gray-600">Active Providers</div>
                    </div>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Join Our Professional Network
                </h3>
                <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
                    Showcase your skills, connect with local customers, and build your reputation
                    in our trusted community of service providers.
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">₹1,500</div>
                        <div className="text-gray-600">Avg. Daily Earnings</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">4.8★</div>
                        <div className="text-gray-600">Avg. Provider Rating</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                        <div className="text-gray-600">Support Available</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                        <div className="text-2xl font-bold text-orange-600 mb-1">Free</div>
                        <div className="text-gray-600">To Join & Use</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderIllustration;