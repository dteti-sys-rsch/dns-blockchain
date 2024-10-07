export default function About({ loading, connectWallet }) {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-4xl font-bold pb-4">
        Selamat Datang di Masa Depan Layanan DNS
      </h1>
      <p className="text-lg w-3/4 pb-10">
        Kelola dan daftarkan domain secara aman, terdesentralisasi, dan tanpa
        perantara di jaringan Ethereum dengan DeNS, sebuah platform inovatif
        yang menghadirkan layanan DNS ke era blockchain.
      </p>
      <button
        className={
          "bg-accent text-white px-4 py-2 rounded-lg transition ease-in-out duration-300 " +
          (loading ? "cursor-wait hover:bg-primary" : "hover:bg-secondary")
        }
        onClick={connectWallet}
      >
        Hubungkan Wallet
      </button>
    </div>
  );
}
