import * as React from "react";
import "./CarListStyles.css";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Button } from "../Button/Button";

const rows: GridRowsProp = [
  { id: 1, carInfo: "Tesla Model X", raceRoad: "" },
  { id: 2, carInfo: "BMW X7", raceRoad: "" },
  { id: 3, carInfo: "Mercedes 300", raceRoad: "" },
  { id: 4, carInfo: "Tesla Model X", raceRoad: "" },
  { id: 5, carInfo: "BMW X7", raceRoad: "" },
  { id: 6, carInfo: "Mercedes 300", raceRoad: "" },
  { id: 7, carInfo: "Tesla Model X", raceRoad: "" },
  { id: 8, carInfo: "BMW X7", raceRoad: "" },
  { id: 9, carInfo: "Mercedes 300", raceRoad: "" },
];

const columns: GridColDef[] = [
  {
    field: "carInfo",
    flex: 1,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams) => (
      <div className="cars__car">
        <div className="cars__car-control">
          <Button className="btn--blue btn--small">Select</Button>
          <Button className="btn--active btn--small">A</Button>
          <Button className="btn--red btn--small">Remove</Button>
          <Button className="btn--inactive btn--small">B</Button>
        </div>
        <h3 className="cars__car-name">{params.value}</h3>
      </div>
    ),
  },
  {
    field: "raceRoad",
    flex: 4,
    renderCell: (params: GridRenderCellParams) => (
      <div className="cars__car-road">
        <div className="cars__car-icon">Car</div>
      </div>
    ),
  },
];

export const CarList = () => {
  return (
    <main style={{ width: "100%" }} className="cars">
      <DataGrid
        className="cars__list"
        rows={rows}
        columns={columns}
        columnHeaderHeight={0}
        rowHeight={80}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 7, page: 0 },
          },
        }}
        sx={{
          border: 0,
          color: "#fff",
          "& .MuiDataGrid-cell": {
            border: 0,
            borderRight: 0.1,
          },
        }}
      />
    </main>
  );
};
