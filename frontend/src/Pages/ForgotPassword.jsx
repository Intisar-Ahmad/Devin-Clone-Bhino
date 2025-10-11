import React from 'react'

const ForgotPassword = () => {
const [email, setEmail] = React.useState('');
const [isSending, setIsSending] = React.useState(false);
const [sent, setSent] = React.useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate sending reset link
    setTimeout(() => {
        setIsSending(false);
        setSent(true);
    }, 1800);
};

return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="bg-gray-950 bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h1 className="text-4xl font-extrabold text-white mb-2 text-center tracking-wide">Bevin</h1>
            <p className="text-gray-400 text-center mb-8">Reset your password</p>
            {!sent ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="mt-1 w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="you@bevin.ai"
                            disabled={isSending}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 text-white font-bold rounded-lg hover:scale-105 transition-transform"
                        disabled={isSending}
                    >
                        {isSending ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    <p className="text-white text-lg font-semibold mb-2">Check your inbox</p>
                    <p className="text-gray-400 text-center text-sm">We've sent a password reset link to <span className="font-medium text-blue-400">{email}</span>. Please check your email to continue.</p>
                </div>
            )}
            <div className="mt-6 text-center">
                <button
                    className="text-gray-500 hover:text-gray-300 text-xs"
                    onClick={() => window.location.href = '/login'}
                >
                    Back to login
                </button>
            </div>
        </div>
    </div>
)
}

export default ForgotPassword