import React, { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";

export const MantineModal = ({ title = "Modal Title", children }) => {
  const [opened, { close }] = useDisclosure(false);

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
        close();
      }
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title={title}>
        {children}
      </Modal>
    </>
  );
};
