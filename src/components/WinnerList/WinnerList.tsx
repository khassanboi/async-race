import React, { useState, useEffect } from 'react';
import * as api from '../../api/index';
import './WinnerListStyles.css';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';

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
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    api.getWinners().then((res) => {
      setWinners(res.data);
    });
  }, []);

  const rows: GridRowsProp = winners.map((winner: any) => ({
    id: winner.id,
    carIcon: '',
    carName: 'Car Name',
    carBestTime: winner.time,
    carWins: winner.wins,
  }));

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
