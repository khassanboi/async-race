import * as React from 'react';
import './WinnerListStyles.css';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';

const rows: GridRowsProp = [
  {
    id: 1,
    carIcon: '#00ff00',
    carName: 'Tesla Model X',
    carWins: 15,
    carBestTime: 2.77,
  },
  {
    id: 2,
    carIcon: '#0000ff',
    carName: 'BMW X7',
    carWins: 5,
    carBestTime: 3.77,
  },
  {
    id: 3,
    carIcon: '#ff0000',
    carName: 'Audi Q7',
    carWins: 10,
    carBestTime: 3.77,
  },
];

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: '№',
    flex: 1,
  },
  {
    field: 'carIcon',
    headerName: 'Car',
    flex: 1,

    renderCell: (params: GridRenderCellParams) => (
      <div className="winners__winner-icon">Car</div>
    ),
  },
  {
    field: 'carName',
    headerName: 'Name',
    flex: 1,
  },
  {
    field: 'carWins',
    headerName: 'Wins',
    flex: 1,
  },
  {
    field: 'carBestTime',
    headerName: 'Best Time (Seconds)',
    flex: 1,
  },
];

export const WinnerList = () => {
  return (
    <main style={{ width: '100%' }} className="winners">
      <DataGrid
        className="winners__list"
        rows={rows}
        columns={columns}
        rowHeight={50}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 7, page: 0 },
          },
        }}
        sx={{
          border: 0,
          color: '#fff',
          backgroundColor: 'transparent',
          '& .MuiDataGrid-cell': {
            border: 0,
            borderRight: 0,
            borderRadius: 0,
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#000',
            textTransform: 'uppercase',
          },
        }}
      />
    </main>
  );
};
