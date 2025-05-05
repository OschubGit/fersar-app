import React from "react";
import { Button, Drawer, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export function MantineDrawer({
  children,
  open,
  close,
}: {
  open: boolean;
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <Drawer
        opened={open}
        onClose={close}
        title={
          <Text size="lg" fw={600}>
            Nueva lectura
          </Text>
        }
      >
        {children}
      </Drawer>
    </>
  );
}
