import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

let id = 0;
function createData(operación, values) {
  id += 1;
  return { id, operación, values };
}

class SimpleTable extends Component{
  constructor(props){
      super(props);
      this.state={
        dataTable:[]
      }
  }
  componentWillMount(){
    this.setState({
          tableData:this.props.tableData
    });
  }
  render(){
    const { classes,dataTable } = this.props;
    const rows = [
      createData('Número de cuenta:', dataTable.numCuenta),
      createData('Disponible:', dataTable.monto),
      createData('Fecha de operación:', dataTable.fecha),
    ];
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Mostrando Saldos de la Tarjeta ******{dataTable.numTarjeta}</TableCell>
              <TableCell align="right">Datos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              return (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.operación}
                  </TableCell>
                  <TableCell align="right">{row.values}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );

  }
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);