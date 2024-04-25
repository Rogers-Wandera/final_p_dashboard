import { Alert, Modal } from "@mantine/core";
import { user } from "../../users";
import { useTableTheme } from "../../../../../../helpers/tabletheme";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import React, { useState } from "react";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import { permissionstype } from "./assignedroles";
import {
  useDeleteDataMutation,
  usePostDataMutation,
} from "../../../../../../store/services/apislice";
import { handleError } from "../../../../../../helpers/utils";
import { useAppState } from "../../../../../../contexts/sharedcontexts";
import { enqueueSnackbar } from "notistack";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";

export interface permissionsprops {
  close: () => void;
  opened: boolean;
  title: string;
  userdata: user;
  permissions: permissionstype[];
  roleId: number;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setPermissions: React.Dispatch<React.SetStateAction<permissionstype[]>>;
}
function PermissionAssign({
  close,
  opened,
  title,
  userdata,
  permissions,
  roleId,
  reload,
  setReload,
  setPermissions,
}: permissionsprops) {
  const theme = useTableTheme();
  const [addPermission] = usePostDataMutation({});
  const [deletePermission] = useDeleteDataMutation({});
  const appState = useAppState();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleToggle = async (value: {
    linkId: number;
    id: number;
    checked: number;
    rpId: number;
  }) => {
    try {
      const { linkId, id, rpId, checked } = value;
      const postdata = { permissionId: id, userId: userdata.id, roleId };
      let url = `/rolepermission/user/${linkId}`;
      let method = "POST";
      let response = {} as any;
      if (checked === 1) {
        url = `/rolepermission/${rpId}`;
        method = "DELETE";
      }
      if (method === "POST") {
        response = await addPermission({
          url: url,
          data: postdata,
        });
      } else {
        response = await deletePermission({
          url: url,
          data: postdata,
        });
      }
      if ("error" in response) {
        throw response.error;
      }
      setReload(!reload);
      enqueueSnackbar(response.data.msg, {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
    } catch (error) {
      handleError(error, appState, enqueueSnackbar);
    }
  };

  const HandleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    if (value !== "") {
      const newdata: permissionstype[] = permissions.filter((item) =>
        item.accessName.toLowerCase().includes(value)
      );
      if (newdata.length > 0) {
        setPermissions(newdata);
      }
    } else {
      setReload(!reload);
    }
  };
  return (
    <div>
      <Modal
        opened={opened}
        onClose={close}
        size="lg"
        title={`Assign or Remove ${title} Permissions from ${userdata.userName}`}
        styles={{
          content: { backgroundColor: theme.palette.background.default },
          header: { backgroundColor: theme.palette.background.default },
          title: {
            fontSize: "1rem",
            fontWeight: "bold",
            borderBottom: "1px solid black",
            padding: 10,
          },
        }}
        zIndex={999}
      >
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
          {permissions.length > 0 && (
            <List
              sx={{ width: "100%", maxWidth: 600, bgcolor: "background.paper" }}
            >
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 400,
                  margin: "1rem auto",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={`Search ${title} Permissions`}
                  inputProps={{ "aria-label": `Search ${title} Permissions` }}
                  value={searchTerm}
                  onInput={HandleSearch}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              </Paper>
              {permissions.map((value) => {
                const labelId = `checkbox-list-label-${value.id}`;

                return (
                  <ListItem
                    key={value.id}
                    secondaryAction={
                      <IconButton edge="end" aria-label="comments">
                        <CommentIcon />
                      </IconButton>
                    }
                    disablePadding
                  >
                    <ListItemButton
                      onClick={() => {
                        handleToggle({
                          linkId: value.linkId,
                          id: value.id,
                          checked: value.checked,
                          rpId: value.rpId,
                        });
                      }}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={value.checked === 1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={value.accessName}
                        secondary={value.description}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
          {permissions.length <= 0 && (
            <Alert
              variant="light"
              color="blue"
              title="Alert title"
              icon={<HelpCenterIcon />}
            >
              No {title} Permissions found
            </Alert>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default PermissionAssign;
