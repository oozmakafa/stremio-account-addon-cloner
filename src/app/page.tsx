"use client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Alert from "./components/Alert";
import PrimaryAccountForm from "./components/PrimaryAccountForm";
import CloneAccountList from "./components/CloneAccountList";
import CloneControls from "./components/CloneControls";
import { useAccounts } from "./hooks/useAccounts";

export default function Home() {
  const {
    alert,
    setAlert
  } = useAccounts();

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center">
      <Header />

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow p-6 space-y-6 mt-6">
        <PrimaryAccountForm />
        <CloneAccountList />
        <CloneControls />
      </div>

      <Footer />
    </main>
  );
}
