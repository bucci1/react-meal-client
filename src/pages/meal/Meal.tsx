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
  GridRenderCellParams,
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
import { error } from "console";
import { Paper, TextField } from "@mui/material";
import MyModal from "../modal/modal";
import { title } from "process";
import { Meal } from "../../features/meal/mealTypes";
import { getMeals, updateMeal } from "../../features/meal/mealSlice";
import {
  bookMealApi,
  deleteMealApi,
  getMealsApi,
  updateMealApi,
} from "../../features/meal/mealAPIs";
import { setMessage } from "../../features/message/messagSlice";
import { getAuthTokenFromLocalStorage } from "../../utils/localStorageManager";
import axios from "axios";

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
      {
        id,
        title: "New meal",
        calorie: 100,
        date: new Date().toISOString(),
        time: new Date().toTimeString().slice(0, 5),
        isNew: true,
      },
    ]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "title" },
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

const validateMealForm = (mealForm: Meal) => {
  const error = {
    title: "",
    calorie: "",
  };
  if (mealForm.title.length < 3) {
    error.title = "Name must be at least 3 characters.";
  }
  if (mealForm.calorie < 0) {
    error.calorie = "Calorie must be greater than or equal to 0.";
  }
  return !(error.title || error.calorie);
};

export default function MyTable() {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [seelectedRowId, selectRowId] = useState<GridRowId | null>(null);

  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const fetchMeals = async () => {
    try {
      const response = await getMealsApi();
      const meals: Meal[] = response.data; // Extract data correctly
      dispatch(getMeals(meals));
      setRows(meals);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] =
      getAuthTokenFromLocalStorage();
    if (axios.defaults.headers.common["Authorization"]) {
      fetchMeals();
    }
    // Call the function inside useEffect
  }, [user]);

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
    selectRowId(id);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteMealApi(seelectedRowId as number);
      dispatch(
        setMessage({
          type: "success",
          message: "The meal deleted successfully",
        })
      );
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

  const isExist = (newRow: Meal) => {
    const formatDate = (date: Date): string =>
      `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;

    let isExist = false;
    const newDate = formatDate(new Date(newRow.date));
    rows.forEach((row) => {
      const eDate = formatDate(new Date(row.date));
      console.log(
        eDate,
        newDate,
        row.time,
        newRow.time,
        eDate == newDate,
        row.time == newRow.time
      );

      if (eDate == newDate && row.time == newRow.time && row.id != newRow.id) {
        isExist = true;
      }
    });
    return isExist;
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    if (!validateMealForm(newRow as Meal)) {
      dispatch(
        setMessage({
          type: "warning",
          message: "Invalid meal data",
        })
      );
      return null;
    }

    if (isExist(newRow as Meal)) {
      dispatch(
        setMessage({
          type: "warning",
          message: "The meal exists already",
        })
      );
      return null;
    }

    let oldId = newRow.id;
    try {
      if (newRow.isNew) {
        const bookedMeal = await bookMealApi(newRow as Meal);
        newRow.id = bookedMeal?.id || newRow.id;
        dispatch(
          setMessage({
            type: "success",
            message: "Meal is booked successfully.",
          })
        );
        setRows(rows.filter((row) => row.id !== oldId));
        setRows((rows) => [...rows, newRow]);
      } else {
        await updateMealApi(newRow as Meal);
        dispatch(
          setMessage({
            type: "success",
            message: "Meal is updated successfully.",
          })
        );
      }

      let updatedRow = { ...newRow, isNew: false };
      return updatedRow;
    } catch (error) {
      console.error("Error while saving meal:", error);
      dispatch(
        setMessage({
          type: "warning",
          message: "Failed to save meal. Please try again.",
        })
      );
      return null;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 3, editable: true },
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
      field: "date",
      headerName: "Date",
      type: "date",
      flex: 3,
      align: "left",
      editable: true,
      valueGetter: (params: GridRenderCellParams) => {
        if (typeof params == "string") {
          return new Date(params);
        }

        if (typeof params == "object") {
          return params;
        }
      },
    },
    {
      field: "time",
      headerName: "Time",
      flex: 3,
      editable: true,
      renderEditCell: (params) => (
        <TextField
          type="time"
          value={params.value || ""}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: "time",
              value: e.target.value,
            })
          }
          fullWidth
        />
      ),
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

  console.log(rows);

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
          slots={{ toolbar: EditToolbar }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>
      <MyModal
        open={open}
        title="Confirm"
        text="Do you want to delete the mea?"
        handleCancel={() => setOpen(false)}
        handleOk={() => {
          handleDelete();
        }}
      />
    </Paper>
  );
}
