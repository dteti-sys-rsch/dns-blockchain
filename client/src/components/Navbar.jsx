import { FaArrowsRotate } from "react-icons/fa6";

export default function Navbar({
  loading,
  connectWallet,
  handleFetch,
  account,
}) {
  return (
    <div className="absolute w-full mx-auto h-16 border-primary border-b font-inter">
      <div className="flex flex-row justify-between items-center text-primary h-full px-20">
        <p className="font-bold">DeNS</p>
        {account ? (
          <div className="flex flex-row items-center gap-4">
            <p>{account}</p>
            <button
              className="p-2 bg-accent hover:bg-secondary text-white rounded-md ease transition-all duration-300"
              onClick={handleFetch}
            >
              <FaArrowsRotate/>
            </button>
          </div>
        ) : (
          <button
            className={
              "bg-accent text-white px-4 py-2 rounded-lg ease transition-all duration-300 " +
              (loading ? "cursor-wait hover:bg-primary" : "hover:bg-secondary")
            }
            onClick={connectWallet}
          >
            Hubungkan Wallet
          </button>
        )}
      </div>
    </div>
  );
}
