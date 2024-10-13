import { FaXmark } from "react-icons/fa6";

export default function ModalUpdate({
  row,
  onClose,
  visible,
  handleInput,
  handleUpdate,
  handleDelete,
}) {
  if (!visible) return null;
  console.log(row.domainName);
  return (
    <>
      <div className="justify-center items-center flex fixed inset-0 z-10 text-base">
        <div className="w-1/3 mx-auto bg-white p-6 font-roboto rounded-lg shadow-lg relative flex flex-col gap-4">
          <div className="flex items-center font-semibold text-lg">
            Kelola Domain
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
                  defaultValue={row.domainName}
                  onChange={(e) => handleInput(e, "domainName")}
                  className="my-2 w-full rounded-lg p-2 bg-transparent text-black text-sm border"
                  disabled
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label className="text-sm">Alamat IP</label>
                <input
                  type="text"
                  defaultValue={row.ARecord}
                  onChange={(e) => handleInput(e, "ARecord")}
                  className="my-2 w-full rounded-lg p-2 bg-transparent text-black text-sm border"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <button
                className="text-red hover:bg-red hover:text-white rounded-md py-2 px-4 ease transition-all duration-300"
                onClick={() => {
                  handleDelete(row.domainName);
                  onClose();
                }}
              >
                Hapus
              </button>
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
                    handleUpdate(row.domainName);
                    onClose();
                  }}
                >
                  Ubah
                </button>
              </div>
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
