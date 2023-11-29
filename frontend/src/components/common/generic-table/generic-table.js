import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Paper, Checkbox, Radio } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import Spinner from '../../common/spinner/spinner';
import { Link } from 'react-router-dom';


const headCellSelect = {
    id: 'selected',
    numeric: false,
    disablePadding: false,
    label: ''
};

function descendingComparator(a, b, orderBy, numeric) {
    let var1 = a[orderBy]
    let var2 = b[orderBy]

    if (numeric) {
        try {
            var1 = parseFloat(var1)
            var2 = parseFloat(var2)
        } catch (e) {
            // pass
        }
    } else {
        try {
            var1 = var1 ? var1.toLowerCase() : ""
            var2 = var2 ? var2.toLowerCase() : ""
        } catch (e) {
            // pass
        }
    }

    if (var2 < var1) {
        return -1;
    }
    if (var2 > var1) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy, headCells) {
    let header = headCells.find(x => x.id == orderBy)
    let numeric = header ? header.numeric : false
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy, numeric)
        : (a, b) => -descendingComparator(a, b, orderBy, numeric);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function defaultLabelDisplayedRows({ from, to, count }) {
    return `${from}–${to} of ${count !== -1 ? count : `more from ${to}`}`;
}

function TitleInHeader(props) {
    let span = props.headers ? props.headers.length : 0
    return (
        <TableHead>
            <TableRow sx={{ borderBottom: (theme) => '1.1px solid ' + theme.palette.primary.main + '!important' }}>
                <TableCell colSpan={span}>
                    {props.title}
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        if (props.serverPagination || (!props.serverPagination && props.enableClientOrder)){
            onRequestSort(event, property);
        }
    };

    return (
        <TableHead>
            <TableRow sx={{ borderBottom: (theme) => '1.1px solid ' + theme.palette.primary.main + '!important' }}>
                {props.headCells.map((headCell, index) => (
                    <TableCell
                        key={headCell.id + index}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={props.orderBy === headCell.id ? props.order : false}
                        sx={headCell.width ? { width: headCell.width } : {}}
                    >
                        {
                            headCell.disableSort ?
                                headCell.label
                            :
                                <TableSortLabel
                                    active={props.orderBy === headCell.id}
                                    direction={props.orderBy === headCell.id ? props.order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {props.orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {props.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                        }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}




function GenericTable(props) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(!props.hidePagination ? 10 : 1000);

    const [orderBy, setOrderBy] = useState(null);
    const [order, setOrder] = useState(null);

    const handleRequestSort = (event, property) => {
        if (props.serverPagination){

            const isAsc = props.orderBy === property && props.order === 'asc';

            if (props.setOrder) {
                props.setOrder(isAsc ? 'desc' : 'asc');
            }

            if (props.setOrderBy) {
                props.setOrderBy(property);
            }

            setPage(0);
        }
        else {
            const isAsc = orderBy === property && order === 'asc';

            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
        }

    };

    const handleChangePage = (event, newPage) => {
        if (props.serverPagination) {
            if (props.pageConfig == null || newPage !== props.pageConfig.current) {
                props.setPageConfig({ current: newPage, size: props.pageConfig ? props.pageConfig.size : 10, showSpinner: true });
            }
        } else {
            setPage(newPage);
        }
    };

    const handleChangeRowsPerPage = (newRowsPerPage) => {
        if (props.serverPagination) {
            if (props.pageConfig || newRowsPerPage !== props.pageConfig.size) {
                props.setPageConfig({ current: 0, size: parseInt(newRowsPerPage.target.value, 10), showSpinner: true });
            }
        } else {
            setRowsPerPage(parseInt(newRowsPerPage.target.value, 10));
            setPage(0);
        }
    };

    useEffect(() => {
        if (props.rows.length > 0) {
            setPage(0);
        }
        if (props.selectableRows && props.setSelectedRows) {
            props.setSelectedRows([]);
        }
    }, [props.rows]);

    const handleCheck = (e, row) => {
        //EVITA EL ONCLICK EN LA FILA:
        e.stopPropagation();

        let attributeForSelection = props.attributeForSelection ? row[props.attributeForSelection] : row.id;

        //YA ESTA SELECCIONADA
        if (props.selectedRows.includes(attributeForSelection)) {
            if (props.singleSelection) { //SI SE PERMITE SOLO UNA SELECCIONADA Y YA ESTABA CHECK, ENTONCES LIMPIAMOS
                props.setSelectedRows([]);
            }
            else { //SI SE PERMITE MULTIPLE Y YA ESTABA CHECK, ENTONCES SACAMOS LA QUE HICIERON CLICK
                let indexToRemove = props.selectedRows.indexOf(attributeForSelection);
                let left = props.selectedRows.slice(0, indexToRemove);
                let right = props.selectedRows.slice(indexToRemove + 1);
                props.setSelectedRows(left.concat(right));
            }
        }
        //NO ESTA SELECCIONADA
        else {
            if (props.singleSelection) { //SI SE PERMITE UNA SOLA, LA SETEAMOS Y SACAMOS LA ANTERIOR
                props.setSelectedRows([attributeForSelection])
            }
            else { //SI PERMITE MULTIPLE, LA AGREGAMOS A LAS ANTERIORES
                props.setSelectedRows(props.selectedRows.concat([attributeForSelection]))
            }
        }
    }

    return (
        <Box>
            {
                props.isSearching ?
                    <Box sx={{ mt: 5 }}>
                        <Spinner></Spinner>
                    </Box>
                    :
                    <Paper sx={{ width: '100%', mb: 0, background: (theme) => theme.palette.background.main, color: 'white', boxShadow: 'none' }}>
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle"
                                size='small'
                            >
                                {props.titleInHeader ?
                                    <TitleInHeader
                                        title={props.titleInHeader}
                                        headers={props.headCells}
                                    /> 
                                    :
                                    <EnhancedTableHead
                                        order={props.serverPagination ? props.order : order}
                                        orderBy={props.serverPagination ? props.orderBy : orderBy}
                                        serverPagination={props.serverPagination}
                                        enableClientOrder={props.enableClientOrder}
                                        onRequestSort={handleRequestSort}
                                        rowCount={props.serverPagination ? props.totalRows : props.rows.length}
                                        headCells={props.selectableRows ? [headCellSelect].concat(props.headCells) : props.headCells}
                                    /> 
                                }

                                <TableBody>
                                    {stableSort(props.rows, props.serverPagination ? (a, b) => 0 : getComparator(order, orderBy, props.headCells))
                                        .slice(props.serverPagination ? 0 : page * rowsPerPage, props.serverPagination ? props.rows.length : page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            return (

                                                <TableRow
                                                    hover
                                                    onClick={(!props.withRedirection && props.onClickRow) ? () => {props.onClickRow(row.id)} : null}
                                                    to={(props.withRedirection && props.onClickRow) ? () => { return props.onClickRow(row.id)} : null}
                                                    component={props.withRedirection ? Link : null}
                                                    
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={props.attributeForSelection ? row[props.attributeForSelection] : row.id}
                                                    sx={{ borderCollapse: 'unset!important' , textDecoration: 'none'}}
                                                    className={(props.onClickRow ? 'with-hover ' : '') + (props.selectableRows && props.selectedRows.includes(props.attributeForSelection ? row[props.attributeForSelection] : row.id) ? 'selected-row' : '')}
                                                >
                                                    {
                                                        props.selectableRows ?
                                                            <TableCell sx={{ borderBottom: 'none', m: 0, p: 0, width: '20px' }} align="center">
                                                                {
                                                                    props.singleSelection ?
                                                                        <Radio
                                                                            checked={
                                                                                props.selectedRows.includes(props.attributeForSelection ?
                                                                                    row[props.attributeForSelection]
                                                                                    :
                                                                                    row.id)
                                                                            }
                                                                            onClick={(e) => handleCheck(e,row)}
                                                                        />
                                                                        :
                                                                        <Checkbox
                                                                            checked={
                                                                                props.selectedRows.includes(props.attributeForSelection ?
                                                                                    row[props.attributeForSelection]
                                                                                    :
                                                                                    row.id)
                                                                            }
                                                                            onClick={(e) => handleCheck(e,row)}
                                                                        />
                                                                }

                                                            </TableCell>
                                                            : null
                                                    }

                                                    {
                                                        props.renderCells(row)
                                                    }
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                            {
                                props.rows.length === 0 ?
                                    <Grid container mt={2} justifyContent="center" alignItems="center" height="100%">
                                        <Typography variant="span" sx={{ color: (theme) => theme.palette.lightGrey.main }}>No matches found.</Typography>
                                    </Grid>
                                    : null
                            }
                        </TableContainer>
                        {
                            !props.hidePagination ?
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50]}
                                    component="div"
                                    count={props.serverPagination ? props.totalRows : props.rows.length}
                                    rowsPerPage={props.serverPagination ? ((props.pageConfig ? props.pageConfig.size : 10) ) : rowsPerPage}
                                    page={props.serverPagination ? ((props.pageConfig ? props.pageConfig.current : 0)) : page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    labelRowsPerPage="Amount per page:"
                                    labelDisplayedRows={props.serverPagination ? defaultLabelDisplayedRows : defaultLabelDisplayedRows}
                                />
                                : ''
                        }
                    </Paper>
            }
        </Box>
    );

}

export default GenericTable;