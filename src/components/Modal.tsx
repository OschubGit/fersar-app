import React, { useEffect } from "react";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  info?: any;
  children: React.ReactNode;
}

export const CustomModal = ({
  isOpen,
  onClose,
  title,
  info,
  children,
}: ModalProps) => {
  const url = `https://ouhy3iu4hy34y34hy3hy.rubenrc.dev/api/contadores/${info.key}/lecturas`;
  const options = {
    method: "GET",
    headers: {
      authorization:
        "Bearer 2|QbbPfKjLHwTMOixGeMdn8Vkwpg7Ke0iXEG954tENe60b5370",
    },
  };

  const fetchUrl = async () => {
    try {
      const response = await fetch(url, options);
      const rawData = await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUrl();
  }, [info]);

  const handleSave = (id) => {
    if (window?.localStorage.getItem("data")) {
      const getData = window.localStorage.getItem("data");
      if (getData) {
        const parse = JSON.parse(getData);

        const updated = parse.map((item) =>
          item?.key === Number(id) ? { ...item, read: true } : item
        );

        // Guardamos el nuevo array con el item modificado
        window.localStorage.setItem("data", JSON.stringify(updated));
        window.dispatchEvent(new Event("localStorageUpdated"));
        onClose();
      }
    }
  };
  return isOpen ? (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {title && <h2>{title}</h2>}
        Nombre: {info?.data?.nombre_completo}
        Zona: {info?.data?.zona}
        Zona Num: {info?.data?.zona_numero}
        Parcela: {info?.data?.parcela}
        Poligono: {info?.data?.poligono}
        <div>{children}</div>
        <button onClick={() => handleSave(info?.key)}>Guardar</button>
        <button onClick={onClose} style={styles.button}>
          Cerrar
        </button>
      </div>
    </div>
  ) : null;
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    minWidth: "100%",
    width: "100%",
    maxWidth: "100%",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  },
  button: {
    marginTop: "20px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#333",
    color: "#fff",
    cursor: "pointer",
  },
};
