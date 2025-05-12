import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import DialogSincronizeData from "./DialogSincronize";
import { ButtonExportCsv } from "./ButtonExportData";
import { Filters } from "./Filters";

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      {/* <List>
        <Filters />
      </List> */}
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <Button
              variant="outlined"
              onClick={() => setOpenDialog(!openDialog)}
              endIcon={<SyncIcon />}
            >
              Sincronizar datos
            </Button>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ButtonExportCsv />
          </ListItemButton>
        </ListItem>
      </List>
      <DialogSincronizeData
        open={openDialog}
        onClose={() => setOpenDialog(!openDialog)}
      />
    </Box>
  );

  return (
    <div>
      <MenuIcon onClick={toggleDrawer(true)} />
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
