import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  DataGrid,
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridSlotProps,
  GridRowEditStopReasons,
  GridRowModel,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { randomTraderName, randomId } from "@mui/x-data-grid-generator";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  deleteUser,
  getUserApi,
  updateUser,
} from "../../features/user/userAPIs";
import { getUser } from "../../features/user/userSlice";
import { User } from "../../features/user/userTypes";
import { Paper } from "@mui/material";
import MyModal from "../modal/modal";
import { setMessage } from "../../features/message/messagSlice";

const roles = ["Admin", "Customer"];

const initialRows: GridRowsProp = [
  {
    id: 12,
    name: randomTraderName(),
    email: "test@test.com",
    calorie: 5000,
    level: "Admin",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    password_digest: "hashed_password",
  },
];

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
  }
}

function EditToolbar(props: GridSlotProps["toolbar"]) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, name: "", age: "", role: "", isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

const validateUserForm = (userForm: User) => {
  const error = {
    name: "",
    calorie: "",
  };
  if (userForm.name.length < 3) {
    error.name = "Name must be at least 3 characters.";
  }
  if (userForm.calorie < 0) {
    error.calorie = "Calorie must be greater than or equal to 0.";
  }
  return !(error.name || error.calorie);
};

export default function MyTable() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [seelectedRowId, selectRowId] = useState<GridRowId | null>(null);

  const userList = useAppSelector((state) => state.user.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUserApi();
        const users: User[] = response.data; // Extract data correctly
        dispatch(getUser(users));
        setRows(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // Call the function inside useEffect
  }, []);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    // setRows(rows.filter((row) => row.id !== id));
    selectRowId(id);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(seelectedRowId as number);
      setRows(rows.filter((row) => row.id !== seelectedRowId));
      setOpen(false);
    } catch (error) {}
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (
    newRow: GridRowModel,
    oldRow: GridRowModel
  ) => {
    if (!validateUserForm(newRow as User)) {
      setRowModesModel((prevModel) => ({
        ...prevModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      }));
      dispatch(setMessage({
        type: "warning",
        message: "Invalid user data"
      }))
      return null; // Revert to the old row
    }

    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    await updateUser(newRow as User);
    dispatch(
      setMessage({
        type: "success",
        message: "The user data is saved successfully",
      })
    );

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 3, editable: true },
    {
      field: "email",
      headerName: "Email",
      flex: 3,
    },
    {
      headerAlign: "left",
      field: "calorie",
      headerName: "Calorie",
      type: "number",
      flex: 3,
      align: "left",
      editable: true,
    },
    {
      field: "level",
      headerName: "Role",
      flex: 3,
      editable: true,
      type: "singleSelect",
      valueOptions: roles,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: "primary.main" }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Paper
      elevation={24}
      sx={{
        m: 4,
        p: 3,
      }}
    >
      <Box
        sx={{
          height: 500,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          // slots={{ toolbar: EditToolbar }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>
      <MyModal
        open={open}
        title="Confirm"
        text="Please confirm if you want to delete the user data."
        handleCancel={() => setOpen(false)}
        handleOk={() => {
          handleDelete();
        }}
      />
    </Paper>
  );
}
