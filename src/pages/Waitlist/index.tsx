import { Input, Button } from "antd-mobile"
import { Settings } from "lucide-react"

export default function Waitlist() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">beta</span>
          <h1 className="text-xl font-bold">app.page</h1>
        </div>
        <Button fill="none" className="p-2">
          <Settings className="h-5 w-5 text-gray-500" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Get early access to app.page</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-md">
          Join the waitlist to secure your app page
          <br />
          <span className="text-sm text-gray-500">e.g. https://company.app.page</span>
        </p>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-md">
          <Input
            placeholder="Enter your email"
            className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            type="email"
          />
          <Button color="primary" className="w-full sm:w-auto px-6 py-3 rounded-md bg-black text-white">
            Join waitlist
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-200">
        We're building app.page in 2025, and we need your help to make it happen!
        <br />
        Help us by answering some{" "}
        <a href="#" className="text-blue-600 underline">
          questions
        </a>{" "}
        about your needs ❤️
      </footer>
    </div>
  )
}
