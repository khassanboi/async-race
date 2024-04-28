import './CarListStyles.css';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { Button } from '../Button/Button';

interface CarListProps {
  cars: {
    id: number;
    name: string;
    color: string;
  }[];
}

const columns: GridColDef[] = [
  {
    field: 'carName',
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
    field: 'raceRoad',
    flex: 4,
    renderCell: (params: GridRenderCellParams) => (
      <div className="cars__car-road">
        <div
          className="cars__car-icon"
          style={{ backgroundColor: params.row.carColor }}
        >
          Car
        </div>
      </div>
    ),
  },
];

export const CarList = (props: CarListProps) => {
  const rows: GridRowsProp = props.cars.map((car: any) => ({
    id: car.id,
    carName: car.name,
    carColor: car.color,
    raceRoad: '',
  }));

  return (
    <main style={{ width: '100%' }} className="cars">
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
          color: '#fff',
          '& .MuiDataGrid-cell': {
            border: 0,
            borderRight: 0.1,
          },
        }}
      />
    </main>
  );
};
