import { FaXmark } from "react-icons/fa6";

export default function ModalCreate({ onClose, visible, handleInput, handleCreate }) {
  if (!visible) return null;
  return (
    <>
      <div className="justify-center items-center flex fixed inset-0 z-10 text-base">
        <div className="w-1/2 mx-auto bg-white p-6 font-roboto rounded-lg shadow-lg relative flex flex-col gap-4">
          <div className="flex items-start font-semibold text-lg">
            Tambah Domain
            <button
              className="p-1 rounded hover:bg-red hover:text-white ml-auto ease transition-all duration-300"
              onClick={onClose}
            >
              <FaXmark className="" />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex flex-col w-full gap-1">
                <label className="text-sm">Nama Domain</label>
                <input
                  type="text"
                  placeholder="Masukkan nama domain"
                  onChange={(e) => handleInput(e, "domainName")}
                  className="my-2 w-full rounded-sm p-2 bg-transparent text-black text-sm border"
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label className="text-sm">Alamat IP</label>
                <input
                  type="text"
                  placeholder="Masukkan alamat IP"
                  onChange={(e) => handleInput(e, "ARecord")}
                  className="my-2 w-full rounded-sm p-2 bg-transparent text-black text-sm border"
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-end gap-2">
              <button
                className="text-black hover:text-accent rounded-md py-2 px-4 ease transition-all duration-300"
                onClick={onClose}
              >
                Batal
              </button>
              <button
                className="py-2 px-4 rounded-md text-white ease transition-all duration-300 hover:bg-secondary bg-accent"
                onClick={() => {
                  handleCreate();
                  onClose();
                }}
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="opacity-50 fixed inset-0 z-[1] bg-black"
        id="container"
      ></div>
    </>
  );
}
