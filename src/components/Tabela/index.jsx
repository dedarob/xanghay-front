import { FaDollarSign, FaPen, FaPlus, FaTrash } from "react-icons/fa";

import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import styles from "./Tabela.module.css";

const Tabela = ({
  rows,
  columns,
  onRowClick,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onDollarClick,
  showActions = true,
  className,
}) => {
  return (
    <div className={className}>
      {showActions && (
        <div className={styles.areaAcoes}>
          {onAddClick && (
            <button onClick={onAddClick} className={styles.botaoAdd}>
              <FaPlus />
            </button>
          )}
        </div>
      )}
      <div className={styles.areaTabela}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          autoHeight
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0
              ? styles.rowWhite
              : styles.rowGray
          }
          onRowClick={onRowClick}
        />
      </div>
    </div>
  );
};

Tabela.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

export default Tabela;
