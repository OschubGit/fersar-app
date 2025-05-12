import React, { useEffect, useState } from "react";
import { useContadoresSotre } from "../store/contdores";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DialogDownloadData from "./DialogDownloadData";
import dayjs from "dayjs";

export const ButtonExportCsv = () => {
  const [open, setOpen] = useState(false);
  const downloadData = useContadoresSotre((store) => store.downloadData);

  const handleExport = async (value: boolean) => {
    const datos = await downloadData(
      value === false ? undefined : { estado: "REVISADO" },
    );

    if (!Array.isArray(datos) || datos.length === 0) return;
    const headers = Object.keys(datos[0])
      .filter((key) => key !== "position") // Si quieres excluir 'position'
      .join(",");

    const rows = datos
      .map((obj) => {
        return Object.entries(obj)
          .filter(([key]) => key !== "position") // También aquí
          .map(([key, value]) => {
            // Tratar ultima_lectura: obtener lectura del objeto con id más alto
            if (key === "ultima_lectura" && Array.isArray(value)) {
              const latest = value.reduce(
                (max, curr) => (curr.id > max.id ? curr : max),
                value[0],
              );
              return `"${latest?.lectura ?? ""}"`;
            }

            // Resto de propiedades
            return `"${
              typeof value === "object"
                ? JSON.stringify(value)
                : String(value).replace(/"/g, '""')
            }"`;
          })
          .join(",");
      })
      .join("\n");

    const csvContent = [headers, rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `contadores-${dayjs(new Date(), "MM-DD-YYYY")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        endIcon={<DownloadIcon />}
      >
        Descargar datos
      </Button>
      <DialogDownloadData
        open={open}
        onClose={() => setOpen(!open)}
        handleAction={handleExport}
      />
    </>
  );
};
