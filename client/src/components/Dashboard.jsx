import { useState } from "react";
import ModalCreate from "./ModalCreate";
import ModalUpdate from "./ModalManage";

export default function Dashboard({
  domains,
  handleInput,
  handleCreate,
  handleUpdate,
  handleLookup,
  handleDelete,
}) {
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [domain, setDomain] = useState({});

  const handleOnClose = () => {
    setShowModalCreate(false);
    setShowModalUpdate(false);
  };

  return (
    <div className="flex flex-col gap-6 pt-6 text-black">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard Domain</h1>
        <button
          className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-secondary ease transition-all duration-300"
          onClick={() => setShowModalCreate(true)}
        >
          Tambah Domain
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between w-full text-start font-bold border-b pb-3">
          <h2 className="w-1/3">Nama Domain</h2>
          <h2 className="w-1/3">Alamat IP</h2>
          <h2 className="w-20"></h2>
        </div>
        {domains.length > 0 ? (
          domains.map((domain, index) => (
            <div
              key={index}
              className="flex flex-row justify-between pb-3 w-full border-b items-center"
            >
              <h2 className="w-1/3">{domain.domainName}</h2>
              <h2 className="w-1/3">{domain.ARecord}</h2>
              <button
                className="w-20 bg-accent hover:bg-secondary text-white px-4 py-2 rounded-lg ease transition-all duration-300"
                onClick={() => {
                  setDomain(domain);
                  setShowModalUpdate(true);
                }}
              >
                Kelola
              </button>
            </div>
          ))
        ) : (
          <div className="text-lg text-center pt-10">
            Belum ada domain terdaftar.
          </div>
        )}
      </div>
      <ModalCreate
        onClose={handleOnClose}
        visible={showModalCreate}
        handleInput={handleInput}
        handleCreate={handleCreate}
      />
      <ModalUpdate
        row={domain}
        onClose={handleOnClose}
        visible={showModalUpdate}
        handleInput={handleInput}
        handleUpdate={(domainName) => handleUpdate(domainName)}
        handleDelete={(domainName) => handleDelete(domainName)}
      />
    </div>
  );
}
